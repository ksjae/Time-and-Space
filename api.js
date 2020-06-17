const vehicleMarkerArea = 0.004;
class Kickboard {
    kickgoing(location) {
        //ID 1
        const url = 'https://api.kickgoing.io/v2/kickscooters/ready/list?lat=' + location.lat + '&lng=' + location.long;
        console.log(url);
        fetch(url, {
            mode: 'no-cors', // no-cors, *cors, same-origin
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
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
        //const url = 'https://api.xingxingmobility.com/api-xingxing/v1/scootersforapp?latitude=' + location.lat + '&longitude=' + location.long + '&zoom=15';
        const url = 'https://localhost/xing.txt' //fetch에서 Authorization header가 잘 안됨.
        const bearer = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImF1dGhJZCI6ImhvbmV5YmVlcyIsInVzZXJJZCI6ImhvbmV5YmVlcyIsInJvbGVzIjpbImFwcHhpbmd4aW5nIl19LCJpYXQiOjE1NTUzMzQ3MjMsImV4cCI6ODY1NTU1MzM0NzIzfQ.br5PT0s_vkFFs24Dxv0acPeQizg_TpXtkdEaWRgkSMw"
        var myHeaders = new Headers();
        myHeaders.append('Authorization', bearer);
        fetch(url, {
            //mode: 'no-cors', // no-cors, *cors, same-origin
            headers: new Headers({
                'Authorization': bearer,
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
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
        const url = "https://api.gogo-ssing.com/ss/api/mob/search.do?latSW=" + (location.lat-this.vehicleMarkerArea) + "&lngSW=" + (location.long-this.vehicleMarkerArea) + "&latNE=" + (location.lat+this.vehicleMarkerArea) + "&lngNE=" + (location.long+this.vehicleMarkerArea) + "&type=SCOOTER";
        fetch(url, {
            mode: 'no-cors', // no-cors, *cors, same-origin
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        }).then((response) => {
            if (!response.ok) {
                console.log("Failed to get gogossing data :(");
            }
            response.json(); // parses JSON response into native JavaScript objects
            try { json = response.json(); } catch {
                console.log(response.responseText)
            }
            for (var scooter in json.payload.moblist) {
                if (Math.abs(scooter.LON - long) < vehicleMarkerArea && Math.abs(scooter.LAT - location.lat) < vehicleMarkerArea && scooter.CHECK_REASON === "") {
                    console.log(scooter)
                    updateMarker(new Vehicle(scooter.LAT, scooter.LON, scooter.BATTERY_PER, 2))
                }
            }
        })
    }
    beam(location) { //경로에러 자주 뜸
        //ID 4
        const url = 'https://gateway.ridebeam.com/api/vehicles/scooter/latlong?latitude=' + location.lat + '&longitude=' + location.long + '&version=1.2.2';
        fetch(url, {
            redirect: 'follow', // manual, *follow, error
        }).then((response) => {
            if (!response.ok) {
                console.log("Failed to get beam data :(");
            }
            response.json(); // parses JSON response into native JavaScript objects
            try { json = response.json(); } catch {
                console.log(response.responseText)
            }
            for (var scooter in json.scooter) {
                if (Math.abs(scooter.deviceStatus.location.coordinates[0] - location.long) < vehicleMarkerArea && Math.abs(scooter.deviceStatus.location.coordinates[1] - location.lat) < vehicleMarkerArea && scooter.deviceStatus.enable) {
                    console.log(scooter)
                    updateMarker(new Vehicle(scooter.deviceStatus.location.coordinates[1], scooter.deviceStatus.location.coordinates[0], scooter.deviceStatus.battery, 2))
                }
            }
        })
    }
    flowerroad(location) { //NEEDS TO FETCH AUTH
        //ID 5
        const url = 'https://api.flowerroad.ai/scooter/info/user/lock?lat=' + location.lat + '&lon=' + location.long + '&distance=1';
        fetch(url, {
            mode: 'no-cors', // no-cors, *cors, same-origin
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            headers: new Headers({
                'x-api-key' : 'hFT9RfoQHe1SyTG2siwRmaIpXWhWNH6v9R86yonP'
            })
        }).then((response) => {
            if (!response.ok) {
                console.log("Failed to get flowerroad data :(");
            }
            return response.json()
        }).then((json) => {
            json.data.forEach(scooter => {
                //console.log(scooter.deviceStatus.location.coordinates);
                if (Math.abs(scooter.lon - location.long) < vehicleMarkerArea && Math.abs(scooter.lat - location.lat) < vehicleMarkerArea && scooter.state === "available") {
                    //console.log(scooter);
                    updateMarker(new Vehicle(scooter.lon, scooter.lat, scooter.battery, 5))
                }
            });
        })
    }
}

class Bike {
    elecle (location) { //ID 6
        const url = 'https://api.elecle.bike/v1/bike?position=' + location.lat + ',' + location.long + '&radius=50&bike_type=UNIVERSE';
        const bearer = 'bearer RgVZfFQKm6R60lIjH9KFL4N3jSmdQF';
        fetch(url, {
            headers: {
                'Authorization': bearer
            },
            redirect: 'follow', // manual, *follow, error
        }).then((response) => {
            if (!response.ok) {
                console.log("Failed to get elecle data :(");
            }
            response.json(); // parses JSON response into native JavaScript objects
            try { json = response.json(); } catch {
                console.log(response.responseText)
            }
            for (var bike in json) {
                if (Math.abs(bike.location[0] - long) < vehicleMarkerArea && Math.abs(bike.location[1] - location.lat) < vehicleMarkerArea) {
                    console.log(scooter)
                    updateMarker(new Vehicle(bike.location[0], bike.location[1], bike.leftover, 6))
                }
            }
        })
    }
    cookie (location) { //발암 500KB/request
        const url = 'https://api.cookiebike.co.kr/app/service/bikes/kml?lang=ko&lat=' + location.lat + '&lon=' + location.long + '&filter=%5B%5D&minLon=0&minLat=0&maxLon=99999999&maxLat=9999999&bbox=14073744.877308,4428101.0898232,14145404.591318,4551737.9830572';
        fetch(url, {
            headers: {
                'Authorization': bearer
            },
            redirect: 'follow', // manual, *follow, error
        }).then((response) => {
            if (!response.ok) {
                console.log("Failed to get cookie path :(");
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
            parsed.getElementsByTagName("Placemark").forEach((item) => {
                    item.getElementsByTagName("description").json();
            })
            return path;
        })
    }
}

const apiKey = "XqOr1kp1Xt4UsZla7i7qPghmncHHLVtYwUlDdKPYmrxKVi1%2Fg9HUgGNMZuGzB3Opx0YGj1TEphvsV06Pqob13A%3D%3D";
class Transit {
    subwayPath(start, end) {
        const url = "http://ws.bus.go.kr/api/rest/pathinfo/getPathInfoBySubway?ServiceKey=" + apiKey + "&startX=" + start.long + "&startY=" + start.lat + "&endX=" + end.long + "&endY=" + end.lat;
        console.log(url);
        fetch(url, {
            mode: 'no-cors', // no-cors, *cors, same-origin
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        }).then((response) => {
            if (!response.ok) {
                console.log("Failed to get subway path :(");
            }
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
    busStop(location_name) {
        const url = "http://ws.bus.go.kr/api/rest/pathinfo/getLocationInfo?ServiceKey=" + apiKey + "?stSrch=" + location_name;
        fetch(url, {
            mode: 'no-cors', // no-cors, *cors, same-origin
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
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
        fetch("service.ksjit.com", {
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