var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = mongoose.Schema({
    title: String,
    isDone: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now},
    updatedAt: Date,
    user:{type: Schema.Types.ObjectId, ref: 'User'}
});


TaskSchema.pre('update', function (next) {
    this.update({}, {$set: {updatedAt: new Date()}});
    next();
});

module.exports = mongoose.model('Task', TaskSchema);