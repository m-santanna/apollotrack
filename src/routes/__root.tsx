// app/routes/__root.tsx
/// <reference types="vite/client" />
import type { ReactNode } from 'react'
import {
    Outlet,
    createRootRoute,
    HeadContent,
    Scripts,
} from '@tanstack/react-router'
import appCss from '@/styles/app.css?url'
import Providers from '@/components/providers'
import { NotFound } from '@/components/not-found'

export const Route = createRootRoute({
    head: () => ({
        meta: [
            {
                charSet: 'utf-8',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                title: 'ApolloTrack',
            },
        ],
        links: [
            {
                rel: 'stylesheet',
                href: appCss,
            },
            {
                rel: 'icon',
                type: 'image/png',
                sizes: '32x32',
                href: '/favicon-32x32.png',
            },
            {
                rel: 'icon',
                type: 'image/png',
                sizes: '16x16',
                href: '/favicon-16x16.png',
            },
            { rel: 'manifest', href: '/site.webmanifest' },
            { rel: 'shortcut icon', href: '/favicon.ico' },
            {
                rel: 'icon',
                type: 'image/png',
                sizes: '192x192',
                href: '/android-chrome-192x192.png',
            },
            {
                rel: 'icon',
                type: 'image/png',
                sizes: '512x512',
                href: '/android-chrome-512x512.png',
            },
            {
                rel: 'apple-touch-icon',
                sizes: '180x180',
                href: '/apple-touch-icon.png',
            },
        ],
    }),
    component: RootComponent,
    notFoundComponent: NotFound,
})

function RootComponent() {
    return (
        <RootDocument>
            <Outlet />
        </RootDocument>
    )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html suppressHydrationWarning>
            <head>
                <HeadContent />
            </head>
            <body>
                <Providers>{children}</Providers>
                <Scripts />
            </body>
        </html>
    )
}
