import Login from "@/components/auth/Login"


const page = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-3">Admin Login</h1>
        <Login/>
    </div>
  )
}

export default page