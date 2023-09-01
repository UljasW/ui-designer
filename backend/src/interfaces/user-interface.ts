import { UUID } from "crypto";

 export default interface UserInterface {
    id: string;               // Unique identifier for the user
    email: string;            // User's email address
    password: string;         // Hashed password
    firstName?: string;       // Optional first name
    lastName?: string;        // Optional last name
    createdAt: Date;         // Optional creation date
    updatedAt: Date;         // Optional last updated date
    // Add other fields as needed
}