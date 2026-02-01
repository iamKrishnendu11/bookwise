"use server";

import { signIn } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { success } from "zod";

//create signin functionality
export const signInWithCredentials = async (params: Pick<AuthCredentials, 'email' | 'password'>) => {
    const { email, password } = params;

    try {
        const result = await signIn('credentials',{
            email,
            password,
            redirect: false,
        })

        if(result?.error){
            throw new Error(result.error);
        }
        return {success: true, message: 'Sign in successful'};
        
    } catch (error) {
        throw new Error('Sign in failed');
    }

}

// create signup functionality
export const signUp = async (params: AuthCredentials) => {
    const { fullName, email, password, universityId, universityCard } = params;

    // check if user already exist or not
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
        throw new Error('User already exists with this email');
    }
    // if user doesnt exist we will hash the password
    const hashedPassword= await hash(password, 10); // 10 is the salt  rounds(complexity)
    // and create a new user
    try {
        await db.insert(users).values({
            fullName,
            email,
            password: hashedPassword,
            universityId,
            universityCard
        });
        await signInWithCredentials({email, password});
       return {success: true, message:'User created successfully'};

    } catch (error) {
        console.error(error);
        throw new Error('Failed to create user');
    }

};
