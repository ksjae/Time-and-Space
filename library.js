var secretmessage = "";
var password = "";
var key_object = null;
var promise_key = null;
var encrypted_data = null;
var encrypt_promise = null;
var vector = window.crypto.getRandomValues(new Uint8Array(16));
var decrypt_promise = null;
var decrypted_data = null;

function encrypt_data(password, content) {
    key_object = deriveAKey(password);
    encrypt_promise = window.crypto.subtle.encrypt({
        name: "AES-GCM", 
        iv: vector
        }, 
        key_object, 
        convertStringToArrayBuffer(content)
    ).then(
        function(result) {
            encrypted_data = new Uint8Array(result);
            return encrypted_data;
        },
        function(e) {
            alert("암호화에 실패하였습니다: " + e.message);
        }
    );
}

function decrypt_data(password, encrypted_data) {
    key_object = deriveAKey(password);
    decrypt_promise = window.crypto.subtle.decrypt({
        name: "AES-GCM", 
        iv: vector
        }, 
        key_object, 
        encrypted_data
    ).then(
        function(result){
            decrypted_data = new Uint8Array(result);
            return convertArrayBuffertoString(decrypted_data);
        },
        function(e) {
            alert("복호화에 실패하였습니다: " + e.message);
        }
    );
}

function deriveAKey(password) {
    var salt = "최용운쌤 제발 A+ 주세요 헤헷";
    var iterations = 1000;

    // First, create a PBKDF2 "key" containing the password
    window.crypto.subtle.importKey(
        "raw",
        convertStringToArrayBuffer(password),
        {"name": "PBKDF2"},
        false,
        ["deriveKey"]).
    // Derive a key from the password
    then(function(baseKey){
        return window.crypto.subtle.deriveKey(
            {
                "name": "PBKDF2",
                "salt": convertStringToArrayBuffer(salt),
                "iterations": iterations,
                "hash": "SHA-384"
            },
            baseKey,
            {"name": "AES-GCM", "length": 256}, // Key we want
            true,                               // Extrable
            ["encrypt", "decrypt"]              // For new key
            );
    }).
    then(function(aesKey) {
        return window.crypto.subtle.exportKey("raw", aesKey);
    }).
    catch(function(err) {
        alert("암호화 키 생성이 안되네? " + err.message);
    });
}


function arrayBufferToHexString(arrayBuffer) {
    var byteArray = new Uint8Array(arrayBuffer);
    var hexString = "";
    var nextHexByte;

    for (var i=0; i<byteArray.byteLength; i++) {
        nextHexByte = byteArray[i].toString(16);  // Integer to base 16
        if (nextHexByte.length < 2) {
            nextHexByte = "0" + nextHexByte;     // Otherwise 10 becomes just a instead of 0a
        }
        hexString += nextHexByte;
    }
    return hexString;
}

function convertStringToArrayBuffer(str) {
    var encoder = new TextEncoder("utf-8");
    return encoder.encode(str);
}
function convertArrayBuffertoString(buffer) {
    var decoder = new TextDecoder("utf-8");
    return decoder.decode(buffer);
}