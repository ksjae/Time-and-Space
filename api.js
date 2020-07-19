const vehicleMarkerArea = 0.01;
var dbg = "";
class Kickboard {
    kickgoing(location) {
        //ID 1
        const url = 'https://api.kickgoing.io/v2/kickscooters/ready/list?lat=' + location.lat + '&lng=' + location.long;
        console.log(url);
        fetch("https://tagopa.ksjit.com/s/", {
            redirect: 'follow', // manual, *follow, error
            headers: new Headers({
                'request-url' : url
            })
        }).then((response) => {
            if (!response.ok) {
                console.log("Failed to get kickgoing data :(");
            }
            return response.json()
        }).then((json) => {
            json.kickscooters.forEach(scooter => {
                //console.log(scooter.deviceStatus.location.coordinates);
                if (Math.abs(scooter.lng - location.long) < vehicleMarkerArea && Math.abs(scooter.lat - location.lat) < vehicleMarkerArea) {
                    updateMarker(new Vehicle(scooter.lat, scooter.lng, scooter.battery_rate, 1))
                }
            });
        }).catch((err) => {
            console.log('Error: ${err}');
        });
    }
    xingxing(location) {
        //ID 2
        const url = 'https://api.xingxingmobility.com/api-xingxing/v1/scootersforapp?latitude=' + location.lat + '&longitude=' + location.long + '&zoom=15';
        //const url = 'https://localhost/xing.txt' //fetch에서 Authorization header가 잘 안됨.
        const bearer = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImF1dGhJZCI6ImhvbmV5YmVlcyIsInVzZXJJZCI6ImhvbmV5YmVlcyIsInJvbGVzIjpbImFwcHhpbmd4aW5nIl19LCJpYXQiOjE1NTUzMzQ3MjMsImV4cCI6ODY1NTU1MzM0NzIzfQ.br5PT0s_vkFFs24Dxv0acPeQizg_TpXtkdEaWRgkSMw"
        var myHeaders = new Headers();
        myHeaders.append('Authorization', bearer);
        fetch("https://tagopa.ksjit.com/s/", {
            //mode: 'no-cors', // no-cors, *cors, same-origin
            credentials: 'include',
            headers: new Headers({
                'Authorization': bearer,
                'Content-Type': 'application/x-www-form-urlencoded',
                'request-url' : url
            })
        }).then((response) => {
            if (!response.ok) {
                console.log("Failed to get xingxing data :(");
            }
            return response.json()
        }).then((json) => {
            console.log(json.scooters);
            json.scooters.forEach(scooter => {
                //console.log(scooter.deviceStatus.location.coordinates);
                if (Math.abs(scooter.deviceStatus.location.coordinates[0] - location.long) < vehicleMarkerArea && Math.abs(scooter.deviceStatus.location.coordinates[1] - location.lat) < vehicleMarkerArea && scooter.nickname === "") {
                    //console.log(scooter);
                    updateMarker(new Vehicle(scooter.deviceStatus.location.coordinates[1], scooter.deviceStatus.location.coordinates[0], scooter.deviceStatus.battery, 2))
                }
            });
        })
        //.catch((err) => {
        //    console.log('Error: '+err);
        //});
    }
    gogossing(location) {
        //ID 3
        const url = "https://api.gogo-ssing.com/ss/api/mob/search.do?latSW=" + (location.lat-vehicleMarkerArea) + "&lngSW=" + (location.long-vehicleMarkerArea) + "&latNE=" + (location.lat+vehicleMarkerArea) + "&lngNE=" + (location.long+vehicleMarkerArea) + "&type=SCOOTER";
        fetch("https://tagopa.ksjit.com/s/", {
            redirect: 'follow', // manual, *follow, error
            headers: new Headers({
                'request-url' : url
            })
        }).then((response) => {
            if (!response.ok) {
                console.log("Failed to get gogossing data :(");
            }
            //response.json(); 두번 쓰면 혼난다
            return response.json()
        }).then((json) => {
            //console.log(json);
            json.payload.mobList.forEach(scooter => {
                if (Math.abs(scooter.LON - location.long) < vehicleMarkerArea && Math.abs(scooter.LAT - location.lat) < vehicleMarkerArea && scooter.CHECK_REASON === "") {
                    //console.log(scooter);
                    updateMarker(new Vehicle(scooter.LAT, scooter.LON, scooter.BATTERY_PER, 3));
                }
            })
        });
    }
    beam(location) { //경로에러 자주 뜸
        //ID 4
        const url = 'https://gateway.ridebeam.com/api/vehicles/scooter/latlong?latitude=' + location.lat + '&longitude=' + location.long + '&version=1.2.2';
        fetch("https://tagopa.ksjit.com/s/", {
            redirect: 'follow', // manual, *follow, error
            headers: new Headers({
                'request-url' : url
            })
        }).then((response) => {
            if (!response.ok) {
                console.log("Failed to get beam data :(");
            }
            //response.json(); // parses JSON response into native JavaScript objects
            return response.json()
        }).then((json) => {
            for (var scooter in json.scooter) {
                if (Math.abs(scooter.deviceStatus.location.coordinates[0] - location.long) < vehicleMarkerArea && Math.abs(scooter.deviceStatus.location.coordinates[1] - location.lat) < vehicleMarkerArea && scooter.deviceStatus.enable) {
                    console.log(scooter)
                    updateMarker(new Vehicle(scooter.deviceStatus.location.coordinates[1], scooter.deviceStatus.location.coordinates[0], scooter.deviceStatus.battery, 4))
                }
            }
        })
    }
    flowerroad(location) { //NEEDS TO FETCH AUTH
        //ID 5
        const url = 'https://api.flowerroad.ai/scooter/info/user/lock?lat=' + location.lat + '&lon=' + location.long + '&distance=1';
        fetch("https://tagopa.ksjit.com/s/", {
            credentials: 'include',
            headers: new Headers({
                'x-api-key' : 'hFT9RfoQHe1SyTG2siwRmaIpXWhWNH6v9R86yonP',
                'request-url' : url
            })
        }).then((response) => {
            if (!response.ok) {
                console.log("Failed to get flowerroad data :(");
            }
            return response.json()
        }).then((json) => {
            json.data.forEach(scooter => {
                if (Math.abs(scooter.lon - location.long) < vehicleMarkerArea && Math.abs(scooter.lat - location.lat) < vehicleMarkerArea && scooter.state === "available") {
                    //console.log(scooter);
                    updateMarker(new Vehicle(scooter.lat, scooter.lon, scooter.battery, 5));
                }
            });
        })
    }
    mate(location) { 
        //ID 7
        const url = 'https://api.matemobility.com/api/search/vehicle/geonear?center=' + location.lat + ',' + location.long + '&end=' +(location.lat-vehicleMarkerArea) + ',' + (location.long-vehicleMarkerArea);
        fetch("https://tagopa.ksjit.com/s/", {
            credentials: 'include',
            headers: new Headers({
                'request-url' : url
            })
        }).then((response) => {
            if (!response.ok) {
                console.log("Failed to get mate-marcane data :(");
            }
            return response.json()
        }).then((json) => {
            console.log(json);
            json.forEach(scooter => {
                if (Math.abs(scooter.coordinates.lon - location.long) < vehicleMarkerArea && Math.abs(scooter.coordinates.lat - location.lat) < vehicleMarkerArea) {
                    updateMarker(new Vehicle(scooter.coordinates.lat, scooter.coordinates.lon, scooter.battery, 7));
                }
            });
        })
    }
}

class Bike {
    elecle (location) { //ID 6
        const url = 'https://api.elecle.bike/v1/bike?position=' + location.long + ',' + location.lat + '&radius=50&bike_type=UNIVERSE';
        const bearer = 'bearer RgVZfFQKm6R60lIjH9KFL4N3jSmdQF';
        fetch("https://tagopa.ksjit.com/s/", {
            headers: {
                'Authorization': bearer,
                'request-url' : url
            },
            redirect: 'follow', // manual, *follow, error
        }).then((response) => {
            if (!response.ok) {
                console.log("Failed to get elecle data :(");
            }
            //console.log(response.text());
            return response.json();
        }).then((json) => {
            console.log(json);
            json.forEach(bike => {
                //console.log(bike);
                if (Math.abs(bike.location[0] - location.long) < vehicleMarkerArea && Math.abs(bike.location[1] - location.lat) < vehicleMarkerArea) {
                    console.log(bike);
                    updateMarker(new Vehicle(bike.location[1], bike.location[0], bike.leftover, 6))
                }
            });
        });
    }
    cookie (location) { //발암 500KB/request
        const url = 'https://api.cookiebike.co.kr/app/service/bikes/kml?lang=ko&lat=' + location.lat + '&lon=' + location.long + '&filter=%5B%5D&minLon=0&minLat=0&maxLon=99999999&maxLat=9999999&bbox=00000000,0000000,99999999,9999999';
        console.log(url);
        fetch("https://tagopa.ksjit.com/s/", {
            redirect: 'follow', // manual, *follow, error
        }).then((response) => {
            if (!response.ok) {
                console.log("Failed to get cookie path :(");
            }
            return response.text();
        }).then((responseText) => {
            var parser = new DOMParser();
            var xmlDoc = null;
            try { xmlDoc = parser.parseFromString(responseText, "application/xml"); } catch {
                console.log(responseText);
            }
            //console.log(responseText);
            dbg = xmlDoc;
            return xmlDoc;
        }).then((parsed) => {
            var vehicleJsonArray = new Array();
            var items = parsed.getElementsByTagName("Placemark");
            //console.log(parsed);
            for (var i=0;i<items.length;i++) {
                vehicleJsonArray.push([JSON.parse(items[i].childNodes[1].textContent), items[i].childNodes[3].textContent.split(',')]);
            }
            return vehicleJsonArray;
        }).then((jsonArray) => {
            jsonArray.forEach(bike => {
                var bikeLocation = bike[1].map(Number);
                location.long -= 126;
                location.lat -= 37;
                if (bike[0].distance < vehicleMarkerArea*250000) {
                    console.log(bike);
                    updateMarker(new Vehicle(bikeLocation[1], bikeLocation[0], "(무동력)", 7))
                }
            })
        }).catch((e) => console.log(e));
    }
}

const apiKey = "XqOr1kp1Xt4UsZla7i7qPghmncHHLVtYwUlDdKPYmrxKVi1%2Fg9HUgGNMZuGzB3Opx0YGj1TEphvsV06Pqob13A%3D%3D";
class Transit {
    subwayPath(start, end) {
        const url = "http://ws.bus.go.kr/api/rest/pathinfo/getPathInfoBySubway?ServiceKey=" + apiKey + "&startX=" + start.long + "&startY=" + start.lat + "&endX=" + end.long + "&endY=" + end.lat;
        console.log(url);
        fetch("https://tagopa.ksjit.com/s/", {
            mode: 'no-cors', // no-cors, *cors, same-origin
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            headers: new Headers({
                'request-url' : url
            })
        }).then((response) => {
            if (!response.ok) {
                console.log("Failed to get subway path :(");
            }
            return response.text();
        }).then((responseText) => {
            var parser = new DOMParser();
            var xmlDoc = null;
            try { xmlDoc = parser.parseFromString(responseText, "application/xml"); } catch {
                console.log(responseText);
            }
            return xmlDoc;
        }).then((parsed) => {
            var path = new Array();
            parsed.getElementsByTagName("itemList").forEach((item) => {
                item.getElementsByTagName("pathlist").forEach((pathitem) => {
                    path.push(pathitem);
                })
            });
            return path;
        })
    }
    busStop(location_name) {
        const url = "http://ws.bus.go.kr/api/rest/pathinfo/getLocationInfo?ServiceKey=" + apiKey + "?stSrch=" + location_name;
        fetch("https://tagopa.ksjit.com/s/", {
            mode: 'no-cors', // no-cors, *cors, same-origin
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            headers: new Headers({
                'request-url' : url
            })
        }).then((response) => {
            if (!response.ok) {
                console.log("Failed to get subway path :(");
            }
            try { json = response.json(); } catch {
                console.log(response.responseText)
            }
            return json
        })
    }
    path(start, end) {
        const url = "http://ws.bus.go.kr/api/rest/pathinfo/getPathInfoByBusNSub?ServiceKey=" + apiKey + "&startX=" + start.long + "&startY=" + start.lat + "&endX=" + end.long + "&endY=" + end.lat;
        //console.log(url);
        fetch("https://tagopa.ksjit.com/s/", {
            mode: 'no-cors', // no-cors, *cors, same-origin
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            headers: {
                'request-url': url
            },
        }).then((response) => {
            if (!response.ok) {
                console.log("Failed to get subway path :(");
            }
            console.log(response.text());
            var parser = new DOMParser();
            var xmlDoc = null;
            try { xmlDoc = parser.parseFromString(response.responseText, "application/xml"); } catch {
                console.log(response.responseText)
            }
            return xmlDoc;
        }).then((parsed) => {
            var path = new Array();
            parsed.getElementsByTagName("itemList").forEach((item) => {
                item.getElementsByTagName("pathlist").forEach((pathitem) => {
                    path.push(pathitem);
                })
            });
            return path;
        })
    }

}