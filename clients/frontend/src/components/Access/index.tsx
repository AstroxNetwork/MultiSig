// @ts-nocheck
// This file is generated by Umi automatically
// DO NOT CHANGE IT MANUALLY!
import { IRoute } from '@/routes/renderRoutes/renderRoutes';
import React, { PropsWithChildren } from 'react';
import { AccessContext, IAccessContext } from './context';

export const useAccess = (): IAccessContext => {
  return React.useContext(AccessContext);
};

export interface AccessProps {
  accessible: boolean;
  fallback?: React.ReactNode;
}
export const Access: React.FC<PropsWithChildren<AccessProps>> = (props) => {
  if (process.env.NODE_ENV === 'development' && typeof props.accessible !== 'boolean') {
    throw new Error('[access] the `accessible` property on <Access /> should be a boolean');
  }

  return <>{ props.accessible ? props.children : props.fallback }</>;
};

export const useAccessMarkedRoutes = (routes: IRoute[]) => {
  const access = useAccess();
  const markdedRoutes: IRoute[] = React.useMemo(() => {
    const process = (route, parentAccessCode) => {
      const accessCode = route.access || parentAccessCode;

      // set default status
      route.unaccessible = false;
      // check access code
      if (typeof accessCode === 'string') {
        const detector = access[accessCode];
        if (typeof detector === 'function') {
          route.unaccessible = !detector(route);
        } else if (typeof detector === 'boolean') {
          route.unaccessible = !detector;
        } else if (typeof detector === 'undefined') {
          route.unaccessible = true;
        }
      }

      // check children access code
      if (route.routes?.length) {
        const isNoAccessibleChild = !route.routes.reduce((hasAccessibleChild, child) => {
          process(child, accessCode);

          return hasAccessibleChild || !child.unaccessible;
        }, false);

        // make sure parent route is unaccessible if all children are unaccessible
        if (isNoAccessibleChild) {
          route.unaccessible = true;
        }
      }

      return route;
    }

    return routes.map(route => process(route));
  }, [routes.length, access]);

  return markdedRoutes;
}
