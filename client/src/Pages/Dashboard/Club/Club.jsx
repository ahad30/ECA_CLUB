import React from 'react';
import { Table, Button, Space, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import AddClub from './AddClub';
import EditClub from './EditClub';
import DashboardTable from '../../../components/Dashboard/Table/DashboardTable';
import { useClubs, useDeleteClub } from '../../../hooks/useApiData';
import { toast } from 'sonner';

const Club = () => {
  // React Query hooks for data fetching with automatic caching and refetching
  const { data: clubs = [], isLoading } = useClubs();
  const deleteClubMutation = useDeleteClub();

  const handleDeleteClub = async (clubId) => {
    try {
      await deleteClubMutation.mutateAsync(clubId);
      toast.success('Club deleted successfully');
      // No need to manually update state - React Query will automatically refetch
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete club');
    }
  };

  // No need for handleClubAdded and handleClubUpdated since React Query
  // will automatically refetch the data after mutations

  const columns = [
    {
      title: 'Club Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <EditClub club={record} />
          
          <Popconfirm
            title="Delete Club"
            description="Are you sure you want to delete this club?"
            onConfirm={() => handleDeleteClub(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              style={{ padding: 0 }}
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
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <AddClub />
      </div>

      <DashboardTable
        columns={columns}
        data={clubs.map(club => ({ ...club, key: club._id }))}
        loading={isLoading}
      />
    </div>
  );
};

export default Club;