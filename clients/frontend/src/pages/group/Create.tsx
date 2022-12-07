import { RootState } from '@/store';
import {
  ProForm,
  ProFormGroup,
  ProFormInstance,
  ProFormList,
  ProFormText,
  StepsForm,
} from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, message } from 'antd';
import { useRef } from 'react';
import { useSelector } from 'react-redux';

const GroupCreate: React.FC = () => {
  const formRef = useRef<ProFormInstance>();
  const { initialState } = useSelector((state: RootState) => state.global);
  console.log('controllerActor', initialState?.controllerActor);
  console.log('providerActor', initialState?.providerActor);
  return (
    <PageContainer ghost>
      <StepsForm
        formRef={formRef}
        onFinish={async values => {
          console.log(values);
          const val1 = await formRef.current?.validateFields();
          // const resp =
          // await initialState.providerActor?.controller_main_create();
          message.success('提交成功');
          return true;
        }}
        submitter={{
          render: props => {
            if (props.step === 0) {
              return (
                <Button type="primary" onClick={() => props.onSubmit?.()}>
                  Next
                </Button>
              );
            }
            if (props.step === 1) {
              return (
                <Button
                  type="primary"
                  key="goToTree"
                  onClick={() => props.onSubmit?.()}
                >
                  Submit
                </Button>
              );
            }
          },
        }}
      >
        <StepsForm.StepForm
          onFinish={async values => {
            console.log(values);
            const val1 = await formRef.current?.validateFields();
            // const resp =
            // await initialState.providerActor?.controller_main_create();
            message.success('提交成功');
            return true;
          }}
          title="Create group"
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
        </StepsForm.StepForm>
        <StepsForm.StepForm
          name="step2"
          onFinish={async () => {
            return true;
          }}
          title={'Owners and Confirmations'}
        >
          <ProFormList
            alwaysShowItemLabel
            min={1}
            name="datas"
            // @ts-ignore
            required
            label="Owners and Confirmations"
          >
            {() => {
              return (
                <ProFormGroup>
                  <ProFormText label="Nickname" name="name" required />
                  <ProFormText
                    label="Principal ID"
                    width={'md'}
                    name="principal"
                    required
                  />
                </ProFormGroup>
              );
            }}
          </ProFormList>
        </StepsForm.StepForm>
      </StepsForm>
    </PageContainer>
  );
};

export default GroupCreate;
