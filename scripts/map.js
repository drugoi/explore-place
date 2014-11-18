jQuery(function($) {
	var geocoder = new google.maps.Geocoder();

	function geocodePosition(pos) {
		geocoder.geocode({
			latLng: pos
		}, function(responses) {
			if (responses && responses.length > 0) {
				console.log(responses[0].formatted_address);
			} else {
				console.log('Cannot determine address at this location.');
			}
		});
	}
	function updateMarkerStatus(str) {
		console.log(str);
	}
	function updateMarkerPosition(latLng) {
		$('[name="lat"]').val(latLng.lat());
		$('[name="lng"]').val(latLng.lng());
		$('.search__submit').addClass('_danger');
	}

	function initialize() {
		mapOptions.zoom = 16;
		var latLng = mapOptions.center;
		var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		var marker = new google.maps.Marker({
			position: mapOptions.center,
			title: 'Point',
			map: map,
			draggable: true
		});
		// Update current position info.
		updateMarkerPosition(latLng);
		// Add dragging event listeners.
		google.maps.event.addListener(marker, 'drag', function() {
			updateMarkerPosition(marker.getPosition());
		});
		google.maps.event.addListener(marker, 'dragend', function() {
			updateMarkerStatus('Drag ended');
			geocodePosition(marker.getPosition());
		});
	}
	// init map 
	google.maps.event.addDomListener(window, 'load', initialize);
});