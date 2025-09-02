import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm, Card, Statistic, Select, Row, Col } from 'antd';
import { DeleteOutlined, EyeOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { memberAPI, clubAPI, eprAPI } from '../../../services/api';
import DashboardTable from '../../../components/Dashboard/Table/DashboardTable';

const { Option } = Select;

const Member = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    club: '',
    class_std: '',
    section: ''
  });
  const [filteredSections, setFilteredSections] = useState([]);

  useEffect(() => {
    fetchInitialData();
    fetchMembers();
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [filters]);

  useEffect(() => {
    // Filter sections based on selected class
    if (filters.class_std) {
      const classSections = sections.filter(
        section => section.class_name === filters.class_std
      );
      setFilteredSections(classSections);
    } else {
      setFilteredSections(sections);
    }
  }, [filters.class_std, sections]);

  const fetchInitialData = async () => {
    try {
      const [clubsRes, classesRes, sectionsRes] = await Promise.all([
        clubAPI.getClubs(),
        eprAPI.getClasses(),
        eprAPI.getSections()
      ]);
      
      setClubs(clubsRes?.data?.data || []);
      setClasses(classesRes?.data?.message || []);
      setSections(sectionsRes?.data?.message || []);
      setFilteredSections(sectionsRes?.data?.message || []);
    } catch (error) {
      console.log(error)
      message.error('Failed to fetch initial data');
    }
  };

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const params = {};
      
      // Use club ID for filtering instead of name
      if (filters.club) {
        const selectedClub = clubs.find(club => club._id === filters.club);
        if (selectedClub) {
          params.club = selectedClub._id;
        }
      }
      
      if (filters.class_std) params.class_std = filters.class_std;
      if (filters.section) params.section = filters.section;

      const response = await memberAPI.getMembers(params);
      setMembers(response.data.data || []);

      // Fetch stats if club filter is applied
      if (filters.club) {
        const statsRes = await memberAPI.getClubStats(filters.club);
        setStats(statsRes.data.data);
      } else {
        setStats(null);
      }
    } catch (error) {
      console.error('Failed to fetch members:', error);
      message.error('Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (memberId) => {
    try {
      await memberAPI.deleteMember(memberId);
      setMembers(members.filter(member => member._id !== memberId));
      message.success('Member record deleted successfully');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to delete member');
    }
  };

  const handleFilterChange = (key, value) => {
    if (key === 'class_std') {
      // When class changes, reset section filter
      setFilters(prev => ({ ...prev, [key]: value, section: '' }));
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const clearFilters = () => {
    setFilters({ club: '', class_std: '', section: '' });
  };

  const columns = [
    {
      title: 'Club Name',
      dataIndex: ['club', 'name'],
      key: 'clubName',
      // sorter: (a, b) => (a.club?.name || '').localeCompare(b.club?.name || ''),
      render: (text, record) => record.club?.name || 'N/A'
    },
    {
      title: 'Class',
      dataIndex: 'class_std',
      key: 'class_std',
      // sorter: (a, b) => a.class_std.localeCompare(b.class_std),
    },
    {
      title: 'Section',
      dataIndex: 'section',
      key: 'section',
      // sorter: (a, b) => a.section.localeCompare(b.section),
    },
    {
      title: 'Total Students',
      key: 'total_students',
      render: (record) => record.students.length,
      // sorter: (a, b) => a.students.length - b.students.length,
    },
    {
      title: 'Male Students',
      key: 'male_count',
      render: (record) => record.students.filter(s => s.gender === 'male').length,
    },
    {
      title: 'Female Students',
      key: 'female_count',
      render: (record) => record.students.filter(s => s.gender === 'female').length,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/members/view-member/${record._id}`)}
            style={{ padding: 0 }}
          >
            View
          </Button>
          {/* <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/members/edit-member/${record._id}`)}
            style={{ padding: 0 }}
          >
            Edit
          </Button> */}
          {/* <Popconfirm
            title="Delete Member Record"
            description="Are you sure you want to delete this member record?"
            onConfirm={() => handleDeleteMember(record._id)}
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
          </Popconfirm> */}
        </Space>
      ),
    },
  ];

  const filterOption = (input, option) => {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  return (
<div>
  <Card title="Member Management" style={{ marginBottom: 16 }}>
    {/* Responsive filter row */}
    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
      <Col xs={24} sm={12} md={8} lg={8}>
        <Select
          placeholder="Filter by Club"
          value={filters.club || undefined}
          onChange={(value) => handleFilterChange('club', value)}
          style={{ width: '100%' }}
          allowClear
          showSearch
          filterOption={filterOption}
          loading={loading}
        >
          {clubs.map(club => (
            <Option key={club._id} value={club._id}>
              {club.name}
            </Option>
          ))}
        </Select>
      </Col>
      <Col xs={24} sm={12} md={8} lg={8}>
        <Select
          placeholder="Filter by Class"
          value={filters.class_std || undefined}
          onChange={(value) => handleFilterChange('class_std', value)}
          style={{ width: '100%' }}
          allowClear
          showSearch
          filterOption={filterOption}
          loading={loading}
        >
          {classes.map(cls => (
            <Option key={cls.id} value={cls.class_name}>
              {cls.class_name}
            </Option>
          ))}
        </Select>
      </Col>
      <Col xs={24} sm={12} md={8} lg={8}>
        <Select
          placeholder="Filter by Section"
          value={filters.section || undefined}
          onChange={(value) => handleFilterChange('section', value)}
          style={{ width: '100%' }}
          allowClear
          showSearch
          filterOption={filterOption}
          loading={loading}
          disabled={!filters.class_std}
        >
          {filteredSections.map(sec => (
            <Option key={sec.id} value={sec.section_name}>
              {sec.section_name}
            </Option>
          ))}
        </Select>
      </Col>
    </Row>

    {/* Responsive button group */}
    <div className='flex flex-col sm:flex-row justify-end gap-2'>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => navigate('/admin/members/add-member')}
        style={{ marginBottom: 8 }}
        className="sm:mb-0"
      >
        Add Member Record
      </Button>

      {(filters.club || filters.class_std || filters.section) && (
        <Button 
          onClick={clearFilters} 
          style={{ marginLeft: 0 }}
          className="sm:ml-2"
        >
          Clear Filters
        </Button>
      )}
    </div>
  </Card>

  {stats && (
    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
      <Col xs={12} sm={12} md={6} lg={6}>
        <Card size="small">
          <Statistic 
            title="Total Students" 
            value={stats.total_students} 
            valueStyle={{ fontSize: '18px' }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={12} md={6} lg={6}>
        <Card size="small">
          <Statistic 
            title="Male Students" 
            value={stats.total_male} 
            valueStyle={{ fontSize: '18px' }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={12} md={6} lg={6}>
        <Card size="small">
          <Statistic 
            title="Female Students" 
            value={stats.total_female} 
            valueStyle={{ fontSize: '18px' }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={12} md={6} lg={6}>
        <Card size="small">
          <Statistic 
            title="Members Records" 
            value={stats.total_members} 
            valueStyle={{ fontSize: '18px' }}
          />
        </Card>
      </Col>
    </Row>
  )}

  <DashboardTable
    columns={columns}
    data={members.map(member => ({ ...member, key: member._id }))}
    loading={loading}
  />
</div>
  );
};

export default Member;