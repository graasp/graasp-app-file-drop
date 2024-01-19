import React, { FC } from 'react';

import { useLocalContext } from '@graasp/apps-query-client';
import { PermissionLevel } from '@graasp/sdk';

import AppDataTable from '../common/AppDataTable';
import Settings from '../common/Settings';
import Header from '../layout/Header';

const BuilderView: FC = () => {
  const context = useLocalContext();
  switch (context.permission) {
    case PermissionLevel.Admin:
    case PermissionLevel.Write:
      return (
        <>
          <Header />
          <AppDataTable showMember />
          <Settings />
        </>
      );

    case PermissionLevel.Read:
    default:
      return (
        <>
          <Header />
          <AppDataTable showMember={false} />
        </>
      );
  }
};

export default BuilderView;
