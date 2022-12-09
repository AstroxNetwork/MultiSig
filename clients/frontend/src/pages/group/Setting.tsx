import { RootDispatch, RootState } from '@/store';
import { getActor, hasOwnProperty } from '@/utils';
import {
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
import { Button, List } from 'antd';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Principal } from '@dfinity/principal';

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
            label="Owners and Confirmations"
            actionGuard={{
              beforeRemoveRow: async index => {
                const row = formRef.current?.getFieldValue('data');
                console.log('index', index);
                let promiseResp = 0;
                console.log(row[index as number]);
                try {
                  const result = await activeControllerActor?.role_user_remove(
                    Principal.fromText(row[index as number].principal),
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
