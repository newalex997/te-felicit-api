export enum Role {
  Admin = 'Admin',
  User = 'User',
}

declare global {
  namespace Express {
    export interface Request {
      user: { id: string; role: Role };
    }
  }
}
