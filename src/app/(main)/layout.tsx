
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// import { RoleProvider } from "@/components/context/RoleContext";

const MainLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <>
      <Header/>
      {children}
      <Footer />
    </>
  );
};

export default MainLayout;
