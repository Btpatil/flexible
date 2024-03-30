import { getServerSession } from 'next-auth/next'
import { NextAuthOptions, User } from 'next-auth'
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from 'next-auth/providers/google'
import { JWT } from "next-auth/jwt";
import { SessionInterface, UserProfile } from '@/common.types';
import { createUser, getUser } from './actions';
import USER from '@/models/User';
import { getconnectionToMongoDB } from './connection';

var jsonwebtoken = require('jsonwebtoken');

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    jwt: {
        encode: ({ secret, token }) => {
            try {
                const encodedYoken = jsonwebtoken.sign({
                    ...token,
                    iss: 'grafbase',
                    exp: Math.floor(Date.now() + 365)
                }, secret)
                // console.log(encodedYoken)
                return encodedYoken
            } catch (error) {
                console.log(error)
            }
        },
        decode: async ({ secret, token }) => {
            const decodedToken = jsonwebtoken.verify(token!, secret) as JWT
            // console.log(decodedToken)
            return decodedToken
        }
    },
    theme: {
        // colorScheme: 'light',
        logo: '/logo.svg'
    },
    callbacks: {
        async session({ session }) {
            const email = session?.user?.email as string

            // console.log(session)

            try {
                const data = await getUser(email)
                const newSession = {
                    ...session,
                    user: {
                        ...session.user,
                        id: data._id.toString()
                    }
                }
                // console.log(newSession)
                return newSession
            } catch (error) {
                console.log(error)
                return session
            }
        },
        async signIn({ user }: { user: AdapterUser | User }) {
            try {
                // get user
                const userExist = await getUser(user?.email as string) as { user?: UserProfile }
                // console.log(userExist)
                
                // create  user
                if (!userExist) {
                    const newUser = new USER({
                        name: user.name,
                        email: user.email,
                        avatarUrl: user.image
                    });
            
                    const saveUser = await newUser.save()
                    console.log(saveUser)
                    return true;
                }

                // return
                return true
            } catch (error: any) {
                console.log(error.message)
                return false
            }
        }
    }
}

export async function getCurrentUser() {
    try {
        getconnectionToMongoDB()
        const session = await getServerSession(authOptions) as SessionInterface

        return session
    } catch (error) {
        console.log(error)
    }
}