const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    user_id: String,
    oauth_sub: String,
    name: String,
    email: String,
    onboarded : Boolean,
}, { collection: "User" });

module.exports = mongoose.model('User', UserSchema);