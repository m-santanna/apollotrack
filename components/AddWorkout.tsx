'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const AddWorkout = () => {
    const router = useRouter()
    const handleSubmit = () => {
        //TODO
        router.push('/dashboard')
    }
    return <div>AddWorkout</div>
}

export default AddWorkout
