import React, { FC } from 'react';

import { useLocalContext } from '@graasp/apps-query-client';
import { PermissionLevel } from '@graasp/sdk';

import AppDataTable from '../common/AppDataTable';
import Header from '../layout/Header';

const PlayerView: FC = () => {
  const context = useLocalContext();
  const { standalone } = context;
  const header = standalone ? <Header /> : null;
  switch (context.get('permission')) {
    case PermissionLevel.Admin:
    case PermissionLevel.Write:
      return (
        <>
          {header}
          <AppDataTable showMember />
        </>
      );
    case PermissionLevel.Read:
    default:
      return (
        <>
          {header}
          <AppDataTable showMember={false} />
        </>
      );
  }
};

export default PlayerView;
