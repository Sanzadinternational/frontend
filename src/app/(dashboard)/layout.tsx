import AppSidebar from "@/components/sidebar/app-sidebar"

const DashboardLayout = ({children}:{children:React.ReactNode}) => {
  return (
    // <div className="flex justify-center items-center h-[100vh]">
    //     {children}
    // </div>
    <AppSidebar>{children}</AppSidebar>
  )
}

export default DashboardLayout