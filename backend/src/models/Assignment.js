const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema(
    {
        name: { type: String },
        dataType: { type: String }, 
    },
    { _id: false }
);

const schemaInfoSchema = new mongoose.Schema(
    {
        tableName: { type: String },
        columns: [columnSchema],
    },
    { _id: false }
);

const assignmentSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
        tables: [{ type: String }],
        expectedConcepts: [{ type: String }],
        schemaInfo: [schemaInfoSchema],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Assignment', assignmentSchema);
