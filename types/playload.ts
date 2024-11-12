import { Request } from 'express';

// Define the User interface
export interface User {
  id: string;
  // other properties
}


// Define your payload interface
export interface Payload {
  user: User;
  // other properties
}
