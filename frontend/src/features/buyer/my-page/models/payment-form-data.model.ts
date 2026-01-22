// =============================================================================
// PAYMENT FORM DATA MODEL
// =============================================================================

export interface PaymentFormData {
    cardNumber: string;
    expiryDate: string;
    securityCode: string;
    cardholderName: string;
    postalCode: string;
    prefecture: string;
    city: string;
    streetAddress: string;
    buildingName: string;
}
