var API_CLIENT_ID = 'b5796dfc1d0142619e3098544d2d1789'; // production
var API_CONTAINER = '.container';
var API_COUNT = 50;
var mapOptions = {
	mapTypeControl: true,
	mapTypeControlOptions: {
		style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
	},
	zoomControl: true,
	zoomControlOptions: {
		style: google.maps.ZoomControlStyle.SMALL
	},
	scaleControl: true
};
var marker;
var helpers = {
	getParams: function(paramName) {
		paramName = paramName.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
		var regex = new RegExp('[\\?&]' + paramName + '=([^&#]*)'),
			results = regex.exec(location.search);
		return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
	},
	getLocation: function() {
		navigator.geolocation.getCurrentPosition(function(position) {
			updateInfo.updateContainer(position.coords.latitude, position.coords.longitude);
			mapOptions.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			return [position.coords.latitude, position.coords.longitude];
		});
	}
};
jQuery(function($) {
	// working with API
	var updateInfo = {
		updateContainer: function(param_lat, param_lng) {
			$(API_CONTAINER).instagram({
				search: {
					lat: param_lat,
					lng: param_lng,
					distance: 1000,
					count: API_COUNT
				},
				clientId: API_CLIENT_ID
			});
		},
		renderPhotos: function(api_data) {
			$.each(api_data.data, function() {
				$(API_CONTAINER).append('<div class="container__item"><a target="_blank" href="' + this.link + '"><img class="image" src="' + this.images.standard_resolution.url + '"/></a><div class="container__image-info"><a target="_blank" class="container__image-info__name" href="http://instagram.com/' + this.user.username + '">' + this.user.username + '</a></div></div>');
			});
			$('.search__submit').removeClass('_danger');
		},
		updateRequest: function(search__terms) {
			// search__terms = lat, lng
			History.pushState({
				state: 1
			}, 'Изучи мир с помощью Instagram', '?lat=' + search__terms[0] + '&lng=' + search__terms[1]);
			$(API_CONTAINER).empty();
			updateInfo.updateContainer(search__terms[0], search__terms[1]);
		}
	};
	if (helpers.getParams('lat') !== '') {
		var lat = parseFloat(helpers.getParams('lat'));
		var lng = parseFloat(helpers.getParams('lng'));
		updateInfo.updateContainer(lat, lng);
		mapOptions.center = new google.maps.LatLng(lat, lng);
	}
/*
else if ('geolocation' in navigator) {
		helpers.getLocation();
	}
*/
	else {
		updateInfo.updateContainer(51.125957, 71.446396);
		mapOptions.center = new google.maps.LatLng(51.125957, 71.446396);
	}
	$(API_CONTAINER).on('didLoadInstagram', function(event, response) {
		//console.log(response);
		updateInfo.renderPhotos(response);
	});
	// working with Instagram
	$('.search').on('submit', function(event) {
		event.preventDefault();
		var $this = $(this);
		//var $search__form = $this.parent('.search');
		var $search__inputs = $this.find('input');
		var search__terms = [];
		$search__inputs.each(function() {
			var $this = $(this);
			if ($this.val() === '') {
				alert('Вы не заполнили поле ' + $this.data('name'));
			} else {
				search__terms.push($this.val());
			}
		});
		updateInfo.updateRequest(search__terms);
	});
	History.Adapter.bind(window, 'statechange', function() {
		var lat = parseFloat(helpers.getParams('lat'));
		var lng = parseFloat(helpers.getParams('lng'));
		$(API_CONTAINER).empty();
		updateInfo.updateContainer(lat, lng);
	});
});