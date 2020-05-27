const vehicleMarkerArea = 0.04;
class Kickboard {
    kickgoing(location) {
        //ID 1
        const url = 'https://api.kickgoing.io/v2/main?latitude=' + location.lat + '&longitude=' + location.long + '&version=1.2.2';
        console.log(url);
        fetch(url, {
            mode: 'no-cors', // no-cors, *cors, same-origin
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        }).then((response) => {
            if (!response.ok) {
                console.log("Failed to get Kickgoing data :(");
            }
            try { json = response.json(); } catch {
                console.log("제이슨 페일");
                console.log(response.responseText);
            }
            for (var scooter in json.scooter) {
                if (Math.abs(scooter.deviceStatus.location.coordinates[0] - location.long) < vehicleMarkerArea && Math.abs(scooter.deviceStatus.location.coordinates[1] - location.lat) < vehicleMarkerArea && scooter.deviceStatus.enable) {
                    console.log(scooter)
                    updateMarker(new Vehicle(scooter.deviceStatus.location.coordinates[1], scooter.deviceStatus.location.coordinates[0], scooter.deviceStatus.battery, 2))
                }
            }
        })
    }
    xingxing(location) {
        //ID 2
        const url = 'https://api.xingxingmobility.com/api-xingxing/v1/scootersforapp?latitude=' + location.lat + '&longitude=' + location.long + '&zoom=15';
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
            try { json = response.json(); } catch {
                console.log(response.responseText)
            }
            for (var scooter in json.scooter) {
                if (Math.abs(scooter.deviceStatus.location.coordinates[0] - long) < vehicleMarkerArea && Math.abs(scooter.deviceStatus.location.coordinates[1] - lat) < vehicleMarkerArea && scooter.deviceStatus.enable) {
                    console.log(scooter)
                    updateMarker(new Vehicle(scooter.deviceStatus.location.coordinates[1], scooter.deviceStatus.location.coordinates[0], scooter.deviceStatus.battery, 2))
                }
            }
        })
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
    beam(location) { //NEEDS TO FETCH AUTH
        //ID 4
        const url = 'https://gateway.ridebeam.com/api/vehicles/scooter/latlong?latitude=' + location.lat + '&longitude=' + location.long + '&version=1.2.2';
        fetch(url, {
            mode: 'no-cors', // no-cors, *cors, same-origin
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
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
        }).then((response) => {
            if (!response.ok) {
                console.log("Failed to get flowerroad data :(");
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
}

class Bike {
    elecle (location) { //NEEDS TO FETCH AUTH
        const url = 'https://api.elecle.bike/v1/bike?position=' + location.lat + ',' + location.long + '&radius=50&bike_type=UNIVERSE';
        fetch(url, {
            mode: 'no-cors', // no-cors, *cors, same-origin
            headers: {
                'Authorization': bearer
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        }).then((response) => {
            if (!response.ok) {
                console.log("Failed to get eleccle data :(");
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
    cookie (location) { //NEEDS TO FETCH URL
        const url = 'TBA';
        fetch(url, {
            mode: 'no-cors', // no-cors, *cors, same-origin
            headers: {
                'Authorization': bearer
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        }).then((response) => {
            if (!response.ok) {
                console.log("Failed to get cookie-bike data :(");
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
}

const apiKey = "XqOr1kp1Xt4UsZla7i7qPghmncHHLVtYwUlDdKPYmrxKVi1%2Fg9HUgGNMZuGzB3Opx0YGj1TEphvsV06Pqob13A%3D%3D";
class Transit {
    subwayPath(start, end) {
        const url = "http://ws.bus.go.kr/api/rest/pathinfo/getPathInfoBySubway?ServiceKey=" + apiKey + "&startX=" + start.lat + "&startY=" + start.long + "&endX=" + end.lat + "&endY=" + end.long;
        fetch(url + queryParams, {
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

    }

}