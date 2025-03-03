import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/src/db'
import { user, session, account, verification } from '@/src/db/schema'

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema: {
            user,
            session,
            account,
            verification,
        },
    }),
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
        discord: {
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        },
    },
})
