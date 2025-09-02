import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import AddClub from './AddClub';
import EditClub from './EditClub';
import DashboardTable from '../../../components/Dashboard/Table/DashboardTable';
import { clubAPI } from '../../../services/api';

const Club = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const response = await clubAPI.getClubs();
      setClubs(response?.data?.data);
    } catch (error) {
      console.log(error)
      message.error('Failed to fetch clubs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClub = async (clubId) => {
    try {
      await clubAPI.deleteClub(clubId);
      setClubs(clubs.filter(club => club._id !== clubId));
      message.success('Club deleted successfully');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to delete club');
    }
  };

  const handleClubAdded = (newClub) => {
    setClubs([...clubs, newClub]);
  };

  const handleClubUpdated = (updatedClub) => {
    setClubs(clubs.map(club => 
      club._id === updatedClub._id ? updatedClub : club
    ));
  };

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
          <EditClub club={record} onClubUpdated={handleClubUpdated} />
          
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
        <AddClub onClubAdded={handleClubAdded} />
      </div>

      <DashboardTable
        columns={columns}
        data={clubs.map(club => ({ ...club, key: club._id }))}
        loading={loading}
      />
    </div>
  );
};

export default Club;