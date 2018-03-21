'use strict';

let baseUrl = 'http://localhost:8080/conversations/';

const getMessages = (whisperIDsArray, userID, type) => {
    let customUrl = (type === "Received") ? baseUrl + "?ogSender=" + userID + "&id=" : baseUrl + "?ogReceiverer=" + userID + "&id=";
    for (let id of whisperIDsArray) {
        customUrl += id + "&id=";
    }
    
    return fetch(customUrl.slice(0,-4)).then(res => res.json())
}

module.exports = getMessages;