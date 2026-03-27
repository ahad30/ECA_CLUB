import { useState, useEffect } from 'react';
import {
  Button, Space, Popconfirm, Select, Tag, Typography,
  Progress, message
} from 'antd';
import {
  DeleteOutlined, EyeOutlined, EditOutlined, PlusOutlined,
  FilterOutlined, CloseCircleOutlined,
  TeamOutlined, ManOutlined, WomanOutlined, FileTextOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DashboardTable from '../../../components/Dashboard/Table/DashboardTable';
import {
  useMembers, useClubs, useClasses, useSections,
  useClubStats, useDeleteMember
} from '../../../hooks/useApiData';

const { Option } = Select;
const { Title, Text } = Typography;

const QUOTA = 24;

const StatCard = ({ icon, label, value, color, sub }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-4">
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: `${color}18` }}
    >
      <span style={{ color, fontSize: 20 }}>{icon}</span>
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800 leading-none">{value ?? '—'}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      {sub !== undefined && (
        <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
      )}
    </div>
  </div>
);

const Member = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ club: '', class_std: '', section: '' });
  const [filteredSections, setFilteredSections] = useState([]);

  const { data: members = [], isLoading: membersLoading, refetch: refetchMembers } = useMembers(filters);
  const { data: clubs = [], isLoading: clubsLoading } = useClubs();
  const { data: classes = [], isLoading: classesLoading } = useClasses();
  const { data: sections = [], isLoading: sectionsLoading } = useSections();
  const { data: stats, isLoading: statsLoading } = useClubStats(filters.club);
  const deleteMemberMutation = useDeleteMember();

  useEffect(() => { refetchMembers(); }, [filters, refetchMembers]);

  useEffect(() => {
    if (filters.class_std) {
      setFilteredSections(sections.filter(s => s.class_name === filters.class_std));
    } else {
      setFilteredSections(sections);
    }
  }, [filters.class_std, sections]);

  const handleDeleteMember = async (memberId) => {
    try {
      await deleteMemberMutation.mutateAsync(memberId);
      message.success('Member record deleted');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to delete');
    }
  };

  const handleFilterChange = (key, value) => {
    if (key === 'class_std') {
      setFilters(prev => ({ ...prev, [key]: value, section: '' }));
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const clearFilters = () => setFilters({ club: '', class_std: '', section: '' });
  const hasFilters = filters.club || filters.class_std || filters.section;

  const filterOption = (input, option) =>
    option.children?.toLowerCase().includes(input.toLowerCase());

  const columns = [
    {
      title: 'Club',
      key: 'club',
      render: (_, record) => (
        <Tag color="geekblue" style={{ borderRadius: 20, fontWeight: 500 }}>
          {record.club?.name || 'N/A'}
        </Tag>
      ),
    },
    {
      title: 'Class',
      dataIndex: 'class_std',
      key: 'class_std',
      render: (v) => <span className="font-medium text-gray-700">{v}</span>,
    },
    {
      title: 'Section',
      dataIndex: 'section',
      key: 'section',
      render: (v) => <span className="text-gray-600">{v}</span>,
    },
    {
      title: 'Students',
      key: 'total',
      render: (_, record) => (
        <span className="font-bold text-gray-800">{record.students?.length ?? 0}</span>
      ),
    },
    {
      title: 'Male',
      key: 'male',
      render: (_, record) => (
        <Tag color="blue" icon={<ManOutlined />}>
          {record.students?.filter(s => s.gender === 'male').length ?? 0}
        </Tag>
      ),
    },
    {
      title: 'Female',
      key: 'female',
      render: (_, record) => (
        <Tag color="magenta" icon={<WomanOutlined />}>
          {record.students?.filter(s => s.gender === 'female').length ?? 0}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 160,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            className="text-blue-600 hover:!text-blue-700"
            onClick={() => navigate(`/admin/members/view-member/${record._id}`)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            className="text-amber-500 hover:!text-amber-600"
            onClick={() => navigate(`/admin/members/edit-member/${record._id}`)}
          />
          <Popconfirm
            title="Delete record?"
            description="This action cannot be undone."
            onConfirm={() => handleDeleteMember(record._id)}
            okText="Delete"
            okButtonProps={{ danger: true }}
            cancelText="Cancel"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
              loading={deleteMemberMutation.isLoading}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const loading = membersLoading || clubsLoading || classesLoading || sectionsLoading;

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Title level={4} style={{ margin: 0, color: '#111827' }}>
            Member Management
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {members.length} record{members.length !== 1 ? 's' : ''} found
            {hasFilters ? ' (filtered)' : ''}
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/admin/members/add-member')}
          size="middle"
        >
          Add Member Record
        </Button>
      </div>

      {/* Stats (only when club filter is active) */}
      {stats && !statsLoading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <StatCard
            icon={<TeamOutlined />}
            label="Total Students"
            value={stats.total_students}
            color="#1677ff"
          />
          <StatCard
            icon={<ManOutlined />}
            label="Male Students"
            value={stats.total_male}
            color="#0958d9"
            sub={`${QUOTA - stats.total_male} slots left`}
          />
          <StatCard
            icon={<WomanOutlined />}
            label="Female Students"
            value={stats.total_female}
            color="#c41d7f"
            sub={`${QUOTA - stats.total_female} slots left`}
          />
          <StatCard
            icon={<FileTextOutlined />}
            label="Member Records"
            value={stats.total_members}
            color="#52c41a"
          />
        </div>
      )}

      {/* Quota bars (only when club filter is active) */}
      {stats && !statsLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-gray-700 flex items-center gap-1">
                <ManOutlined className="text-blue-500" /> Male Quota
              </span>
              <span className="text-gray-500">{stats.total_male} / {QUOTA}</span>
            </div>
            <Progress
              percent={Math.round((stats.total_male / QUOTA) * 100)}
              strokeColor="#2563eb"
              trailColor="#dbeafe"
              showInfo={false}
              size="small"
            />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-gray-700 flex items-center gap-1">
                <WomanOutlined className="text-pink-500" /> Female Quota
              </span>
              <span className="text-gray-500">{stats.total_female} / {QUOTA}</span>
            </div>
            <Progress
              percent={Math.round((stats.total_female / QUOTA) * 100)}
              strokeColor="#db2777"
              trailColor="#fce7f3"
              showInfo={false}
              size="small"
            />
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <FilterOutlined className="text-gray-400" />
          <span className="text-sm font-medium text-gray-600">Filters</span>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              <CloseCircleOutlined /> Clear all
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            placeholder="All Clubs"
            value={filters.club || undefined}
            onChange={(v) => handleFilterChange('club', v ?? '')}
            style={{ width: '100%' }}
            allowClear
            showSearch
            filterOption={filterOption}
            loading={clubsLoading}
          >
            {clubs.map(club => (
              <Option key={club._id} value={club._id}>{club.name}</Option>
            ))}
          </Select>
          <Select
            placeholder="All Classes"
            value={filters.class_std || undefined}
            onChange={(v) => handleFilterChange('class_std', v ?? '')}
            style={{ width: '100%' }}
            allowClear
            showSearch
            filterOption={filterOption}
            loading={classesLoading}
          >
            {classes.map(cls => (
              <Option key={cls.id || cls.class_name} value={cls.class_name}>
                {cls.class_name}
              </Option>
            ))}
          </Select>
          <Select
            placeholder={filters.class_std ? 'All Sections' : 'Select class first'}
            value={filters.section || undefined}
            onChange={(v) => handleFilterChange('section', v ?? '')}
            style={{ width: '100%' }}
            allowClear
            showSearch
            filterOption={filterOption}
            loading={sectionsLoading}
            disabled={!filters.class_std}
          >
            {filteredSections.map(sec => (
              <Option key={sec.id || sec.section_name} value={sec.section_name}>
                {sec.section_name}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <DashboardTable
          columns={columns}
          data={members.map(m => ({ ...m, key: m._id }))}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Member;
