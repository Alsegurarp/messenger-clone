import bcrypt from "bcrypt";
import NextAuth, {AuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

// import the newly created prismaDB
import prisma from '@/app/libs/prismadb';

// declare the AuthOptions
// very important to create a server session for later
export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: {
                    label: 'email', type: 'text'
                },
                password: {
                    label: 'password', type: 'password'
                }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials');
                }
                // if there are no credentials declared, we are not going to look in our db for them
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                if(!user || !user?.hashedPassword) {
                    throw new Error('Github or Google invalid credentials');
                }
                // only users that created their account with name, email and password
                // !user.hashedPassword - is because the user logged in using google or github

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
                );
                // we compare the password that the user has in the db and the one he's typing
                if(!isCorrectPassword) {
                    throw new Error('Wrong password');
                }
                return user;
                // if the user's email exist, the password exists, and the password is correct, then passes 
            }
        })
    ], 
    debug: process.env.NODE_ENV === 'development',
    session: {
        strategy: "jwt"
    }, 
    secret: process.env.NEXTAUTH_SECRET
    // during development we turn-on debug mode
    // useful info for us
}
// Inside providers, we declare the options that the user can use to log in
// if they dont want Github or Google, they need to use email and password
// those are the 'credentialsProvider'

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};