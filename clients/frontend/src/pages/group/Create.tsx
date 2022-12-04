import { ProForm, ProFormGroup, ProFormInstance, ProFormList, ProFormText } from "@ant-design/pro-components";
import { PageContainer } from "@ant-design/pro-layout";
import { message } from "antd";
import { useRef } from "react";

const GroupCreate: React.FC = () => {
  const formRef = useRef<ProFormInstance>()

  return (
    <PageContainer
      ghost
    >
       <ProForm<{
      name: string;
      company?: string;
      useMode?: string;
    }>
      onFinish={async (values) => {
        console.log(values);
        const val1 = await formRef.current?.validateFields();
        console.log('validateFields:', val1);
        const val2 = await formRef.current?.validateFieldsReturnFormatValue?.();
        console.log('validateFieldsReturnFormatValue:', val2);
        message.success('提交成功');
      }}
      formRef={formRef}
      params={{ id: '100' }}
      formKey="base-form-use-demo"
      // request={async () => {
      //   await waitTime(1500);
      //   return {
      //     name: '蚂蚁设计有限公司',
      //     useMode: 'chapter',
      //   };
      // }}
      autoFocusFirstInput
    >
      <ProFormText required width="sm" name="id" label="群组名称" />
      <ProForm.Group>
        {/* <ProFormText
          width="md"
          name="name"
          required
          dependencies={[['contract', 'name']]}
          addonBefore={<a>客户名称应该怎么获得？</a>}
          addonAfter={<a>点击查看更多</a>}
          label="签约客户名称"
          tooltip="最长为 24 位"
          placeholder="请输入名称"
          rules={[{ required: true, message: '这是必填项' }]}
        /> */}
        <ProFormText required width="md" name="company" label="人数" placeholder="请输入名称" />
        <ProFormText required width="md" name="company" label="阈值" placeholder="请输入名称" />
      </ProForm.Group>
      <ProFormList alwaysShowItemLabel name="datas" initialValue={[{ date: '2022-10-12 10:00:00' }]}>
        {() => {
          return (
            <ProFormGroup>
              <ProFormText
                label="昵称"
                name="name"
                required
              />
              <ProFormText
                label="Principal ID"
                name="name"
                required
              />
            </ProFormGroup>
          );
        }}
      </ProFormList>
    </ProForm>
    </PageContainer>
  )


}


export default GroupCreate;