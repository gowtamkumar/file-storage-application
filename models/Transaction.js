import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    planId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        default: 'unknown',
    },
    transactionId: {
        type: String,
        required: true,
        unique: true,
    },
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed', 'cancelled'],
        default: 'pending',
    },
    metadata: {
        type: Object,
        default: {},
    },
}, { timestamps: true });

// Force recompilation of model in dev mode to ensure schema changes are picked up
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.Transaction;
}

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
