import { onAuthenticatedUser } from '@/actions/user'

import { redirect } from 'next/navigation'

const AuthCallbackPage = async () => {
  const auth = await onAuthenticatedUser()
  console.log("This is auth",auth)
  if (auth.status === 200 || auth.status === 201)
    return redirect(`/`)

  if (auth.status === 403 || auth.status === 400 || auth.status === 500)
    return redirect('/sign-in')
}

export default AuthCallbackPage