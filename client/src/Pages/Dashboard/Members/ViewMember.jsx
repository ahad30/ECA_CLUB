import { useState, useEffect } from 'react';
import {
  Card, Descriptions, Table, Tag, Button, Spin, Alert,
  Statistic, Row, Col, Divider, Typography
} from 'antd';
import {
  ArrowLeftOutlined, UserOutlined, ManOutlined, WomanOutlined,
  CalendarOutlined, TeamOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { memberAPI } from '../../../services/api';

const { Title, Text } = Typography;

const ViewMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMember();
  }, [id]);

  const fetchMember = async () => {
    setLoading(true);
    try {
      const response = await memberAPI.getMember(id);
      setMember(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch member record');
    } finally {
      setLoading(false);
    }
  };

  const studentColumns = [
    {
      title: '#',
      key: 'index',
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Student ID',
      dataIndex: 'student_id',
      key: 'student_id',
    },
    {
      title: 'Student Name',
      dataIndex: 'student_name',
      key: 'student_name',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => (
        <Tag
          icon={gender === 'male' ? <ManOutlined /> : <WomanOutlined />}
          color={gender === 'male' ? 'blue' : 'magenta'}
        >
          {gender.charAt(0).toUpperCase() + gender.slice(1)}
        </Tag>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <Button onClick={() => navigate('/admin/member')}>
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  if (!member) return null;

  const maleCount = member.students.filter(s => s.gender === 'male').length;
  const femaleCount = member.students.filter(s => s.gender === 'female').length;

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/admin/member')}
        >
          Back to Members
        </Button>
        <Title level={4} style={{ margin: 0 }}>Member Record Details</Title>
      </div>

      {/* Stats Cards */}
      <Row gutter={16} className="mb-4">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Students"
              value={member.students.length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Male Students"
              value={maleCount}
              prefix={<ManOutlined />}
              valueStyle={{ color: '#0958d9' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Female Students"
              value={femaleCount}
              prefix={<WomanOutlined />}
              valueStyle={{ color: '#c41d7f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Created On"
              value={new Date(member.createdAt).toLocaleDateString()}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#389e0d', fontSize: 16 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Member Info */}
      <Card title="Record Information" className="mb-4">
        <Descriptions bordered column={{ xs: 1, sm: 2, lg: 3 }}>
          <Descriptions.Item label="Club">
            <Tag color="geekblue" icon={<UserOutlined />}>
              {member.club?.name || 'N/A'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Class">
            <Text strong>{member.class_std}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Section">
            <Text strong>{member.section}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {new Date(member.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Last Updated">
            {new Date(member.updatedAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Divider />

      {/* Students Table */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <TeamOutlined />
            <span>Students ({member.students.length})</span>
          </div>
        }
        extra={
          <Button
            type="primary"
            onClick={() => navigate(`/admin/members/edit-member/${member._id}`)}
          >
            Edit Record
          </Button>
        }
      >
        <Table
          columns={studentColumns}
          dataSource={member.students.map((s) => ({ ...s, key: s.student_id }))}
          pagination={{ pageSize: 20, showSizeChanger: true }}
          bordered
          size="middle"
        />
      </Card>
    </div>
  );
};

export default ViewMember;
