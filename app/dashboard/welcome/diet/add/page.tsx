import AddItems from '@/components/AddItems'

const page = () => {
    return (
        <div className="flex justify-center items-center h-screen w-full">
            <AddItems firstTime={true} />
        </div>
    )
}

export default page
