import Spinner from './spinner'
export default function Loading() {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <Spinner childSize="w-6 h-6" outerSize="h-10 w-10" />
        </div>
    )
}
