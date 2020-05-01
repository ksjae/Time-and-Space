class Vehicle {
    constructor(lat,long,battery,serviceType) {
        self.batt = battery;
        self.lat = lat;
        self.long = long;
        self.serviceType = serviceType;
    }
}
var ps = null;
function makeMarker(position, title) {

    let imageSize = new kakao.maps.Size(24, 35); 
    let imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
    
    // 마커 이미지를 생성합니다    
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize); 
    
    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        position: position, // 마커를 표시할 위치
        title : title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        image : markerImage // 마커 이미지 
    });

    return marker;
}
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}
var userLongitude = null;
var userLatitude = null;
function registerPosition(position) {
    userLongitude = position.coords.longitude;
    userLatitude = position.coords.latitude;
}
function init() {
    map = new kakao.maps.Map(document.getElementById('map'), {
        center: new kakao.maps.LatLng(userLatitude, userLongitude),
        zoom: 15
    });
    makeMarker(new kakao.maps.LatLng(userLatitude, userLongitude), 0);
    ps = new kakao.maps.services.Places(); 
}

function searchPlace(keyword) {
    var places = null;
    $('#search-result').text('I am getting refreshed every 3 seconds..! Random Number ==> ');
    //ps.keywordSearch(keyword, function (data, status, pagination) {
    //    console.log(data)
    //});
    
    return places
}

var vehicleMarkerArea = 0.04;

function getKickGoing(lat,long){
    //ID 1
    const Http = new XMLHttpRequest();
    const url='https://api.kickgoing.io/v2/main?latitude='+lat+'&longitude='+long+'&version=1.2.2';
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
        console.log(Http.responseText)
    }
}
/*
function getXingxing(lat,long){
    //ID 2
    const request = new XMLHttpRequest();
    const url='https://api.xingxingmobility.com/api-xingxing/v1/scootersforapp?latitude='+lat+'&longitude='+long+'&zoom=15';
    const bearer = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImF1dGhJZCI6ImhvbmV5YmVlcyIsInVzZXJJZCI6ImhvbmV5YmVlcyIsInJvbGVzIjpbImFwcHhpbmd4aW5nIl19LCJpYXQiOjE1NTUzMzQ3MjMsImV4cCI6ODY1NTU1MzM0NzIzfQ.br5PT0s_vkFFs24Dxv0acPeQizg_TpXtkdEaWRgkSMw"
    request.open("GET", url);
    request.setRequestHeader("Authorization", bearer);  
    request.send();
    request.onreadystatechange = function() {
        if (request.readyState == XMLHttpRequest.DONE) {
            var json = null;
            try {json = JSON.parse(request.responseText);} catch {
                console.log(request.responseText)
            }
            for (var scooter in json.scooter) {
                if (Math.abs(scooter.deviceStatus.location.coordinates[0] - long) < vehicleMarkerArea && Math.abs(scooter.deviceStatus.location.coordinates[1] - lat) < vehicleMarkerArea && scooter.deviceStatus.enable) {
                    console.log(scooter)
                    updateMarker(new Vehicle(scooter.deviceStatus.location.coordinates[1], scooter.deviceStatus.location.coordinates[0], scooter.deviceStatus.battery, 2))
                }
            }
        }
    }
}
*/

function getXingxing(lat,long){
    //ID 2
    const request = new XMLHttpRequest();
    const url='https://api.xingxingmobility.com/api-xingxing/v1/scootersforapp?latitude='+lat+'&longitude='+long+'&zoom=15';
    const bearer = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImF1dGhJZCI6ImhvbmV5YmVlcyIsInVzZXJJZCI6ImhvbmV5YmVlcyIsInJvbGVzIjpbImFwcHhpbmd4aW5nIl19LCJpYXQiOjE1NTUzMzQ3MjMsImV4cCI6ODY1NTU1MzM0NzIzfQ.br5PT0s_vkFFs24Dxv0acPeQizg_TpXtkdEaWRgkSMw"
    var myHeaders = new Headers();
    myHeaders.append('Authorization', bearer);
    fetch(url, {
        mode: 'no-cors', // no-cors, *cors, same-origin
        headers: {
          'Authorization': bearer
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    }).then((response) => {
        if (!response.ok) {
        console.log("Failed to get Xingxing data :(");
        }
        response.json(); // parses JSON response into native JavaScript objects
        try {json = response.json();} catch {
            console.log(request.responseText)
        }
        for (var scooter in json.scooter) {
            if (Math.abs(scooter.deviceStatus.location.coordinates[0] - long) < vehicleMarkerArea && Math.abs(scooter.deviceStatus.location.coordinates[1] - lat) < vehicleMarkerArea && scooter.deviceStatus.enable) {
                console.log(scooter)
                updateMarker(new Vehicle(scooter.deviceStatus.location.coordinates[1], scooter.deviceStatus.location.coordinates[0], scooter.deviceStatus.battery, 2))
            }
        }})
}



function getGbility(lat, long){
    //왜 안되지 뭐 까먹었나
    const request = new XMLHttpRequest();
    const url='https://app.gbike-api.com/api/index.php?route=location/location/getBicycleLocationByBound&version=80&fromApi=ios';
    request.open("POST", url);
    request.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
    let urlEncodedData = "",
      urlEncodedDataPairs = [];
    urlEncodedDataPairs.push( encodeURIComponent( "min_lat" ) + '=' + encodeURIComponent( (lat-0.01) ) );
    urlEncodedDataPairs.push( encodeURIComponent( "min_lng" ) + '=' + encodeURIComponent( (long-0.01) ) );
    urlEncodedDataPairs.push( encodeURIComponent( "max_lat" ) + '=' + encodeURIComponent( (lat+0.01) ) );
    urlEncodedDataPairs.push( encodeURIComponent( "max_lng" ) + '=' + encodeURIComponent( (long+0.01) ) );
    urlEncodedData = urlEncodedDataPairs.join( '&' ).replace( /%20/g, '+' );
    request.send(urlEncodedData);
    request.onreadystatechange = (e) => {
        console.log(request.responseText)
    }
}

function getGogossing(lat,long){
    //12 87 63 165가 뭔뜻일까
    const request = new XMLHttpRequest();
    const url="idk";
    request.open("GET", url);
    let urlEncodedData = "", urlEncodedDataPairs = [];
    urlEncodedDataPairs.push( encodeURIComponent( "latSW" ) + '=' + encodeURIComponent( 12 ) );
    urlEncodedDataPairs.push( encodeURIComponent( "lngSW" ) + '=' + encodeURIComponent( 87 ) );
    urlEncodedDataPairs.push( encodeURIComponent( "latNE" ) + '=' + encodeURIComponent( 63 ) );
    urlEncodedDataPairs.push( encodeURIComponent( "lngNE" ) + '=' + encodeURIComponent( 165 ) );
    request.send();
    request.onreadystatechange = (e) => {
        console.log(request.responseText)
    }
}

function updateMarker(vehicle){
    //DELETE MARKER
    //ADD ACCORDING TO LOCATION
    makeMarker(new kakao.maps.LatLng(vehicle.lat, vehicle.long), "배터리 : " + vehicle.battery + "%")
}