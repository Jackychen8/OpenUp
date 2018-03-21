'use strict';

let baseUrl = 'http://localhost:8080/conversations/';

const postMessage = (convoDetails, ) => {
    
    return fetch(baseUrl + convoDetails.id, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(convoDetails)
    }).then(res => console.log('response: ' + res.json()))
    .catch(err=> console.log(err))
}

module.exports = postMessage;