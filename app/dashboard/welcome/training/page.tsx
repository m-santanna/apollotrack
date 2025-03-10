import WelcomeComponent from '@/components/welcome_user/WelcomeComponent'

const page = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <WelcomeComponent
                mainText="Training!"
                secondaryText="Let's get moving! Tell us about your training routine."
                mainButtonText="For sure!"
                mainLink="/dashboard/welcome/training/add"
            />
        </div>
    )
}

export default page
