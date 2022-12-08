import { RootDispatch, RootState } from '@/store';
import { getActor, hasOwnProperty } from '@/utils';
import {
  PageContainer,
  ProForm,
  ProFormGroup,
  ProFormList,
  ProFormText,
} from '@ant-design/pro-components';
import { useConnect } from '@connect2ic/react';
import { idlFactory as controllerIdl } from '@/../../idls/ms_controller.idl';
import { Button, List } from 'antd';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Principal } from '@dfinity/principal';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

type Users = Array<[Principal, string]>;
const GroupSetting = () => {
  const { activeProvider } = useConnect();
  const { activeController, activeControllerActor } = useSelector(
    (state: RootState) => state.controller,
  );
  const dispatch = useDispatch<RootDispatch>();
  const history = useHistory();
  const [users, setUsers] = useState<Users>();
  const urlParams = new URLSearchParams(history.location.search);

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
    getUsers();
    if (urlParams.get('create')) {
      createApp();
    }
  }, []);

  const getUsers = async () => {
    try {
      const result = await activeControllerActor?.user_list();
      console.log('result', result);
      if (hasOwnProperty(result!, 'Ok')) {
        setUsers(result['Ok'] as Users);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const createApp = async () => {
    const result = await activeControllerActor?.app_main_create();
    console.log('createApp result', result);
  };

  return (
    <PageContainer ghost>
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
          title={'Owners and Confirmations'}
        >
          <ProFormList
            alwaysShowItemLabel
            min={1}
            name="data"
            max={activeController?.total_user_amount ?? 3}
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
        </ProForm>
      ) : null}
    </PageContainer>
  );
};

export default GroupSetting;
