/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { adminRoutes } from "../../Routes/Admin.Routes";
import { sidebarGenerator } from "../../utils/sidebarGenerator";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { IoIosArrowDropleftCircle } from "react-icons/io";

const DashboardSidebar = ({ className, setIsSidebarOpen }) => {
  const [open, setOpen] = useState("");

  const handleOpen = (value) => {
    setOpen(open === value ? "" : value);
  };

  const sidebarData = sidebarGenerator(adminRoutes);

  const location = useLocation();
  // console.log(location);
  // console.log(sidebarData);

  useEffect(() => {
    if (localStorage.getItem("dropDown")) {
      const dropDown = JSON.parse(localStorage.getItem("dropDown"));
      if (dropDown.collapse) {
        setOpen(dropDown.collapse);
      }
    }
  }, []);

  return (
    <div
      className={`w-[250px] z-10 bg-[#121c34] duration-300 ${className} h-screen thin-scrollbar overflow-y-scroll text-[13px] text-[#E0E0E0]`}
    >
      <div className="pt-12">
        <div className="flex justify-end">
          {setIsSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="lg:hidden mb-3"
            >
              <IoIosArrowDropleftCircle size={35} />
            </button>
          )}
        </div>
        {sidebarData.map((item) => {
          if (item.children) {
            return (
              <div key={item.key}>
                {/* dropdown header */}
                <div
                  onClick={() => handleOpen(item.key)}
                  className="px-4 cursor-pointer py-3 flex items-center justify-between mr-4 mb-1"
                >
                  {/* text */}
                  <div className="flex items-center gap-x-2">
                    <span>{item.icon}</span>
                    <p>{item.label}</p>
                  </div>
                  {/* icon */}
                  <p>
                    {open === item.key ? (
                      <MdOutlineKeyboardArrowDown size={20} />
                    ) : (
                      <MdOutlineKeyboardArrowRight size={20} />
                    )}
                  </p>
                </div>
                {/* dropDown menu */}
                <div
                  className={`overflow-hidden transition-max-height ${
                    open === item.key
                      ? "max-h-96 opacity-100 opening"
                      : "max-h-0 opacity-0 closing"
                  }`}
                >
                  {item.children.map((subItem) => (
                    <Link key={subItem.key} to={subItem.key}>
                      <div
                        onClick={() => {
                          localStorage.setItem(
                            "dropDown",
                            JSON.stringify({
                              location: location.pathname,
                              collapse: item.key,
                            })
                          );
                        }}
                        className={`pl-7 py-2 mr-4 mb-1 hover:pl-7 hover:py-2 hover:mr-4 hover:mb-1 hover:bg-[#323F5D] hover:rounded-r-full hover:ml-2 duration-500 ${
                          location.pathname === `/admin/${subItem.key}`
                            ? "bg-[#323F5D] rounded-full"
                            : ""
                        }`}
                      >
                        <p>- {subItem.label}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          } else {
            return (
              <Link to={item.key} key={item.key}>
                <div
                  onClick={() => {
                    setOpen("");
                    localStorage.removeItem("dropDown");
                  }}
                  className={`px-4 py-3 hover:px-4 hover:py-3 hover:rounded-r-full hover:bg-[#323F5D] hover:mr-4 hover:mb-1 mr-4 mb-1 ${
                    location.pathname === `/admin/${item.key}`
                      ? "bg-[#1b3a9a] rounded-full"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-x-2">
                    <span>{item.icon}</span>
                    <p>{item.label}</p>
                  </div>
                </div>
              </Link>
            );
          }
        })}
      </div>
    </div>
  );
};

export default DashboardSidebar;
