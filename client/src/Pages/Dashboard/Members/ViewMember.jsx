import React, { useState, useEffect } from 'react';
import { Card, Row, Col, List, Tag, Spin, Descriptions, Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { memberAPI} from '../../../services/api';
import { ArrowLeftOutlined } from '@ant-design/icons';

const ViewMember = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [memberData, setMemberData] = useState(null);


  useEffect(() => {
    fetchMemberDetails();
  }, [id]);

  const fetchMemberDetails = async () => {
    try {
      setLoading(true);
      const response = await memberAPI.getMember(id);
      setMemberData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch member details:', error);
    } finally {
      setLoading(false);
    }
  };

 

  


  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!memberData) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h3>Member record not found</h3>
          <Button type="primary" onClick={() => navigate('/admin/member')}>
            Back to Members
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <section>
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/admin/member')}
              style={{ marginRight: '16px' }}
            >
              Back
            </Button>
            Member Record Details
          </div>
        }
      >
        <Descriptions bordered column={1} style={{ marginBottom: '24px' }}>
          <Descriptions.Item label="Club">
            {memberData.club.name}
          </Descriptions.Item>
          <Descriptions.Item label="Class">
            {memberData.class_std}
          </Descriptions.Item>
          <Descriptions.Item label="Section">
            {memberData.section}
          </Descriptions.Item>
          <Descriptions.Item label="Total Students">
            <Tag color="blue">{memberData.students.length}</Tag>
          </Descriptions.Item>
        </Descriptions>

        <Card title="Student List" size="small">
          <List
            dataSource={memberData.students}
            renderItem={(student) => (
              <List.Item>
                <List.Item.Meta
                  title={`${student.student_name} (ID: ${student.student_id})`}
                  description={
                    <div>
                      <Tag color={student.gender === 'male' ? 'blue' : 'pink'}>
                        {student.gender}
                      </Tag>
                      <Tag color="green">{memberData.class_std}-{memberData.section}</Tag>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>

        <Row style={{ marginTop: '24px' }}>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Button 
              type="primary" 
              onClick={() => navigate('/admin/member')}
            >
              Back to Members List
            </Button>
          </Col>
        </Row>
      </Card>
    </section>
  );
};

export default ViewMember;