var API_CLIENT_ID = 'b5796dfc1d0142619e3098544d2d1789'; // production
var API_CONTAINER = '.container';
var API_COUNT = 50;
var helpers = {
	getParams: function(paramName) {
		paramName = paramName.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
		var regex = new RegExp('[\\?&]' + paramName + '=([^&#]*)'),
			results = regex.exec(location.search);
		return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
	}
};
jQuery(function($) {
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
				$(API_CONTAINER).append('<a href="' + this.link + '"><img class="container__image" src="' + this.images.standard_resolution.url + '"/></a>');
			});
		},
		updateRequest: function(search__terms) {
			// search__terms = lat, lng
			if (history.pushState) {
				var composeUrl = '?lat=' + search__terms[0] + '&lng=' + search__terms[1];
				var updatedUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + composeUrl;
				window.history.pushState({
					path: updatedUrl
				}, '', updatedUrl);
			}
			$(API_CONTAINER).empty();
			updateInfo.updateContainer(search__terms[0], search__terms[1])
		}
	}
	if (helpers.getParams('lat') !== '') {
		var lat = parseFloat(helpers.getParams('lat'));
		var lng = parseFloat(helpers.getParams('lng'));
		updateInfo.updateContainer(lat, lng);
	} else if ('geolocation' in navigator) {
		navigator.geolocation.getCurrentPosition(function(position) {
			updateInfo.updateContainer(position.coords.latitude, position.coords.longitude);
		});
	} else {
		updateInfo.updateContainer(51.125957, 71.446396);
	}
	$(API_CONTAINER).on('didLoadInstagram', function(event, response) {
		console.log(response);
		updateInfo.renderPhotos(response);
	});
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
});