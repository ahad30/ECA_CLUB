import { Outlet } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import { useState } from "react";
import Navbar from "./Navbar";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex max-w-full mx-auto">
      <div className="hidden  lg:block">
        <DashboardSidebar></DashboardSidebar>
      </div>

      {/* for mobile */}
      <div className="lg:hidden">
        <DashboardSidebar
          className={`absolute duration-700 ${
            isSidebarOpen ? "" : "-ml-[500px]"
          }`}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        ></DashboardSidebar>
      </div>

      <div className="relative scrollbar-0 h-screen overflow-y-scroll w-full">
        <div className="w-full text-gray-900">
          <Navbar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          ></Navbar>
        </div>
        <div
          onClick={() => {
            if (isSidebarOpen) {
              setIsSidebarOpen(false);
            }
          }}
          className=" py-12 bg-[#F3F5F7] px-5 w-full"
        >
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
