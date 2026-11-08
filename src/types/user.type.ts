export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  displayName?: string | null;
  bio?: string | null;
  phone?: string | null;
  website?: string | null;
}
