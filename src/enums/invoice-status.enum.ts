export enum InvoiceStatus {
    Pending = 'pending', // Invoice is pending payment
    Paid = 'paid', // Invoice has been paid
    Overdue = 'overdue', // Invoice is overdue
    Cancelled = 'cancelled', // Invoice has been cancelled
    Refunded = 'refunded', // Invoice has been refunded
}