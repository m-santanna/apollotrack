import { useEffect, useState } from 'react'

export function useLoadingHook() {
    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        if (!loaded) {
            const timer = setTimeout(() => setLoaded(true), 300)
            return () => clearTimeout(timer)
        }
    }, [loaded])
    return [loaded, setLoaded]
}
