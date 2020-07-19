function Vehicle (lat, long, battery, serviceType) {
    var thing = {
        batt: battery,
        lat: lat,
        long: long,
        serviceType: serviceType
    };
    return thing;
}
function Location (lat, long) {
    var loc = {
        lat: lat,
        long: long
    };
    return loc;
}
function PathVector (from, to, method, eta) {
    var v = {
        from: from,
        to: to,
        method: method,
        eta: eta
    };
    return v;
}



var ps = null;
var linePath = null;
var markers = Array();
function makeMarker(position, title, id, imageSize) {
    if (imageSize === undefined) {
        imageSize = new kakao.maps.Size(32, 32);
    }
    if (id === 0 || id > 10 || id === 6) imageSize = new kakao.maps.Size(23, 35);

    let imageSrc = 
    [   "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
        "https://tagopa.ksjit.com/tagopa/img/1.png",
        "https://tagopa.ksjit.com/tagopa/img/2.png",
        "https://tagopa.ksjit.com/tagopa/img/3.png",
        "https://tagopa.ksjit.com/tagopa/img/4.png",
        "https://tagopa.ksjit.com/tagopa/img/5.png",
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
        "https://tagopa.ksjit.com/tagopa/img/7.png",
        "https://tagopa.ksjit.com/tagopa/img/pin.png",
        "https://tagopa.ksjit.com/tagopa/img/takeoff.png",
        "https://tagopa.ksjit.com/tagopa/img/destination.png",
    ];

    // 마커 이미지를 생성합니다 
    if (id > 10) id=0;
    var markerImage = new kakao.maps.MarkerImage(imageSrc[id], imageSize);

    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        position: position, // 마커를 표시할 위치
        title: title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        image: markerImage, // 마커 이미지 
        clickable: true //마커가 대싴 클릭되게.
    });

    // 인포윈도우를 생성합니다
    var infowindow = new kakao.maps.InfoWindow({
        content : '<button onclick="addMyPath({lat:' + position.getLat() + ',long:' + position.getLng() + '});refreshMyPath();">경유</button><button onclick="startMyPath({lat:' + position.getLat() + ',long:' + position.getLng() + '});refreshMyPath();">출발지 설정</button><button onclick="endMyPath({lat:' + position.getLat() + ',long:' + position.getLng() + '});refreshMyPath();">목적지 설정</button><button onclick="mypath = Array();destination = null;refreshMyPath();">초기화</button>',
        removable : true
    });

    // 마커에 클릭이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'click', function() {
    // 마커 위에 인포윈도우를 표시합니다
        infowindow.open(map, marker);  
    });
    markers.push([marker, id]);
    return id;
}
function updateMarker(vehicle) {
    //DELETE MARKER
    //ADD ACCORDING TO LOCATION
    //console.log(vehicle);
    makeMarker(new kakao.maps.LatLng(vehicle.lat, vehicle.long), "배터리 : " + vehicle.battery + "%", vehicle.serviceType);
}
function findMarker(id){
    return markers.find(element => element[1] === id)[0];
}

function drawLine(linePath, color){
    if (color === undefined) {
        color = '#FFAE00';
    }
    // 지도에 표시할 선을 생성합니다
    var polyline = new kakao.maps.Polyline({
        path: linePath, // 선을 구성하는 좌표배열 입니다
        strokeWeight: 5, // 선의 두께 입니다
        strokeColor: color, // 선의 색깔입니다
        strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle: 'solid' // 선의 스타일입니다
    });

    // 지도에 선을 표시합니다 
    polyline.setMap(map); 
    return polyline
}
function lineTest(){
    var linePath = [
        new kakao.maps.LatLng(37.3817767,126.6304981),
        new kakao.maps.LatLng(37.384066, 126.626311)
    ];
    drawLine(linePath);
}

function openInNaverMaps(kakaoLatLngList){
    var querystr = "nmap://route/public?slat="+kakaoLatLngList[0].getLat()+"&slng="+kakaoLatLngList[0].getLng()+"&dlat="+kakaoLatLngList.slice(-1)[0].getLat()+"&dlng="+kakaoLatLngList.slice(-1)[0].getLng()+"&appname=com.ksjit.tagopa"
    var win = window.open(querystr, '_blank');
    win.focus();
}


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(registerPosition);
    } else {
        alert("위치 서비스를 이용할 수 없습니다. 정상적인 이용이 불가능할 것입니다.");
        return new kakao.maps.LatLng(37.384066, 126.626311);
    }
    return new kakao.maps.LatLng(userLatitude, userLongitude);
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
        zoom: 17
    });
    makeMarker(new kakao.maps.LatLng(userLatitude, userLongitude), 0, 0);
    ps = new kakao.maps.services.Places();
    kickboard = new Kickboard();
    bike = new Bike();
    mylocation = {lat: userLatitude, long: userLongitude};
    mypath.push(new kakao.maps.LatLng(userLatitude, userLongitude));

    if (!window.DOMParser) alert("경고 : 옛날 브라우저(IE)에서는 대중교통 경로검색이 불가능합니다");
    transit = new Transit();
    //mylocation = {lat: 37.49753128060163, long:127.02815273412143};
    //console.log(mylocation);
}

var searchResultBox = {
    show: function () {
        $("#search-result").show();
    },
    hide: function () {
            $('#search-result').hide();
    },
    update: function () {
        //풀네임, 주소, category_group_name 출력
        $("#search-result").empty();
        if (this.results.length > 6) {
            $("#search-result").css('height', 320);
            $("#search-result").css('top', 320);
        } else {
            $("#search-result").css('height', this.results.length * 55);
            $("#search-result").css('top', this.results.length * 55);
        }
        this.results.slice(0,6).forEach(result => {
            //$("#search-result").append("<p class='result-item' onclick=\"makeMarker(new kakao.maps.LatLng("+result.x+", "+result.y+"), " + result.place_name + ")>" + result.place_name + "<span>" + result.address_name + "</span></p>");
            $("#search-result").append("<a class='result-item' onclick=\"makeMarker(new kakao.maps.LatLng("+result.y+", "+result.x+"),0, 0);searchResultBox.hide();map.panTo(new kakao.maps.LatLng("+result.y+", "+result.x+"));\"><p class='result-item'>" + result.place_name + "</p><span class='result-item'>" + result.address_name + "</span></a><br />");
        });
    },
    results: []
}

function searchPlace(keyword) {
    if (keyword === "") {
        return;
    }
    $("#search-result").empty();
    ps.keywordSearch(keyword, function (data, status, pagination) {
        //console.log(data);
        searchResultBox.results = [];
        data.forEach(item => {
            searchResultBox.results.push(item);
            //console.log(item);
        });
        $("#search-result").empty();
        searchResultBox.update();
    });
    //return places
}
var mypath = Array();
var destination = null;
var mypathOnMap = drawLine([]);
function addMyPath(newlocation) {
    if (newlocation !== undefined) {
        mypath.push(new kakao.maps.LatLng(newlocation.lat, newlocation.long));
    }
}
function startMyPath(newlocation) {
    mypath.splice(0, 0, new kakao.maps.LatLng(newlocation.lat, newlocation.long));
}
function endMyPath(newlocation) {
    destination = newlocation;
}
function refreshMyPath(){
    if (mypathOnMap !== undefined) {
        mypathOnMap.setMap(null);
    }
    var drawpath = mypath;
    if (destination !== null) {
        drawpath.push(new kakao.maps.LatLng(destination.lat, destination.long));
    }
    mypathOnMap = drawLine(drawpath);
}

function refresh(location) {
    init();
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
/*
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
            $("#search-result").append("<a class='result-item' onclick=\"makeMarker(new kakao.maps.LatLng("+result.x+", "+result.y+"), " + result.place_name + ")>" + result.place_name + "<span>" + result.address_name + "</span></a>");
        });
    },
    results: []
}
*/