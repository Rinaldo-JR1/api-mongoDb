const mongoose = require('mongoose')
const User = mongoose.model('User', {
    name: String,
    password: String,
    edit: Boolean,
    readOnly: Boolean,
})
module.exports = User