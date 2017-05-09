navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 30000 });
function onSuccess(position) {
    var lat=position.coords.latitude;
    var lang=position.coords.longitude;
    console.log(lat + lang);

//Google Maps

    var myLatlng = new google.maps.LatLng(lat,lang);
    var mapOptions = {zoom: 4,center: myLatlng}
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    var marker = new google.maps.Marker({position: myLatlng,map: map});
}
function onError(error) {
    alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}
google.maps.event.addDomListener(window, 'load', onSuccess);
