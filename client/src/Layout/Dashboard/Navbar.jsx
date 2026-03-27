import { Dropdown, Avatar, Badge } from 'antd';
import {
  LogoutOutlined, UserOutlined, MenuOutlined, BellOutlined,
  HomeOutlined, TeamOutlined, TrophyOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const routeMeta = {
  '/admin/club':               { label: 'Club Management',  icon: <TrophyOutlined /> },
  '/admin/member':             { label: 'Member Management', icon: <TeamOutlined /> },
  '/admin/members/add-member': { label: 'Add Member Record', icon: <TeamOutlined /> },
};

const getBreadcrumb = (pathname) => {
  const crumbs = [{ label: 'Dashboard', path: '/', icon: <HomeOutlined /> }];
  const match = Object.entries(routeMeta).find(([key]) => pathname.startsWith(key));
  if (match) crumbs.push({ label: match[1].label, path: match[0], icon: match[1].icon });
  if (pathname.includes('/view-member/')) crumbs.push({ label: 'View Record' });
  if (pathname.includes('/edit-member/')) crumbs.push({ label: 'Edit Record' });
  return crumbs;
};

const Navbar = ({ setIsSidebarOpen, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const breadcrumbs = getBreadcrumb(location.pathname);

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'U';

  const menuItems = [
    {
      key: 'user-info',
      label: (
        <div className="px-1 py-1 min-w-[160px]">
          <p className="font-semibold text-gray-800">{user?.username}</p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-14 px-4 sm:px-6">

        {/* Left: hamburger + breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden text-gray-500 hover:text-gray-800 transition-colors p-1.5 rounded-lg hover:bg-gray-100"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            <MenuOutlined className="text-base" />
          </button>

          {/* Breadcrumb */}
          <nav className="hidden sm:flex items-center gap-1.5 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-gray-300">/</span>}
                {crumb.path && i < breadcrumbs.length - 1 ? (
                  <Link
                    to={crumb.path}
                    className="flex items-center gap-1 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {crumb.icon}
                    <span>{crumb.label}</span>
                  </Link>
                ) : (
                  <span className="flex items-center gap-1 text-gray-700 font-medium">
                    {crumb.icon}
                    <span>{crumb.label}</span>
                  </span>
                )}
              </span>
            ))}
          </nav>
        </div>

        {/* Right: notifications + user menu */}
        <div className="flex items-center gap-2">
          <Badge dot offset={[-2, 2]}>
            <button className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors">
              <BellOutlined className="text-base" />
            </button>
          </Badge>

          <div className="w-px h-6 bg-gray-200 mx-1" />

          <Dropdown
            menu={{ items: menuItems }}
            trigger={['click']}
            placement="bottomRight"
          >
            <button className="flex items-center gap-2 hover:bg-gray-100 pl-1 pr-2 py-1 rounded-lg transition-colors">
              <Avatar
                size={32}
                style={{ backgroundColor: '#2563eb', fontSize: 13, fontWeight: 600 }}
              >
                {initials}
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-gray-700 leading-tight">
                  {user?.username}
                </p>
                <p className="text-[10px] text-gray-400 leading-tight">Admin</p>
              </div>
            </button>
          </Dropdown>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
