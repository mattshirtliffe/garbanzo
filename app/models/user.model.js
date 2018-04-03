var mongoose = require('mongoose');

var bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

var UserSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, index: { unique: true }},
    phone: String,
    password: String,
    isActive: {type: Boolean, default: false},
    isAdmin: {type: Boolean, default: false},
    hasAcceptedTerms: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now},
    updatedAt: Date
});


UserSchema.methods.isPasswordValid = function (password, cb) {

    bcrypt.compare(password, this.password, function (err, isValid) {
        if (err) return cb(err);
        cb(null, isValid);
    });

};

UserSchema.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the plain text password with the hashed one
            user.password = hash;
            next();
        });
    });
});


UserSchema.pre('update', function (next) {
    this.update({}, {$set: {updatedAt: new Date()}});
    next();
});

module.exports = mongoose.model('User', UserSchema);