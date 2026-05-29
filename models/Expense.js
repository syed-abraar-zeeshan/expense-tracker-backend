const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    amount : {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount cannot be negative']
    },
    category : {
        type: String,
        required: [true, 'Category is required'],
        trim: true
     },
     date : {
        type: Date,
        required: [true, 'Date is required'],
        default: Date.now
     },
     note : {
        type: String,
        trim: true,
        default: ''
    },
    type: {
        type: String,
        enum: ['expense', 'income'],
        default: 'expense'
    }
}, {
    timestamps: true
});

const expense = mongoose.model('Expense', expenseSchema);

module.exports = expense;