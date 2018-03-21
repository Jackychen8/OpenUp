'use strict';

let baseUrl = 'http://localhost:8080/people/';

const loadPeople = () => {
    return fetch(baseUrl).then(res => res.json())
}

module.exports = loadPeople;