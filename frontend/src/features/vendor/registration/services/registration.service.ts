/**
 * Vendor Registration Service
 * Handle API calls for vendor account registration
 */

export const registrationService = {
  /**
   * Register vendor account
   */
  async registerAccount(data: {
    companyName: string;
    industry: string;
    employeeCount: string;
    businessDescription: string;
    serviceDescription: string;
    corporateUrl: string;
    lastName: string;
    firstName: string;
    lastNameKana: string;
    firstNameKana: string;
    email: string;
  }) {
    // TODO: Implement API call
    // const response = await fetch('/api/vendor/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    // return response.json();

    console.log('Registering vendor account:', data);
    return { success: true };
  },

  /**
   * Verify invitation token
   */
  async verifyInvitation(token: string) {
    // TODO: Implement API call
    console.log('Verifying invitation token:', token);
    return { valid: true, email: 'example@email.com' };
  },
};
