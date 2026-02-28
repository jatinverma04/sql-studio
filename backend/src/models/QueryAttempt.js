const mongoose = require('mongoose');

const queryAttemptSchema = new mongoose.Schema({
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    sessionId: { type: String }, 
    query: { type: String, required: true },
    success: { type: Boolean, default: false },
    rowCount: { type: Number, default: 0 },
    errorMessage: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('QueryAttempt', queryAttemptSchema);
