const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, default: '' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lastEditedBy: { type: String },  // Track the username of the last editor
    lastEditedAt: { type: Date },    // Track the timestamp of the last edit
}, { timestamps: true });

documentSchema.pre('save', function(next) {
    if (this.isModified('content')) {
        this.lastEditedAt = new Date();
        // This should be updated with the actual user data (e.g., from socket connection)
        this.lastEditedBy = this.owner.username || 'Unknown'; // This should be passed by the socket as part of the update
    }
    next();
});

module.exports = mongoose.model('Document', documentSchema);
