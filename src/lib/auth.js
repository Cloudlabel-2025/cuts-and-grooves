import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from './mongodb';
import User from '../models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                try {
                    console.log('--- Auth Attempt Start ---');
                    console.log('Email:', credentials.email);
                    
                    await dbConnect();
                    console.log('Database connected successfully');

                    const user = await User.findOne({ email: credentials.email });

                    if (!user) {
                        console.log('Auth failed: No user found for email:', credentials.email);
                        throw new Error('No user found with this email.');
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    console.log('Password valid:', isValid);

                    if (!isValid) {
                        console.log('Auth failed: Invalid password for:', credentials.email);
                        throw new Error('Invalid password.');
                    }

                    console.log('Auth successful for:', user.email);
                    return { id: user._id.toString(), email: user.email, name: 'Admin' };
                } catch (error) {
                    console.error('Auth system error:', error.message);
                    throw error;
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 60 * 60, // 1 hour
    },
    jwt: {
        maxAge: 60 * 60, // 1 hour
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
            }
            return session;
        },
    },
    pages: {
        signIn: '/admin/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
};
