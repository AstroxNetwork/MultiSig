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
import { Controller } from '@/../../idls/ms_provider';
import { idlFactory as controllerIdl } from '../../../../idls/ms_controller.idl';
import { _SERVICE as controllerService } from '../../../../idls/ms_controller';
import { Button, message } from 'antd';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { CreateActorResult } from '@connect2ic/core';
import { Principal } from '@dfinity/principal';

const GroupCreate: React.FC = () => {
  const formRef = useRef<ProFormInstance>();
  const { initialState } = useSelector((state: RootState) => state.global);
  const [createResp, setCreateResp] = useState<Controller>();
  console.log('controllerActor', initialState?.controllerActor);
  console.log('providerActor', initialState?.providerActor);
  return (
    <PageContainer ghost>
      <StepsForm
        formRef={formRef}
        onFinish={async values => {
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
            try {
              console.log(values);
              console.log(initialState.providerActor);
              // const resp1 =
              //   await initialState.providerActor?.controller_main_get(
              //     Principal.fromText(initialState.currentUser?.principal!),
              //   );
              // console.log(resp1);
              const params = {
                ...values,
                total_user_amount: Number(values.total_user_amount),
                threshold_user_amount: Number(values.threshold_user_amount),
              };
              console.log('params', params);
              const resp =
                await initialState.providerActor?.controller_main_create(
                  params,
                );
              console.log(resp);
              setCreateResp(resp['Ok']);
              message.success('提交成功');
              return true;
            } catch (err) {
              console.log(err);
              return false;
            }
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
          onFinish={async values => {
            console.log('step2', values);
            if (initialState.currentUser) {
              const resp = (await initialState.currentUser.createActor(
                createResp?.id,
                controllerIdl,
              )) as CreateActorResult<controllerService>;
              const controllerActor = resp.isOk() ? resp.value : null;
              const params = values.data.map(
                (o: { name: any; principal: any }) => [
                  Principal.fromText(o.principal),
                  o.name,
                ],
              );
              const result = await controllerActor?.role_user_add(params);
              console.log('result', result);
              message.success('提交成功');
              return true;
            }
            return false;
          }}
          title={'Owners and Confirmations'}
        >
          <ProFormList
            alwaysShowItemLabel
            min={1}
            name="data"
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
