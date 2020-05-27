class Vehicle {
    constructor(lat, long, battery, serviceType) {
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
        title: title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        image: markerImage // 마커 이미지 
    });

    return marker;
}
function updateMarker(vehicle) {
    //DELETE MARKER
    //ADD ACCORDING TO LOCATION
    makeMarker(new kakao.maps.LatLng(vehicle.lat, vehicle.long), "배터리 : " + vehicle.battery + "%")
}

function drawLine(linePath){
    // 지도에 표시할 선을 생성합니다
    var polyline = new kakao.maps.Polyline({
        path: linePath, // 선을 구성하는 좌표배열 입니다
        strokeWeight: 5, // 선의 두께 입니다
        strokeColor: '#FFAE00', // 선의 색깔입니다
        strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle: 'solid' // 선의 스타일입니다
    });

    // 지도에 선을 표시합니다 
    polyline.setMap(map); 
}
function lineTest(){
    var linePath = [
        new kakao.maps.LatLng(37.3817767,126.6304981),
        new kakao.maps.LatLng(37.384066, 126.626311)
    ];
    drawLine(linePath);
}


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(registerPosition);
    } else {
        alert("위치 서비스를 이용할 수 없습니다.");
    }
}
var userLongitude = null;
var userLatitude = null;
function registerPosition(position) {
    userLongitude = position.coords.longitude;
    userLatitude = position.coords.latitude;
}
function manualPosSet(){
    userLongitude = $("#search-result").empty();
    userLatitude = $("#search-result").empty();
}
var kickboard = null;
var mylocation = null;;
function init() {
    map = new kakao.maps.Map(document.getElementById('map'), {
        center: new kakao.maps.LatLng(userLatitude, userLongitude),
        zoom: 15
    });
    makeMarker(new kakao.maps.LatLng(userLatitude, userLongitude), 0);
    ps = new kakao.maps.services.Places();
    kickboard = new Kickboard();
    mylocation = {lat: 37.49753128060163, long:127.02815273412143};
    console.log(mylocation);
}

var searchResultBox = {
    show: function () {
        $("#search-result").show();
    },
    hide: function () {
        $("#search-result").hide();
    },
    update: function () {
        //풀네임, 주소, category_group_name 출력
        $("#search-result").empty();
        if (this.results.length > 6) {
            $("#search-result").css('height', 240);
            $("#search-result").css('top', 250);
        } else {
            $("#search-result").css('height', this.results.length * 38);
            $("#search-result").css('top', this.results.length * 40 + 20);
        }
        this.results.slice(0,6).forEach(result => {
            $("#search-result").append("<p class='result-item' onclick='makeMarker(new kakao.maps.LatLng(result.x, result.y), result.place_name)'>" + result.place_name + "<span>" + result.address_name + "</span></p>");
        });
    },
    results: []
}

function searchPlace(keyword) {
    if (keyword === "") {
        return
    }
    $("#search-result").empty();
    ps.keywordSearch(keyword, function (data, status, pagination) {
        //console.log(data);
        searchResultBox.results = [];
        data.forEach(item => {
            searchResultBox.results.push(item);
            console.log(item);
        });
        $("#search-result").empty();
        searchResultBox.update();
    });
    //return places
}

function markVehicles(location) {
    getKickGoing(location);
    getXingxing(location);
    getGogossing(location);

}

function saveUserConfig(name, str) { //cookieName=string;
    document.cookie = name+ "=" + str + "; expires=Thu, 18 Dec 2025 12:00:00 UTC";
}
function readUserConfig(name) {
    name += "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return false;
}
var encryptedConfig = {
    read: function (name, password) {
        var cookie = readUserConfig(name+"_enc");
        if (cookie == false) {
            return false; //Assume cookie corrupted.
        }
        // DECRYPT
    },
    add: function (name, str, password) {
        var cookieContent = this.read(name, password);
    },
    remove: function (name, str) {
        
    }
}

var myLocations = {
    list: function () {
        $("#search-result").show();
    },
    add: function () {
        $("#search-result").hide();
    },
    update: function () {
        //풀네임, 주소, category_group_name 출력
        $("#search-result").empty();
        if (this.results.length > 6) {
            $("#search-result").css('height', 240);
            $("#search-result").css('top', 250);
        } else {
            $("#search-result").css('height', this.results.length * 38);
            $("#search-result").css('top', this.results.length * 40 + 20);
        }
        this.results.slice(0,6).forEach(result => {
            $("#search-result").append("<p class='result-item' onclick='makeMarker(new kakao.maps.LatLng(result.x, result.y), result.place_name)'>" + result.place_name + "<span>" + result.address_name + "</span></p>");
        });
    },
    results: []
}