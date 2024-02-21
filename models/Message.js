const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    details: { type: String, required: true },
    date_posted: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Message', MessageSchema);