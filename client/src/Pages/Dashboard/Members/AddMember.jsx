import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Card, message, Row, Col, List, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { memberAPI, clubAPI, eprAPI } from '../../../services/api';

const { Option } = Select;
const { TextArea } = Input;

const AddMember = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [clubsRes, classesRes, sectionsRes, studentsRes] = await Promise.all([
        clubAPI.getClubs(),
        eprAPI.getClasses(),
        eprAPI.getSections(),
        eprAPI.getStudents()
      ]);
      
      setClubs(clubsRes?.data?.data);
      setClasses(classesRes?.data?.message);
      setSections(sectionsRes?.data?.message);
      setStudents(studentsRes?.data?.message);
    } catch (error) {
      message.error('Failed to fetch initial data');
    }
  };

  const handleClassChange = (value) => {
    form.setFieldsValue({ section: undefined });
    filterAvailableStudents();
  };

  const handleSectionChange = (value) => {
    filterAvailableStudents();
  };

  const handleClubChange = async (clubId) => {
    if (!clubId) return;
    
    try {
      // Filter students based on selected club eligibility
      filterAvailableStudents();
    } catch (error) {
      message.error('Failed to check student eligibility');
    }
  };

  const filterAvailableStudents = () => {
    const formValues = form.getFieldsValue();
    const { class_std, section, club } = formValues;

    if (!class_std || !section) {
      setAvailableStudents([]);
      return;
    }

    const filtered = students.filter(student => 
      student.Class === class_std && 
      student.section === section
    );

    setAvailableStudents(filtered);
  };

  const handleStudentSelect = (studentId) => {
    const student = students.find(s => s.student_id === studentId);
    if (student && !selectedStudents.find(s => s.student_id === studentId)) {
      setSelectedStudents(prev => [...prev, {
        student_id: student.student_id,
        student_name: `${student.student_first_name} ${student.student_last_name}`,
        gender: student.gender.toLowerCase()
      }]);
    }
  };

  const removeStudent = (studentId) => {
    setSelectedStudents(prev => prev.filter(s => s.student_id !== studentId));
  };

  const handleSubmit = async (values) => {
    if (selectedStudents.length === 0) {
      message.error('Please select at least one student');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...values,
        students: selectedStudents
      };

      await memberAPI.createMember(payload);
      message.success('Member record created successfully');
      navigate('/members');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to create member record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Add Member Record">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: 800 }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="club"
              label="Club"
              rules={[{ required: true, message: 'Please select a club' }]}
            >
              <Select
                placeholder="Select Club"
                onChange={handleClubChange}
                allowClear
              >
                {clubs.map(club => (
                  <Option key={club._id} value={club._id}>
                    {club.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="club_name"
              label="Club Name (Display)"
              rules={[{ required: true, message: 'Please enter club name' }]}
            >
              <Input placeholder="Enter club display name" />
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
                onChange={handleClassChange}
                allowClear
              >
                {classes.map(cls => (
                  <Option key={cls.class_name} value={cls.class_name}>
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
                onChange={handleSectionChange}
                allowClear
              >
                {sections.map(sec => (
                  <Option key={sec.section_name} value={sec.section_name}>
                    {sec.section_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Add Students">
          <Select
            placeholder="Select students to add"
            onSelect={handleStudentSelect}
            allowClear
          >
            {availableStudents.map(student => (
              <Option key={student.student_id} value={student.student_id}>
                {`${student.student_id} - ${student.student_first_name} ${student.student_last_name} (${student.gender})`}
              </Option>
            ))}
          </Select>
        </Form.Item>

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
                    >
                      Remove
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={`${student.student_name} (${student.student_id})`}
                    description={
                      <Tag color={student.gender === 'male' ? 'blue' : 'pink'}>
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
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Member Record
          </Button>
          <Button onClick={() => navigate('/members')} style={{ marginLeft: 8 }}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddMember;