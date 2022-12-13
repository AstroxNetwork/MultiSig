import { RootDispatch, RootState } from '@/store';
import {
  ProForm,
  ProFormGroup,
  ProFormInstance,
  ProFormList,
  ProFormText,
  StepsForm,
} from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-layout';
import { Controller } from '@/../../idls/ms_provider';
import { idlFactory as controllerIdl } from '../../../../idls/ms_controller.idl';
import { _SERVICE as controllerService } from '../../../../idls/ms_controller';
import { Button, message } from 'antd';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Principal } from '@dfinity/principal';
import { getActor, hasOwnProperty } from '@/utils';
import { useDispatch } from 'react-redux';
import { useConnect } from '@connect2ic/react';
import { useHistory } from 'react-router-dom';

const GroupCreate: React.FC = () => {
  const formRef = useRef<ProFormInstance>();
  const { initialState } = useSelector((state: RootState) => state.global);
  const loading = useSelector((state: RootState) => state.loading);
  const { activeController } = useSelector(
    (state: RootState) => state.controller,
  );
  const dispatch = useDispatch<RootDispatch>();
  const [createResp, setCreateResp] = useState<Controller>();
  const { activeProvider } = useConnect();
  const history = useHistory();
  console.log('controllerActor', activeController);
  return (
    <PageContainer ghost>
      <ProForm
        formRef={formRef}
        onFinish={async values => {
          await dispatch.controller.groupCreate({
            ...values,
            provider: activeProvider,
          });
          dispatch.app.queryGroups({});
          dispatch.btc.initBTCWallet({ provider: activeProvider });
          setTimeout(() => {
            history.replace('/group/setting?create=true');
          }, 100);
        }}
        // submitter={{
        //   submitButtonProps: (
        //     <Button
        //       type="primary"
        //       key="goToTree"
        //       loading={loading.models.controller}
        //     >
        //       Submit
        //     </Button>
        //   ),
        // }}
      >
        <ProFormText required width="sm" name="name" label="Groupname" />
        <ProForm.Group>
          <ProFormText
            required
            width="md"
            name="total_user_amount"
            label="Total"
            placeholder="Please enter"
          />
          <ProFormText
            required
            width="md"
            name="threshold_user_amount"
            label="Threshold"
            placeholder="Please enter"
          />
        </ProForm.Group>
      </ProForm>
    </PageContainer>
  );
};

export default GroupCreate;
