import React, { useState } from 'react';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useCreateClub } from '../../../hooks/useApiData';
import ReusableModal from '../../../components/Modal/Modal';

const AddClub = () => {
  const [visible, setVisible] = useState(false);
  const createClubMutation = useCreateClub();

  const handleCreateClub = async (values) => {
    try {
      await createClubMutation.mutateAsync(values);
      message.success('Club created successfully!');
      setVisible(false);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to create club');
      throw error;
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
        loading={createClubMutation.isLoading}
        isEdit={false}
      />
    </>
  );
};

export default AddClub;