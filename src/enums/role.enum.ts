export enum Role {
    Admin = 'admin', // Administrator role with full access
    ParcelOwner = 'parcel_owner', // Role for users who own parcels
    Employee = 'employee', // Role for employees with limited access
    User = 'user', // Regular user role with basic access (should be unused, but kept for compatibility)
}