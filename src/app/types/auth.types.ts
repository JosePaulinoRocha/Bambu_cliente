export interface User {
    UserID: number;
    Name: string;
    Email: string;
    Password: string;
  }
  
  export interface LoginResponse {
    token: string;
    user: User;
  }
  
  export interface Session {
    token: string;
    user: User;
  }