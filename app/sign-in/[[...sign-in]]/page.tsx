import { SignIn } from '@clerk/nextjs'

const SignInPage = () => {
  return (
    <div className="flex justify-center py-24">
      <SignIn forceRedirectUrl="/journal" />
    </div>
  )
}

export default SignInPage
