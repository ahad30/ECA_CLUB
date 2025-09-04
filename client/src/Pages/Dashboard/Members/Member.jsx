import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm, Card, Statistic, Select, Row, Col } from 'antd';
import { DeleteOutlined, EyeOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DashboardTable from '../../../components/Dashboard/Table/DashboardTable';
import { useMembers, useClubs, useClasses, useSections, useClubStats, useDeleteMember } from '../../../hooks/useApiData';

const { Option } = Select;

const Member = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    club: '',
    class_std: '',
    section: ''
  });
  const [filteredSections, setFilteredSections] = useState([]);

  // React Query hooks for data fetching with caching
  const { 
    data: members = [], 
    isLoading: membersLoading, 
    refetch: refetchMembers 
  } = useMembers(filters);

  const { data: clubs = [], isLoading: clubsLoading } = useClubs();
  const { data: classes = [], isLoading: classesLoading } = useClasses();
  const { data: sections = [], isLoading: sectionsLoading } = useSections();
  const { data: stats , isLoading: statsLoading } = useClubStats(filters.club);
  const deleteMemberMutation = useDeleteMember();


  useEffect(() => {
    refetchMembers()
  }, [filters, refetchMembers]);
  

  // Filter sections based on selected class
  useEffect(() => {
    if (filters.class_std) {
      const classSections = sections.filter(
        section => section.class_name === filters.class_std
      );
      setFilteredSections(classSections);
    } else {
      setFilteredSections(sections);
    }
  }, [filters.class_std, sections]);

  const handleDeleteMember = async (memberId) => {
    try {
      await deleteMemberMutation.mutateAsync(memberId);
      message.success('Member record deleted successfully');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to delete member');
    }
  };

  const handleFilterChange = (key, value) => {
    if (key === 'class_std') {
      setFilters(prev => ({ ...prev, [key]: value, section: '' }));
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const clearFilters = () => {
    setFilters({ club: '', class_std: '', section: '' });
  };

  // const handleManualRefresh = () => {
  //   refetchMembers();
  //   message.info('Data refreshed');
  // };

  const columns = [
    {
      title: 'Club Name',
      dataIndex: ['club', 'name'],
      key: 'clubName',
      render: (text, record) => record.club?.name || record.club_name || 'N/A'
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
      title: 'Total Students',
      key: 'total_students',
      render: (record) => record.students?.length || 0,
    },
    {
      title: 'Male Students',
      key: 'male_count',
      render: (record) => record.students?.filter(s => s.gender === 'male').length || 0,
    },
    {
      title: 'Female Students',
      key: 'female_count',
      render: (record) => record.students?.filter(s => s.gender === 'female').length || 0,
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
          <Popconfirm
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
              loading={deleteMemberMutation.isLoading}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filterOption = (input, option) => {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  const loading = membersLoading || clubsLoading || classesLoading || sectionsLoading;

  return (
    <div>
      <Card 
        title="Member Management" 
        style={{ marginBottom: 16 }}
      >
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
              loading={clubsLoading}
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
              loading={classesLoading}
            >
              {classes.map(cls => (
                <Option key={cls.id || cls.class_name} value={cls.class_name}>
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
              loading={sectionsLoading}
              disabled={!filters.class_std}
            >
              {filteredSections.map(sec => (
                <Option key={sec.id || sec.section_name} value={sec.section_name}>
                  {sec.section_name}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        <div className='flex flex-col sm:flex-row justify-end gap-2'>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/admin/members/add-member')}
            className="sm:mb-0"
          >
            Add Member Record
          </Button>

          {(filters.club || filters.class_std || filters.section) && (
            <Button onClick={clearFilters}>
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
                loading={statsLoading}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Card size="small">
              <Statistic 
                title="Male Students" 
                value={stats.total_male} 
                valueStyle={{ fontSize: '18px' }}
                loading={statsLoading}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Card size="small">
              <Statistic 
                title="Female Students" 
                value={stats.total_female} 
                valueStyle={{ fontSize: '18px' }}
                loading={statsLoading}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Card size="small">
              <Statistic 
                title="Members Records" 
                value={stats.total_members} 
                valueStyle={{ fontSize: '18px' }}
                loading={statsLoading}
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