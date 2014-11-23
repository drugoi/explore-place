jQuery(function($) {
	var geocoder = new google.maps.Geocoder();
	var markerHelpers = {
		updateMarkerPosition: function(latLng) {
			$('[name="lat"]').val(latLng.lat());
			$('[name="lng"]').val(latLng.lng());
			$('.search__submit').addClass('_danger');
		}
	};

	function initialize() {
		mapOptions.zoom = 16;
		var latLng = mapOptions.center;
		var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		marker = new google.maps.Marker({
			position: mapOptions.center,
			title: 'Место поиска',
			map: map,
			draggable: true
		});
		// Update current position info.
		markerHelpers.updateMarkerPosition(latLng);
		// Add dragging event listeners.
		google.maps.event.addListener(marker, 'drag', function() {
			markerHelpers.updateMarkerPosition(marker.getPosition());
		});
		// Add clicking event listeners
		google.maps.event.addListener(map, 'click', function(event) {
			markerHelpers.updateMarkerPosition(event.latLng);
			marker.setPosition(event.latLng);
		});
	}
	// init map 
	google.maps.event.addDomListener(window, 'load', initialize);
});