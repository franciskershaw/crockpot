import { ROLE } from "../constants";

export interface IUser {
    _id: string;
    email: string;
    name: string;
    emailVerified: Date | null;
    image?: string;
    role: typeof ROLE;
    createdAt: Date;
    updatedAt: Date;
}