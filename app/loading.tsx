import { Apple, Dumbbell, ShoppingBasket } from 'lucide-react'
import React from 'react'

export default function Loading() {
    return (
        <div className="flex items-center justify-center w-full h-full gap-4">
            <Apple
                className="w-12 h-12 animate-bounce"
                style={{ animationDelay: '0.2s' }}
            />

            <Dumbbell
                className="w-12 h-12 animate-bounce"
                style={{ animationDelay: '0.3s' }}
            />

            <ShoppingBasket
                className="w-12 h-12 animate-bounce"
                style={{ animationDelay: '0.4s' }}
            />
        </div>
    )
}
