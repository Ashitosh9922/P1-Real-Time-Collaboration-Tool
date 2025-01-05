const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, default: '' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lastEditedBy: { type: String },  
    lastEditedAt: { type: Date },    
}, { timestamps: true });

documentSchema.pre('save', function(next) {
    if (this.isModified('content')) {
        this.lastEditedAt = new Date();
        
        this.lastEditedBy = this.owner.username || 'Unknown'; 
    }
    next();
});

module.exports = mongoose.model('Document', documentSchema);
