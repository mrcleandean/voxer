import CloseModal from "@/components/CloseModal";
import SignIn from "@/components/SignIn";

const SignInModal = () => {
    return (
        <div className='fixed inset-0 bg-background/10 z-10'>
            <div className='container flex items-center h-full max-w-lg mx-auto'>
                <div className='relative bg-background border border-border w-full h-fit py-20 px-2 rounded-lg'>
                    <div className='absolute top-4 right-4'>
                        <CloseModal />
                    </div>
                    <SignIn />
                </div>
            </div>
        </div>
    )
}

export default SignInModal;