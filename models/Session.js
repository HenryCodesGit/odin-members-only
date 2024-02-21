// TODO: Implement session storage in database instead of in-memory for user

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionLimit = 1000 * 60 * 60 * 24; // One day, in milliseconds.

const SessionSchema = new Schema({
    id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    maxAge: { type: Number, required: true, default: sessionLimit},
});

module.exports = mongoose.model('Message', MessageSchema);