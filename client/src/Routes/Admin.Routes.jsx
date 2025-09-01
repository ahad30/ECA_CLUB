import { MdOutlineDashboardCustomize } from "react-icons/md";
import { TfiLayoutSlider } from "react-icons/tfi";
import Club from "../Pages/Dashboard/Club/Club";
import Member from "../Pages/Dashboard/Members/Member";



export const adminRoutes = [
  {
    path: "club",
    label: "Club Management",
    element: <Club />,
    icon: <MdOutlineDashboardCustomize size={20}></MdOutlineDashboardCustomize>,
  },
  {
    path: "home",
    label: "Member Management",
    element: <Member />,
    icon: <MdOutlineDashboardCustomize size={20}></MdOutlineDashboardCustomize>,
  },




];
