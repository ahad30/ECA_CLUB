import React, { useState } from 'react';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useCreateClub } from '../../../hooks/useApiData';
import ReusableModal from '../../../components/Modal/Modal';
import { toast } from 'sonner';

const AddClub = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const createClubMutation = useCreateClub();

  const handleCreateClub = async (values) => {
    setLoading(true);
    try {
      await createClubMutation.mutateAsync(values);
      message.success('Club created successfully!');
      setVisible(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create club');
      throw error;
    }
    finally {
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
        loading={createClubMutation.isLoading || loading}
        isEdit={false}
      />
    </>
  );
};

export default AddClub;