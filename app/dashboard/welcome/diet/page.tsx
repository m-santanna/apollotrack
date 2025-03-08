import WelcomeDiet from '@/components/welcome_user/WelcomeDiet'

const page = () => {
    return (
        <div className="flex justify-center items-center h-screen w-full">
            <WelcomeDiet firstTime={true} />
        </div>
    )
}

export default page
