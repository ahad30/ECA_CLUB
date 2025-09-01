import { MdOutlineDashboardCustomize } from "react-icons/md";
import { TfiLayoutSlider } from "react-icons/tfi";
import Club from "../Pages/Dashboard/Club/Club";
import Member from "../Pages/Dashboard/Members/Member";
import AddMember from "../Pages/Dashboard/Members/AddMember";
import EditMember from "../Pages/Dashboard/Members/EditMember";
import ViewMember from "../Pages/Dashboard/Members/ViewMember";



export const adminRoutes = [
  {
    path: "club",
    label: "Club Management",
    element: <Club />,
    icon: <MdOutlineDashboardCustomize size={20}></MdOutlineDashboardCustomize>,
  },
  {
    path: "member",
    label: "Member Management",
    element: <Member />,
    icon: <MdOutlineDashboardCustomize size={20}></MdOutlineDashboardCustomize>,
  },
  {
    path: "members/add-member",
    element: <AddMember/>,
  
  },
  {
    path: "members/edit-member/:id",
    element: <EditMember />,
  },
  {
    path: "members/view-member/:id",
    element: <ViewMember />,
  },
];
