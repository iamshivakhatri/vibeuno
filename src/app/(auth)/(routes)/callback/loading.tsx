import { Spinner } from '@/components/global/loader/spinner'

type Props = {}

const AuthLoading = (props: Props) => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spinner />
    </div>
  )
}

export default AuthLoading