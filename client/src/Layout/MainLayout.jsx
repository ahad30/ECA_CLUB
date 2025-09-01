import { Outlet } from "react-router-dom";


const MainLayout = () => {
  return (
    <>

    <div className={`min-h-screen lg:p-8`}>
      <Outlet />
    </div>

    </>
  );
};

export default MainLayout;
