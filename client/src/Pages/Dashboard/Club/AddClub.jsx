import React, { useState } from 'react';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { toast } from 'sonner';
import { clubAPI } from '../../../services/api';
import ReusableModal from '../../../components/Modal/Modal';


const AddClub = ({ onClubAdded }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateClub = async (values) => {
    setLoading(true);
    try {
      const response = await clubAPI.createClub(values);
      onClubAdded(response.data.data);
      message.success('Club created successfully!');
      setVisible(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create club');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setVisible(true)}
      >
        Add Club
      </Button>

      <ReusableModal
        visible={visible}
        onCancel={() => setVisible(false)}
        onFinish={handleCreateClub}
        title="Add New Club"
        loading={loading}
        isEdit={false}
      />
    </>
  );
};

export default AddClub;