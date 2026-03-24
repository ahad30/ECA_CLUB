import React from 'react';
import { Modal, Button, Form, Input, message } from 'antd';

const ReusableModal = ({
  visible,
  onCancel,
  onFinish,
  title,
  initialValues,
  loading,
  isEdit = false
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleFinish = async (values) => {
    try {
      await onFinish(values);
      form.resetFields();
      onCancel();
      message.success(`Club ${isEdit ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      message.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={initialValues}
      >
        <Form.Item
          name="name"
          label="Club Name"
          rules={[
            { required: true, message: 'Please enter club name' },
            { min: 2, message: 'Club name must be at least 2 characters' },
            { max: 100, message: 'Club name cannot exceed 100 characters' }
          ]}
        >
          <Input placeholder="Enter club name" />
        </Form.Item>

        <Form.Item>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button onClick={onCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEdit ? 'Update' : 'Create'} Club
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReusableModal;