import WelcomeComponent from '@/components/welcome_user/WelcomeComponent'

const page = () => {
    return (
        <div className="flex justify-center items-center h-screen w-full">
            <WelcomeComponent
                mainText="Let's see your macros!"
                secondaryText="You can either set your macros yourself or let us estimate them for you."
                mainLink="/dashboard/welcome/macros/estimate"
                mainButtonText="Estimate it for me"
                secondaryLink="/dashboard/welcome/macros/yourself"
                secondaryButtonText="I'll do it"
            />
        </div>
    )
}

export default page
