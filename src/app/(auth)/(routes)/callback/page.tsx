import { onAuthenticatedUser } from '@/actions/user'
import { redirect } from 'next/navigation'

const AuthCallbackPage = async () => {
  try {
    const auth = await onAuthenticatedUser()
    console.log("This is auth", auth)

    if (!auth) {
      console.error("Authentication failed or returned null")
      return redirect('/sign-in')
    }

    if (auth.status === 200 || auth.status === 201) {
      return redirect('/')
    }

    if (auth.status === 403 || auth.status === 400 || auth.status === 500) {
      return redirect('/sign-in')
    }
  } catch (error) {
    console.error("Error during authentication", error)
    return redirect('/sign-in')
  }
}

export default AuthCallbackPage
