
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
