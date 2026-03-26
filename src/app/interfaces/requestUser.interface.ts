// import { Role } from "../../generated/prisma/enums";

export interface IRequestUser{
    userId : string;
    // role : Role;
    role : "User" | "Admin" | "SuperAdmin";
    email : string;
}