import { onAuthenticatedUser } from '@/actions/user'
import { redirect } from 'next/navigation'

const AuthCallbackPage = async () => {
  let redirectPath: string | null = null

  try {
    const auth = await onAuthenticatedUser()

    if (auth.status === 200 || auth.status === 201) {
      // Set the redirect path to home
      redirectPath = '/'
    }

    if (auth.status === 403 || auth.status === 400 || auth.status === 500) {
      // Set the redirect path to sign-in page
      redirectPath = '/sign-in'
    }
  } catch (error) {
    console.error("Error during authentication", error)
    // If an error occurs, redirect to the sign-in page
    redirectPath = '/sign-in'
  } finally {
    // Perform the redirect if the redirectPath is set
    if (redirectPath) {
      redirect(redirectPath)
    }
  }

  return <>{/* Add the rest of your JSX if needed */}</>
}

export default AuthCallbackPage
