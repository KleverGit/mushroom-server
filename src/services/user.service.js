const CONSTANTS = require('../../config/constants/constants');

let singleton = Symbol();
let singletonEnforce = Symbol();

/**
 * Represents "Singleton" service CarPrediction 
 * Gets only one instance of UserService by getInstance
 */
class UserService {

    constructor(enforce) {
        if (enforce != singletonEnforce) {
            throw new Error('Cannot construct UserService singleton');
        }
    }

    /**
     * Gets singleton UserService
     */
    static getInstance() {
        if (!this[singleton]) {
            this[singleton] = new UserService(singletonEnforce);
        }
        return this[singleton];
    }

    getAllUsers () {
        
    }
}

module.exports = UserService;