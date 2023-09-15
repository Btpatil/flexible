import {getServerSession} from 'next-auth/next'
import {NextAuthOptions, User} from 'next-auth'
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from 'next-auth/providers/google'
import jsonwebtoken from 'jsonwebtoken'
import { JWT } from "next-auth/jwt";
import { SessionInterface, UserProfile } from '@/common.types';
import { createUser, getUser } from './actions';

export const authOptions:NextAuthOptions = {
    secret:process.env.NEXTAUTH_SECRET,
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    jwt: {
        encode: ({secret, token}) => {
            const encodedYoken = jsonwebtoken.sign({
                ...token,
                iss: 'grafbase',
                exp: Math.floor(Date.now()/1000) + 60*60
            }, secret)

            return encodedYoken
        },
        decode:async ({secret, token}) => {
            const decodedToken = jsonwebtoken.verify(token!, secret) as JWT

            return decodedToken
        }
    },
    theme: {
        colorScheme: 'light',
        logo: '/logo.svg'
    },
    callbacks: {
        async session({session}){
            const email = session?.user?.email as string

            try {
                const data = await getUser(email) as {user?: UserProfile}
                const newSession = {
                    ...session,
                    user:{
                        ...session.user,
                        ...data.user
                    }
                }

                return  newSession
            } catch (error) {
                console.log(error)
                return session
            }
        },
        async signIn({user}: {user: AdapterUser | User}){
            try {
                // get user
                const userExist = await getUser(user?.email as string) as {user? : UserProfile}

                // create  user
                if (!userExist.user) {
                    await createUser(
                        user.name as string, 
                        user.image as string, 
                        user.email as string
                        )
                }

                // return
                return true
            } catch (error:any) {
                console.log(error.message)
                return false
            }
        }
    }
}

export async function getCurrentUser() {
 const session = await getServerSession(authOptions) as SessionInterface
 return session
}