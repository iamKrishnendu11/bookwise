import NextAuth, { User } from "next-auth"
import { compare } from "bcryptjs";
 import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./database/drizzle";
import { users } from "./database/schema";
import { eq } from "drizzle-orm/sql/expressions/conditions";

export const { handlers, signIn, signOut, auth } = NextAuth({

    session: {
        strategy: 'jwt',
    },
  providers: [
    CredentialsProvider({
        async authorize(credentials) {
            if(!credentials?.email || !credentials?.password){
                throw new Error('Email and Password are required');
            }

            const user= await db.select().from(users).where(eq(users.email,credentials.email.toString())).limit(1);

            if(user.length ===0){
                throw new Error('No user found with the given email');
            }

            const isPasswodValid= await compare (credentials.password.toString(), user[0].password);
            if(!isPasswodValid){
                throw new Error('Invalid password');
            }
            return {
                id: user[0].id.toString(),
                email: user[0].email,
                name: user[0].fullName,
            } as User
        }
    })
  ],

  pages:{
    signIn:'/auth/signin',
  },

  callbacks:{
    async jwt({token, user}){
        if(user){
            token.id= user.id;
            token.name=user.name;
        }

        return token;
    },

    async session({session, token}){
        if(session.user){
            session.user.id= token.id as string;
            session.user.name= token.name as string;
        }
        return session;
    }
  }
});