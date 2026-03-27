import { Button, Space, Popconfirm, Tag, Typography } from 'antd';
import { DeleteOutlined, TrophyOutlined } from '@ant-design/icons';
import AddClub from './AddClub';
import EditClub from './EditClub';
import DashboardTable from '../../../components/Dashboard/Table/DashboardTable';
import { useClubs, useDeleteClub } from '../../../hooks/useApiData';
import { toast } from 'sonner';

const { Title, Text } = Typography;

const Club = () => {
  const { data: clubs = [], isLoading } = useClubs();
  const deleteClubMutation = useDeleteClub();

  const handleDeleteClub = async (clubId) => {
    try {
      await deleteClubMutation.mutateAsync(clubId);
      toast.success('Club deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete club');
    }
  };

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 55,
      render: (_, __, i) => (
        <span className="text-gray-400 text-xs font-medium">{i + 1}</span>
      ),
    },
    {
      title: 'Club Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <TrophyOutlined className="text-blue-600 text-xs" />
          </div>
          <span className="font-medium text-gray-800">{name}</span>
        </div>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (date) => (
        <Tag color="default" style={{ borderRadius: 6 }}>
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
          })}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      render: (_, record) => (
        <Space size="small">
          <EditClub club={record} />
          <Popconfirm
            title="Delete Club"
            description="This will remove the club permanently."
            onConfirm={() => handleDeleteClub(record._id)}
            okText="Delete"
            okButtonProps={{ danger: true }}
            cancelText="Cancel"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
              loading={deleteClubMutation.isLoading}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Title level={4} style={{ margin: 0, color: '#111827' }}>
            Club Management
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Manage all ECA clubs &mdash; {clubs.length} club{clubs.length !== 1 ? 's' : ''} registered
          </Text>
        </div>
        <AddClub />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <DashboardTable
          columns={columns}
          data={clubs.map((club) => ({ ...club, key: club._id }))}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default Club;
