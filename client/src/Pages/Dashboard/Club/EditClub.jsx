import React, { useState } from 'react';
import { Button, message } from 'antd';
import { EditOutlined } from '@ant-design/icons'
import { useUpdateClub } from '../../../hooks/useApiData';
import ReusableModal from '../../../components/Modal/Modal';

const EditClub = ({ club }) => {
  const [visible, setVisible] = useState(false);
  const updateClubMutation = useUpdateClub();

  const handleUpdateClub = async (values) => {
    try {
      await updateClubMutation.mutateAsync({ id: club._id, data: values });
      message.success('Club updated successfully!');
      setVisible(false);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to update club');
      throw error;
    }
  };

  return (
    <>
      <Button
        type="link"
        icon={<EditOutlined />}
        onClick={() => setVisible(true)}
        style={{ padding: 0 }}
      >
        Edit
      </Button>

      <ReusableModal
        visible={visible}
        onCancel={() => setVisible(false)}
        onFinish={handleUpdateClub}
        title="Edit Club"
        initialValues={{ name: club.name }}
        loading={updateClubMutation.isLoading}
        isEdit={true}
      />
    </>
  );
};

export default EditClub;