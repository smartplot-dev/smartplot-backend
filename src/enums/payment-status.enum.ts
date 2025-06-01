export enum PaymentStatus {
    Pending = 'pending', // Payment is pending
    Completed = 'completed', // Payment has been completed successfully
    Failed = 'failed', // Payment has failed
    Refunded = 'refunded', // Payment has been refunded
    Cancelled = 'cancelled', // Payment has been cancelled
}