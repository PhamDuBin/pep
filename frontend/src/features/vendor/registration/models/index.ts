export interface AccountFormData {
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
}

export interface AccountFormErrors {
  companyName?: string;
  industry?: string;
  employeeCount?: string;
  businessDescription?: string;
  serviceDescription?: string;
  corporateUrl?: string;
  lastName?: string;
  firstName?: string;
  lastNameKana?: string;
  firstNameKana?: string;
}
