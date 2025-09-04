import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Card, Row, Col, List, Tag, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useClubs, useClasses, useSections, useStudents, useCreateMember } from '../../../hooks/useApiData';

const { Option } = Select;
const { TextArea } = Input;

const AddMember = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [filteredSections, setFilteredSections] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
    const [loading, setLoading] = useState(false);

  // React Query hooks for data fetching with caching
  const { data: clubs = [], isLoading: clubsLoading } = useClubs();
  const { data: classes = [], isLoading: classesLoading } = useClasses();
  const { data: allSections = [], isLoading: sectionsLoading } = useSections();
  const { data: allStudents = [], isLoading: studentsLoading } = useStudents();
  const createMemberMutation = useCreateMember();

  useEffect(() => {
    if (selectedClass) {
      // Filter sections based on selected class
      const classSections = allSections.filter(
        section => section.class_name === selectedClass
      );
      setFilteredSections(classSections);
      
      // Reset section selection when class changes
      setSelectedSection(null);
      form.setFieldsValue({ section: undefined });
      setFilteredStudents([]);
    } else {
      setFilteredSections([]);
    }
  }, [selectedClass, allSections, form]);

  useEffect(() => {
    if (selectedClass && selectedSection) {
      // Filter students based on selected class and section
      const filtered = allStudents.filter(
        student => student.Class === selectedClass && student.section === selectedSection
      );
      setFilteredStudents(filtered || []);
    } else {
      setFilteredStudents([]);
    }
  }, [selectedClass, selectedSection, allStudents]);

  const handleClassChange = (value) => {
    setSelectedClass(value);
  };

  const handleSectionChange = (value) => {
    setSelectedSection(value);
  };

  const handleStudentSelect = (value) => {
    const student = allStudents.find(s => s.student_id === value);
    if (student && !selectedStudents.find(s => s.student_id === value)) {
      setSelectedStudents(prev => [...prev, {
        student_id: student.student_id,
        student_name: `${student.student_first_name} ${student.student_last_name}`,
        gender: student.gender.toLowerCase(),
        class: selectedClass,
        section: selectedSection
      }]);
    }
  };

  const removeStudent = (studentId) => {
    setSelectedStudents(prev => prev.filter(s => s.student_id !== studentId));
  };

  const handleSubmit = async (values) => {
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student');
      return;
    }
    setLoading(true);

    try {
      // Find the club object to get the _id
      const selectedClub = clubs.find(club => club.name === values.club);
      
      if (!selectedClub) {
        toast.error('Selected club not found');
        return;
      }

      // Prepare the payload according to API requirements
      const payload = {
        club: selectedClub._id,
        club_name: selectedClub.name, // Add club_name to payload
        class_std: values.class_std,
        section: values.section,
        students: selectedStudents.map(student => ({
          student_id: student.student_id,
          student_name: student.student_name,
          gender: student.gender
        }))
      };

      console.log('Submitting payload:', payload);
      
      await createMemberMutation.mutateAsync(payload);
      
      toast.success('Member record created successfully');
      navigate('/admin/member');
    } catch (error) {
      console.error('API error:', error);
      toast.error(error.response?.data?.message || 'Failed to create member record');
    } finally {
      setLoading(false);
    }
  };

  const filterOption = (input, option) => {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  const submitLoading = createMemberMutation.isLoading;

  return (
    <Card title="Add Member Record">
      <div className='w-full lg:max-w-5xl mx-auto'>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ maxWidth: 800 }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="club"
                label="Club"
                rules={[{ required: true, message: 'Please select a club' }]}
              >
                <Select
                  placeholder="Select Club"
                  allowClear
                  showSearch
                  loading={clubsLoading}
                  disabled={clubsLoading || submitLoading}
                  filterOption={filterOption}
                  notFoundContent={clubsLoading ? <Spin size="small" /> : "No clubs found"}
                >
                  {clubs.map(club => (
                    <Option key={club._id} value={club.name}>
                      {club.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="class_std"
                label="Class"
                rules={[{ required: true, message: 'Please select a class' }]}
              >
                <Select
                  placeholder="Select Class"
                  allowClear
                  showSearch
                  loading={classesLoading}
                  disabled={classesLoading || submitLoading}
                  filterOption={filterOption}
                  onChange={handleClassChange}
                  notFoundContent={classesLoading ? <Spin size="small" /> : "No classes found"}
                >
                  {classes.map(cls => (
                    <Option key={cls.id || cls.class_name} value={cls.class_name}>
                      {cls.class_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="section"
                label="Section"
                rules={[{ required: true, message: 'Please select a section' }]}
              >
                <Select
                  placeholder="Select Section"
                  allowClear
                  showSearch
                  loading={sectionsLoading}
                  disabled={sectionsLoading || submitLoading || !selectedClass}
                  filterOption={filterOption}
                  onChange={handleSectionChange}
                  notFoundContent={
                    !selectedClass 
                      ? "Please select a class first" 
                      : sectionsLoading 
                        ? <Spin size="small" /> 
                        : "No sections found for this class"
                  }
                >
                  {filteredSections.map(sec => (
                    <Option key={sec.id || sec.section_name} value={sec.section_name}>
                      {sec.section_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {selectedClass && selectedSection && (
            <Form.Item label="Add Students">
              <Select
                mode='multiple'
                placeholder="Select students to add"
                onSelect={handleStudentSelect}
                allowClear
                showSearch
                loading={studentsLoading}
                disabled={studentsLoading || submitLoading}
                filterOption={filterOption}
                notFoundContent={studentsLoading ? <Spin size="small" /> : "No students found"}
              >
                {filteredStudents.map(student => (
                  <Option key={student.student_id} value={student.student_id}>
                    {`${student.student_id} - ${student.student_first_name} ${student.student_last_name} (${student.gender})`}
                  </Option>
                ))}
              </Select>
              <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
                Showing {filteredStudents.length} students in {selectedClass}-{selectedSection}
              </div>
            </Form.Item>
          )}

          {selectedStudents.length > 0 && (
            <Form.Item label="Selected Students">
              <List
                size="small"
                dataSource={selectedStudents}
                renderItem={student => (
                  <List.Item
                    actions={[
                      <Button
                        type="link"
                        danger
                        onClick={() => removeStudent(student.student_id)}
                        disabled={submitLoading}
                      >
                        Remove
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={`${student.student_name} (${student.student_id})`}
                      description={
                        <div>
                          <Tag color={student.gender === 'male' ? 'blue' : 'pink'}>
                            {student.gender}
                          </Tag>
                          <Tag color="green">{student.class}-{student.section}</Tag>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Form.Item>
          )}

          <Form.Item>
            <Button 
              style={{ marginBottom: 8 }} 
              type="primary" 
              htmlType="submit" 
              loading={submitLoading || loading}
            >
              Create Member Record
            </Button>
            <Button 
              onClick={() => navigate('/admin/member')} 
              style={{ marginLeft: 8 }}
              disabled={submitLoading}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Card>
  );
};

export default AddMember;