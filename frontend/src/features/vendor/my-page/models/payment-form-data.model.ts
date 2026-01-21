// =============================================================================
// PAYMENT FORM DATA MODEL
// =============================================================================

export interface PaymentFormData {
    cardNumber: string;
    expirationDate: string;
    securityCode: string;
    cardholderName: string;
    postalCode: string;
    prefecture: string;
    city: string;
    streetAddress: string;
    buildingRoom?: string;
}
