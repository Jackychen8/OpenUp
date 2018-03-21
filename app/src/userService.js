'use strict';

let baseUrl = 'http://localhost:8080/users/';

const loadUser = (id) => {
    return fetch(baseUrl+id).then(res => res.json())
}

module.exports = loadUser;