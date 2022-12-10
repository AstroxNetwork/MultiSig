import { RootDispatch, RootState } from '@/store';
import { getActor, hasOwnProperty } from '@/utils';
import {
  ModalForm,
  PageContainer,
  ProForm,
  ProFormGroup,
  ProFormInstance,
  ProFormList,
  ProFormText,
} from '@ant-design/pro-components';
import { useConnect } from '@connect2ic/react';
import { idlFactory as controllerIdl } from '@/../../idls/ms_controller.idl';
import { _SERVICE as controllerService } from '@/../../idls/ms_controller';
import { Button, List, message, Tabs } from 'antd';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Principal } from '@dfinity/principal';
import { DeleteOutlined } from '@ant-design/icons';

type Users = Array<[Principal, string]>;
const GroupSetting = () => {
  const { activeProvider } = useConnect();
  const { activeController, activeControllerActor } = useSelector(
    (state: RootState) => state.controller,
  );
  const dispatch = useDispatch<RootDispatch>();
  const history = useHistory();
  const [users, setUsers] = useState<Users>();
  const [addVisable, setAddVisable] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const urlParams = new URLSearchParams(history.location.search);
  const formRef = useRef<ProFormInstance>();

  const initUsers =
    users && users?.length > 0
      ? users?.map(arr => ({
          name: arr[1],
          principal: arr[0].toText(),
        }))
      : new Array(activeController?.total_user_amount).fill({
          name: '',
          principal: '',
        });
  console.log('initUsers', initUsers, activeControllerActor);
  useEffect(() => {
    if (activeControllerActor) {
      getUsers();
      if (urlParams.get('create')) {
        createApp();
      }
    }
  }, [activeControllerActor]);

  const getUsers = async () => {
    try {
      const result = await activeControllerActor?.role_user_list();
      console.log('result', result);
      if (hasOwnProperty(result!, 'Ok')) {
        setUsers(result['Ok'] as Users);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const createApp = async () => {
    try {
      // console.log('createApp start');
      // console.log('activeProvider', activeProvider);
      // console.log('activeProvider', activeProvider);
      // const activeControllerActor = await getActor<controllerService>(
      //   activeProvider!,
      //   activeController?.id.toText()!,
      //   controllerIdl,
      // );
      // console.log(activeControllerActor);
      const result = await activeControllerActor?.app_main_create();
      console.log('createApp result', result);
    } catch (err) {
      console.log('err', err);
    }
  };

  return (
    <PageContainer ghost>
      <Tabs
        items={[
          {
            label: 'Setting',
            key: '1',
            children: (
              <>
                {users !== undefined ? (
                  <ProForm
                    initialValues={{
                      data: initUsers,
                    }}
                    onFinish={async values => {
                      console.log('step2', values);
                      await dispatch.controller.userAdd(values);
                      history.goBack();
                    }}
                    formRef={formRef}
                    title={'Owners and Confirmations'}
                  >
                    <ProFormList
                      alwaysShowItemLabel
                      min={1}
                      name="data"
                      max={activeController?.total_user_amount ?? 3}
                      // @ts-ignore
                      required
                      label=""
                      actionGuard={{
                        beforeRemoveRow: async index => {
                          const row = formRef.current?.getFieldValue('data');
                          console.log('index', index);
                          let promiseResp = 0;
                          console.log(row[index as number]);
                          try {
                            const result =
                              await activeControllerActor?.role_user_remove(
                                Principal.fromText(
                                  row[index as number].principal,
                                ),
                              );
                            if (result && hasOwnProperty(result, 'Ok')) {
                              getUsers();
                              promiseResp = 1;
                            } else {
                              promiseResp = 2;
                            }
                          } catch (err) {
                            console.log('err', err);
                            promiseResp = 2;
                          }
                          return new Promise(resolve => {
                            if (promiseResp === 1) {
                              resolve(true);
                            } else {
                              resolve(false);
                            }
                          });
                        },
                      }}
                    >
                      {(f, index, action) => {
                        console.log(f, index, action);
                        return (
                          <ProFormGroup>
                            <ProFormText
                              label="Nickname"
                              name="name"
                              required
                            />
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
                  </ProForm>
                ) : null}
              </>
            ),
          },
          {
            label: 'Edit',
            key: '2',
            children: (
              <>
                <List
                  dataSource={users}
                  renderItem={user => (
                    <List.Item
                      className="bg-gray-100"
                      extra={
                        <DeleteOutlined
                          onClick={async () => {
                            const result =
                              await activeControllerActor?.role_user_remove(
                                user[0],
                              );
                            if (result && hasOwnProperty(result, 'Ok')) {
                              getUsers();
                            } else {
                              message.error(result?.Err.msg);
                            }
                          }}
                        />
                      }
                    >
                      <List.Item.Meta
                        title={user[1]}
                        description={user[0].toText()}
                      />
                    </List.Item>
                  )}
                ></List>
                <Button
                  className="mt-10"
                  type="primary"
                  onClick={() => setAddVisable(true)}
                >
                  Add new user
                </Button>
              </>
            ),
          },
        ]}
      />
      <ModalForm
        open={addVisable}
        onFinish={async values => {
          try {
            setAddLoading(true);
            const result = await activeControllerActor?.batch_user_add([
              [Principal.fromText(values.principal), values.name],
            ]);
            if (result && hasOwnProperty(result, 'Ok')) {
              getUsers();
            }
            setAddLoading(false);
          } catch (err) {
            console.log('err', err);
            setAddLoading(false);
          }
        }}
        title="Add new user"
        width={500}
        modalProps={{
          onCancel: () => setAddVisable(false),
        }}
      >
        <p className="mb-3">Add a new user to the active group.</p>
        <ProFormText required label="Nickname" name="name" />
        <ProFormText required label="Principal ID" name="principal" />
      </ModalForm>
    </PageContainer>
  );
};

export default GroupSetting;
