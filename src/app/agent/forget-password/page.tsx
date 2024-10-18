import ResetPassword from "@/components/auth/ResetPassword"

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-3">Reset Password</h1>
        <ResetPassword/>
    </div>
  )
}

export default page