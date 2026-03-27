import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { adminRoutes } from "../../Routes/Admin.Routes";
import { sidebarGenerator } from "../../utils/sidebarGenerator";
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { TbSchool } from "react-icons/tb";

const DashboardSidebar = ({ className, setIsSidebarOpen }) => {
  const [open, setOpen] = useState("");
  const sidebarData = sidebarGenerator(adminRoutes);
  const location = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem("dropDown");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.collapse) setOpen(parsed.collapse);
    }
  }, []);

  const isActive = (path) => location.pathname === `/admin/${path}`;

  return (
    <div
      className={`w-[260px] z-20 flex flex-col bg-[#0f172a] duration-300 ${className} h-screen text-sm text-slate-300 shadow-2xl`}
    >
      {/* Brand / Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <TbSchool size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">ECA Club</p>
            <p className="text-slate-400 text-[10px] leading-tight">Management System</p>
          </div>
        </div>

        {setIsSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-700"
          >
            <IoClose size={20} />
          </button>
        )}
      </div>

      {/* Navigation Label */}
      <div className="px-5 pt-5 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Navigation
        </p>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto thin-scrollbar px-3 pb-6">
        {sidebarData.map((item) => {
          if (item.children) {
            return (
              <div key={item.key} className="mb-1">
                <button
                  onClick={() => {
                    const next = open === item.key ? "" : item.key;
                    setOpen(next);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-150 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <span className="text-slate-500">
                    {open === item.key
                      ? <MdOutlineKeyboardArrowDown size={18} />
                      : <MdOutlineKeyboardArrowRight size={18} />}
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    open === item.key ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="ml-4 mt-1 border-l border-slate-700 pl-3 flex flex-col gap-0.5">
                    {item.children.map((subItem) => (
                      <Link
                        key={subItem.key}
                        to={subItem.key}
                        onClick={() => {
                          localStorage.setItem("dropDown", JSON.stringify({ collapse: item.key }));
                          if (setIsSidebarOpen) setIsSidebarOpen(false);
                        }}
                      >
                        <div
                          className={`px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                            isActive(subItem.key)
                              ? "bg-blue-600/20 text-blue-400 font-medium"
                              : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                          }`}
                        >
                          {subItem.label}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <Link
              to={item.key}
              key={item.key}
              onClick={() => {
                setOpen("");
                localStorage.removeItem("dropDown");
                if (setIsSidebarOpen) setIsSidebarOpen(false);
              }}
            >
              <div
                className={`flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg transition-all duration-150 ${
                  isActive(item.key)
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-medium"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                }`}
              >
                <span className={isActive(item.key) ? "text-white" : "text-slate-400"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-slate-700/60">
        <p className="text-[10px] text-slate-600 text-center">
          &copy; {new Date().getFullYear()} ECA Club System
        </p>
      </div>
    </div>
  );
};

export default DashboardSidebar;
