// src/models/user.model.ts
export interface CreateUserInput {
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string; // base64 string
  company?: string;
  size?: string;
  role?: string;
  country?: string;
  timezone?: string;
  verifiedDomain?: string;
}
