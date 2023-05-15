const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '../../.env' });
const axios = require('axios');
const { genSalt } = require('bcrypt');

const data = {
    aud: 'doordash',
    iss: process.env.DEVELOPER_ID,
    kid: process.env.KEY_ID,
    exp: Math.floor(Date.now() / 1000 + 60),
    iat: Math.floor(Date.now() / 1000),
}

const headers = { algorithm: 'HS256', header: { 'dd-ver': 'DD-JWT-V1' } }

class DoorDash {

    genToken() {
        let token = jwt.sign(
            data,
            Buffer.from(process.env.SIGNING_SECRET, 'base64'),
            headers,
        )
        return token
    }

    get getToken() {
        return this.genToken
    }

}

DoorDash.prototype.generateDelivery = function (data) {
    let body = JSON.stringify(data)
    axios
        .post('https://openapi.doordash.com/drive/v2/deliveries', body, {
            headers: {
                Authorization: 'Bearer ' + this.getToken(),
                'Content-Type': 'application/json',
            },
        })
        .then(function (response) {
            console.log(response.data)
        })
        .catch(function (error) {
            console.log(error)
        })
}


module.exports = DoorDash;

// var order = {
//     external_delivery_id: 'D-12348',
//     pickup_address: '901 Market Street 6th Floor San Francisco, CA 94103',
//     pickup_business_name: 'Wells Fargo SF Downtown',
//     pickup_phone_number: '+16505555555',
//     pickup_instructions: 'Enter gate code 1234 on the callbox.',
//     dropoff_address: '901 Market Street 6th Floor San Francisco, CA 94103',
//     dropoff_business_name: 'Wells Fargo SF Downtown',
//     dropoff_phone_number: '+16505555555',
//     dropoff_instructions: 'Enter gate code 1234 on the callbox.',
//     order_value: 1999,
// }

// let testOrder = new DoorDash()

// testOrder.generateDelivery(order)