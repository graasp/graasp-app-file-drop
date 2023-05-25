import { useTranslation } from 'react-i18next';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import { IconButton, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import WarningIcon from '@mui/icons-material/Warning';
import { queryClient, HOOK_KEYS } from '../../config/queryClient';
import { HEADER_REFRESH_BUTTON_CYPRESS } from '../../config/selectors';
import { useLocalContext } from '@graasp/apps-query-client';
import { GraaspLogo } from '@graasp/ui';
import { PermissionLevel } from '@graasp/sdk';

const Header = () => {
  const { t } = useTranslation();
  const context = useLocalContext();
  const permission = context.permission ?? PermissionLevel.Read;
  const standalone = context.standalone;

  const handleRefresh = () => {
    const itemId = context.get('itemId');
    queryClient.invalidateQueries(HOOK_KEYS.buildAppDataKey(itemId));
    queryClient.invalidateQueries(HOOK_KEYS.buildAppContextKey(itemId));
  };

  const renderViewButtons = () => {
    if (standalone) {
      return (
        <Tooltip
          title={t('This is just a preview. No files will be uploaded.')}
        >
          <WarningIcon color="secondary" />
        </Tooltip>
      );
    }

    if ([PermissionLevel.Write, PermissionLevel.Admin].includes(permission)) {
      return [
        <IconButton
          onClick={handleRefresh}
          key="refresh"
          data-cy={HEADER_REFRESH_BUTTON_CYPRESS}
        >
          <RefreshIcon color="secondary" />
        </IconButton>,
      ];
    }
    return null;
  };
  return (
    <header>
      <AppBar position="static">
        <Toolbar>
          <GraaspLogo height={40} sx={{ fill: 'white' }} />
          <Typography
            variant="h6"
            color="inherit"
            sx={{ marginLeft: 1, flexGrow: 1 }}
          >
            {t('File Drop')}
          </Typography>
          {renderViewButtons()}
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;
