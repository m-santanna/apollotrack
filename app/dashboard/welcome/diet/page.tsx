import WelcomeComponent from '@/components/welcome_user/WelcomeComponent'

const page = () => {
    return (
        <div className="flex justify-center items-center h-screen w-full">
            <WelcomeComponent
                mainText="Food!"
                secondaryText="If you provide us with what you eat, we will do the math for you."
                mainButtonText="Let's do it!"
                mainLink="/dashboard/welcome/diet/add"
            />
        </div>
    )
}

export default page
