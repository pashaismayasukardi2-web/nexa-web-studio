export interface IAMUser {
  id: string;
  identity_subject: string;
  display_name: string;
  email: string | null;
  email_verified: boolean;
  status: string;
  roles?: string[];
  organizations?: Array<{
    id: string;
    name: string;
    slug: string;
    role_code: string;
    role_name: string;
  }>;
  entitlements?: Array<{
    app_code: string;
    app_name: string;
    status: string;
    plan_code: string;
  }>;
}

export interface AuthSession {
  user: IAMUser;
  accessToken: string;
  idToken: string;
  expiresAt: number;
}

