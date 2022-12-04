import { RootState } from '@/store';
import React from 'react';
import { useSelector } from 'react-redux';

import { AccessContext } from './context';

export function accessFactory(initialState: { user: API.User | null }) {
  const { user } = initialState || {};
  return {
    canAdmin: !!(user && user.status),
    // canAudit: !!(user && user.is_app_auditer),
    // canDeveloper: !!(user && user.is_app_developer)
  };
}

export function AccessProvider(props: any) {
  const user = useSelector((state: RootState) => state.global.user);
  const access = React.useMemo(() => accessFactory({user}), [user]);

  return (
    <AccessContext.Provider value={access}>
      {props.children}
    </AccessContext.Provider>
  );
}
