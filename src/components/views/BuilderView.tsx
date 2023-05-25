import Header from '../layout/Header';
import AppDataTable from '../common/AppDataTable';
import Settings from '../common/Settings';
import { useLocalContext } from '@graasp/apps-query-client';
import { PermissionLevel } from '@graasp/sdk';

const BuilderView = () => {
  const context = useLocalContext();
  switch (context?.permission) {
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
