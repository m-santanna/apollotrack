import WelcomeComponent from '@/components/welcome_user/WelcomeComponent'

const page = () => {
    return (
        <div className="flex justify-center items-center h-screen w-full">
            <WelcomeComponent
                mainText="Food!"
                secondaryText="In this section, you'll be adding the things you usually eat on a daily basis,
                with their respective macros."
                mainButtonText="Let's do it!"
                mainLink="/dashboard/welcome/diet/add"
            />
        </div>
    )
}

export default page
