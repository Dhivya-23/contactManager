const mongoose = require('mongoose')

const ContactManagerSchema = new mongoose.Schema({
    name : {
        type : String
    },
    email : {
        type : String
    },
    phone : {
        type : Number
    }
})

const Contact = mongoose.model('contactdetails', ContactManagerSchema)

module.exports = { Contact }