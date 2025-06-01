import { Role } from "src/enums/role.enum";

export function canViewUser(requester: {id: number; role: string }, targetUser: number): boolean {
    
    // Admin and Employee can view any user
    if (requester.role === Role.Admin || requester.role === Role.Employee) {
        return true;
    }

    // Parcel Owner can view their own user details
    if (requester.role === Role.ParcelOwner && requester.id === targetUser) {
        console.log(`Parcel Owner with ID ${requester.id} accessed their own user details (id: ${targetUser}).`);
        return true;
    }

    return false;
}

export function canViewUserRut(requester: {rut: string; role: string }, targetUser: string): boolean {
    
    // Admin and Employee can view any user
    if (requester.role === Role.Admin || requester.role === Role.Employee) {
        return true;
    }

    // Parcel Owner can view their own user details
    if (requester.role === Role.ParcelOwner && requester.rut === targetUser) {
        return true;
    }

    return false;
}

export function canViewParcel(requester: {id: number; role: string }, targetParcelOwner: number[]): boolean {
    
    // Admin and Employee can view any parcel
    if (requester.role === Role.Admin || requester.role === Role.Employee) {
        return true;
    }

    // Parcel Owner can view their own parcel
    if (requester.role === Role.ParcelOwner && targetParcelOwner.includes(requester.id)) {
        return true;
    }

    // If none of the above conditions are met, deny access
    return false;
}

export function canViewNotice(requester: {id: number; role: string }, targetNoticeVisibility: boolean): boolean {
    
    // Admin and Employee can view any notice
    if (requester.role === Role.Admin || requester.role === Role.Employee) {
        return true;
    }

    // Parcel Owner can view notices that are visible to them
    if (requester.role === Role.ParcelOwner && targetNoticeVisibility) {
        return true;
    }

    // If none of the above conditions are met, deny access
    return false;
}

export function canViewPayment(requester: {id: number; role: string }, targetPaymentUserId: number[]): boolean {
    // Admin and Employee can view any payment
    if (requester.role === Role.Admin || requester.role === Role.Employee) {
        return true;
    }

    // Parcel Owner can view their own payments
    if (requester.role === Role.ParcelOwner && targetPaymentUserId.includes(requester.id)) {
        return true;
    }

    // If none of the above conditions are met, deny access
    return false;
}