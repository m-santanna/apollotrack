import { Apple, Dumbbell, ShoppingBasket } from 'lucide-react'
import React from 'react'

export default function Loading() {
    return (
        <div className="flex items-center justify-center w-screen h-screen gap-4">
            <Apple className="w-12 h-12 animate-bounce" />

            <Dumbbell className="w-12 h-12 animate-bounce" />

            <ShoppingBasket className="w-12 h-12 animate-bounce" />
        </div>
    )
}
