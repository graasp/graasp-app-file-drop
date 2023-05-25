import Header from '../layout/Header';
import AppDataTable from '../common/AppDataTable';
import { useLocalContext } from '@graasp/apps-query-client';
import { PermissionLevel } from '@graasp/sdk';
import { hooks } from '../../config/queryClient';
import { APP_SETTINGS } from '../../config/constants';

const PlayerView = () => {
  const context = useLocalContext();
  const standalone = context?.standalone;

  const { data: settings } = hooks.useAppSettings();
  const headerVisible = settings?.find(
    ({ name }) => name === APP_SETTINGS.HEADER_VISIBLE,
  );

  const header = headerVisible?.data || standalone ? <Header /> : null;
  switch (context?.permission) {
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
