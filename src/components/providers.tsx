import { ThemeProvider } from 'next-themes'
import { Provider } from 'jotai/react'
import React from 'react'

function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider>
            <ThemeProvider attribute={'class'}>{children}</ThemeProvider>
        </Provider>
    )
}

export default Providers
