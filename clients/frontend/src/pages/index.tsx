import { Access, useAccess } from '@/components/Access';
import { PoweroffOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Col, Row } from 'antd';
import { useHistory } from 'react-router-dom';
const HomePage: React.FC = () => {
  const history = useHistory()
  const create = () => {
    history.push('/group/create')
  }
  return (
    <PageContainer
      ghost
    >
      <Card title="Group management" bordered={false}>
        <Row>
          <Col span={12}>
            <h1>Create Group</h1>
            <p className='mb-2'>Create a new Safe that is controlled by one or multiple owners. You will be required to pay a network fee for creating your new Safe.</p>
            <Button type="primary" icon={<PoweroffOutlined />} onClick={create}>
              Create
            </Button>
          </Col>
          <Col span={12}>
            <h1>Join Group</h1>
            <p className='mb-2'>Create a new Safe that is controlled by one or multiple owners. You will be required to pay a network fee for creating your new Safe.</p>
            <Button type="default">Join</Button>
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

export default HomePage;
