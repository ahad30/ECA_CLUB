import { useState, useEffect } from 'react';
import {
  Card, Row, Col, Statistic, Table, Tag, Progress,
  Spin, Typography, Empty
} from 'antd';
import {
  TeamOutlined, UserOutlined, ManOutlined, WomanOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { clubAPI, memberAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [clubs, setClubs] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [clubsRes, membersRes] = await Promise.all([
        clubAPI.getClubs(),
        memberAPI.getMembers({}),
      ]);
      setClubs(clubsRes?.data?.data || []);
      setMembers(membersRes?.data?.data || []);
    } catch {
      // Silent failure - data just won't show
    } finally {
      setLoading(false);
    }
  };

  const totalStudents = members.reduce((sum, m) => sum + m.students.length, 0);
  const totalMale = members.reduce((sum, m) => sum + m.total_male_count, 0);
  const totalFemale = members.reduce((sum, m) => sum + m.total_female_count, 0);

  const clubStatsMap = members.reduce((acc, m) => {
    const clubId = m.club?._id;
    const clubName = m.club?.name || 'Unknown';
    if (!clubId) return acc;
    if (!acc[clubId]) {
      acc[clubId] = { name: clubName, students: 0, male: 0, female: 0, records: 0 };
    }
    acc[clubId].students += m.students.length;
    acc[clubId].male += m.total_male_count;
    acc[clubId].female += m.total_female_count;
    acc[clubId].records += 1;
    return acc;
  }, {});

  const clubStatsList = Object.values(clubStatsMap).sort((a, b) => b.students - a.students);

  const recentColumns = [
    {
      title: 'Club',
      dataIndex: ['club', 'name'],
      key: 'club',
      render: (_, record) => (
        <Tag color="geekblue">{record.club?.name || 'N/A'}</Tag>
      ),
    },
    {
      title: 'Class',
      dataIndex: 'class_std',
      key: 'class_std',
    },
    {
      title: 'Section',
      dataIndex: 'section',
      key: 'section',
    },
    {
      title: 'Students',
      key: 'students',
      render: (_, record) => (
        <span className="font-semibold">{record.students.length}</span>
      ),
    },
    {
      title: 'Male / Female',
      key: 'gender',
      render: (_, record) => (
        <span>
          <Tag color="blue" icon={<ManOutlined />}>{record.total_male_count}</Tag>
          <Tag color="magenta" icon={<WomanOutlined />}>{record.total_female_count}</Tag>
        </span>
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

  return (
    <div>
      <div className="mb-6 p-6 rounded-xl bg-gradient-to-r from-[#121C34] to-[#1b3a9a] text-white shadow-md">
        <Title level={3} style={{ color: '#fff', margin: 0 }}>
          Welcome back, {user?.username} 👋
        </Title>
        <Text style={{ color: '#cbd5e1' }}>
          Here&apos;s a summary of all ECA club activity.
        </Text>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            onClick={() => navigate('/admin/club')}
            className="cursor-pointer"
          >
            <Statistic
              title="Total Clubs"
              value={clubs.length}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            onClick={() => navigate('/admin/member')}
            className="cursor-pointer"
          >
            <Statistic
              title="Total Students Enrolled"
              value={totalStudents}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Male Students"
              value={totalMale}
              prefix={<ManOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Female Students"
              value={totalFemale}
              prefix={<WomanOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={10}>
          <Card title="Enrollment by Club" style={{ minHeight: 340 }}>
            {clubStatsList.length === 0 ? (
              <Empty description="No data yet" />
            ) : (
              clubStatsList.map(club => (
                <div key={club.name} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <Text strong>{club.name}</Text>
                    <Text type="secondary">
                      {club.students} students &nbsp;|&nbsp;
                      <span style={{ color: '#1677ff' }}>{club.male}M</span>
                      {' / '}
                      <span style={{ color: '#eb2f96' }}>{club.female}F</span>
                    </Text>
                  </div>
                  <Progress
                    percent={Math.round((club.students / 48) * 100)}
                    strokeColor={{
                      '0%': '#1677ff',
                      '100%': '#eb2f96',
                    }}
                    format={() => `${club.students}/48`}
                    size="small"
                  />
                </div>
              ))
            )}
          </Card>
        </Col>

        <Col xs={24} lg={14}>
          <Card
            title="Recent Member Records"
            extra={
              <a onClick={() => navigate('/admin/member')} style={{ cursor: 'pointer' }}>
                View All
              </a>
            }
          >
            <Table
              columns={recentColumns}
              dataSource={members
                .slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map(m => ({ ...m, key: m._id }))}
              pagination={false}
              size="small"
              bordered
              locale={{ emptyText: <Empty description="No records yet" /> }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
