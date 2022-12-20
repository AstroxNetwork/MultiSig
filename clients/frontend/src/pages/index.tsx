import { Access, useAccess } from '@/components/Access';
import { PoweroffOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useConnect } from '@connect2ic/react';
import { Button, Card, Col, message, Row } from 'antd';
import { useHistory } from 'react-router-dom';
const HomePage: React.FC = () => {
  const history = useHistory();
  const { isConnected } = useConnect();
  const create = () => {
    if (isConnected) {
      history.push('/group/create');
    } else {
      message.error('Please connect the wallet first');
    }
  };
  return (
    <PageContainer ghost>
      <Card title="Create Group" bordered={false}>
        <Row>
          <Col span={12}>
            <p className="mb-2">
              Create a new group that is controlled by one or multiple owners.
              There is no network fee for creating your new group.
            </p>
            <Button type="primary" icon={<PoweroffOutlined />} onClick={create}>
              Create
            </Button>
          </Col>
          {/* <Col span={12}>
            <h1>Join Group</h1>
            <p className='mb-2'>Create a new Safe that is controlled by one or multiple owners. You will be required to pay a network fee for creating your new Safe.</p>
            <Button type="default">Join</Button>
          </Col> */}
        </Row>
      </Card>
    </PageContainer>
  );
};

export default HomePage;
