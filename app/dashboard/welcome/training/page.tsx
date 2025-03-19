import WelcomeComponent from '@/components/welcome_user/WelcomeComponent'

const page = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <WelcomeComponent
                mainText="Training!"
                secondaryText="In this section you'll create group of exercises (e.g. Legday), and add exercises to them."
                mainButtonText="Makes sense!"
                mainLink="/dashboard/welcome/training/add"
            />
        </div>
    )
}

export default page
