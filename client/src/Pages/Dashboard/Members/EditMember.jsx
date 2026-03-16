import { useState, useEffect } from 'react';
import {
  Card, Form, Select, Button, message, List, Tag, Spin,
  Alert, Typography, Row, Col, Progress, Divider
} from 'antd';
import {
  ArrowLeftOutlined, DeleteOutlined, ManOutlined, WomanOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { memberAPI, clubAPI, eprAPI } from '../../../services/api';

const { Option } = Select;
const { Title, Text } = Typography;

const GENDER_QUOTA = 24;

const EditMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [error, setError] = useState('');

  const [member, setMember] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [allSections, setAllSections] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [clubStats, setClubStats] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  useEffect(() => {
    if (selectedClass) {
      const classSections = allSections.filter(s => s.class_name === selectedClass);
      setFilteredSections(classSections);
      setSelectedSection(null);
      form.setFieldsValue({ section: undefined });
      setFilteredStudents([]);
    } else {
      setFilteredSections([]);
    }
  }, [selectedClass, allSections, form]);

  useEffect(() => {
    if (selectedClass && selectedSection) {
      fetchStudents();
    } else {
      setFilteredStudents([]);
    }
  }, [selectedClass, selectedSection]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [memberRes, clubsRes, sectionsRes] = await Promise.all([
        memberAPI.getMember(id),
        clubAPI.getClubs(),
        eprAPI.getSections(),
      ]);

      const memberData = memberRes.data.data;
      setMember(memberData);
      setClubs(clubsRes?.data?.data || []);
      setAllSections(sectionsRes?.data?.message || []);
      setSelectedStudents(memberData.students);
      setSelectedClass(memberData.class_std);
      setSelectedSection(memberData.section);

      form.setFieldsValue({
        club: memberData.club?._id,
        class_std: memberData.class_std,
        section: memberData.section,
      });

      const statsRes = await memberAPI.getClubStats(memberData.club?._id);
      setClubStats(statsRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load member record');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    setStudentsLoading(true);
    try {
      const res = await eprAPI.getStudents();
      const students = res?.data?.message || [];
      setAllStudents(students);
      const filtered = students.filter(
        s => s.Class === selectedClass && s.section === selectedSection
      );
      setFilteredStudents(filtered);
    } catch {
      message.error('Failed to fetch students');
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleStudentSelect = (value) => {
    const student = allStudents.find(s => s.student_id === value);
    if (student && !selectedStudents.find(s => s.student_id === value)) {
      setSelectedStudents(prev => [...prev, {
        student_id: student.student_id,
        student_name: `${student.student_first_name} ${student.student_last_name}`,
        gender: student.gender.toLowerCase(),
      }]);
    }
  };

  const removeStudent = (studentId) => {
    setSelectedStudents(prev => prev.filter(s => s.student_id !== studentId));
  };

  const maleCount = selectedStudents.filter(s => s.gender === 'male').length;
  const femaleCount = selectedStudents.filter(s => s.gender === 'female').length;

  const handleSubmit = async (values) => {
    if (selectedStudents.length === 0) {
      message.error('Please select at least one student');
      return;
    }

    setSubmitLoading(true);
    try {
      const payload = {
        club: values.club,
        class_std: values.class_std,
        section: values.section,
        students: selectedStudents.map(s => ({
          student_id: s.student_id,
          student_name: s.student_name,
          gender: s.gender,
        })),
      };

      await memberAPI.updateMember(id, payload);
      message.success('Member record updated successfully');
      navigate('/admin/member');
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to update member record');
    } finally {
      setSubmitLoading(false);
    }
  };

  const filterOption = (input, option) =>
    option.children?.toString().toLowerCase().includes(input.toLowerCase());

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        action={<Button onClick={() => navigate('/admin/member')}>Go Back</Button>}
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/admin/member')}
        >
          Back to Members
        </Button>
        <Title level={4} style={{ margin: 0 }}>Edit Member Record</Title>
      </div>

      {/* Gender quota indicator */}
      <Row gutter={16} className="mb-4">
        <Col xs={24} sm={12}>
          <Card size="small" title="Male Quota">
            <Progress
              percent={Math.round((maleCount / GENDER_QUOTA) * 100)}
              status={maleCount >= GENDER_QUOTA ? 'exception' : 'active'}
              format={() => `${maleCount} / ${GENDER_QUOTA}`}
              strokeColor="#1677ff"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card size="small" title="Female Quota">
            <Progress
              percent={Math.round((femaleCount / GENDER_QUOTA) * 100)}
              status={femaleCount >= GENDER_QUOTA ? 'exception' : 'active'}
              format={() => `${femaleCount} / ${GENDER_QUOTA}`}
              strokeColor="#eb2f96"
            />
          </Card>
        </Col>
      </Row>

      <Card title="Edit Record Details">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="club"
                label="Club"
                rules={[{ required: true, message: 'Please select a club' }]}
              >
                <Select
                  placeholder="Select Club"
                  allowClear
                  showSearch
                  filterOption={filterOption}
                  disabled={submitLoading}
                >
                  {clubs.map(club => (
                    <Option key={club._id} value={club._id}>
                      {club.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="class_std"
                label="Class"
                rules={[{ required: true, message: 'Please enter class' }]}
              >
                <Select
                  placeholder="Select Class"
                  allowClear
                  showSearch
                  filterOption={filterOption}
                  onChange={setSelectedClass}
                  disabled={submitLoading}
                >
                  {[...new Set(allSections.map(s => s.class_name))].map(cls => (
                    <Option key={cls} value={cls}>{cls}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="section"
                label="Section"
                rules={[{ required: true, message: 'Please select a section' }]}
              >
                <Select
                  placeholder="Select Section"
                  allowClear
                  showSearch
                  filterOption={filterOption}
                  onChange={setSelectedSection}
                  disabled={!selectedClass || submitLoading}
                  notFoundContent={!selectedClass ? 'Select a class first' : 'No sections found'}
                >
                  {filteredSections.map(sec => (
                    <Option key={sec.id} value={sec.section_name}>
                      {sec.section_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {selectedClass && selectedSection && (
            <Form.Item label="Add More Students">
              <Select
                mode="multiple"
                placeholder="Search and select students to add"
                onSelect={handleStudentSelect}
                allowClear
                showSearch
                loading={studentsLoading}
                disabled={studentsLoading || submitLoading}
                filterOption={filterOption}
                notFoundContent={studentsLoading ? <Spin size="small" /> : 'No students found'}
                value={[]}
              >
                {filteredStudents
                  .filter(s => !selectedStudents.find(sel => sel.student_id === s.student_id))
                  .map(student => (
                    <Option key={student.student_id} value={student.student_id}>
                      {`${student.student_id} - ${student.student_first_name} ${student.student_last_name} (${student.gender})`}
                    </Option>
                  ))}
              </Select>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Showing {filteredStudents.length} students in {selectedClass}-{selectedSection}
              </Text>
            </Form.Item>
          )}

          <Divider />

          {selectedStudents.length > 0 && (
            <Form.Item label={`Selected Students (${selectedStudents.length})`}>
              <List
                size="small"
                bordered
                dataSource={selectedStudents}
                renderItem={student => (
                  <List.Item
                    actions={[
                      <Button
                        key="remove"
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
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
                        <Tag
                          icon={student.gender === 'male' ? <ManOutlined /> : <WomanOutlined />}
                          color={student.gender === 'male' ? 'blue' : 'magenta'}
                        >
                          {student.gender}
                        </Tag>
                      }
                    />
                  </List.Item>
                )}
              />
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitLoading}>
              Update Record
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
      </Card>
    </div>
  );
};

export default EditMember;
