const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    /*id: {
        type: String,
        unique: true,
        required: true,
        default: () => new mongoose.Types.ObjectId().toString()
    },*/
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationTokenExpires: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    googleId:String,
    secret:String
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;


