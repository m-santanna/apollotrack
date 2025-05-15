// app/routes/__root.tsx
import type { ReactNode } from 'react'
import {
    Outlet,
    createRootRoute,
    HeadContent,
    Scripts,
} from '@tanstack/react-router'
import appCss from '@/app/globals.css?url'
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
                title: 'KenkoFlow',
            },
        ],
        links: [
            {
                rel: 'stylesheet',
                href: appCss,
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
