import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import { IconButton, makeStyles, Tooltip } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import WarningIcon from '@material-ui/icons/Warning';
import { ReactComponent as Logo } from '../../resources/logo.svg';
import { Context } from '../context/ContextContext';
import { PERMISSION_LEVELS } from '../../config/constants';
import { queryClient, HOOK_KEYS } from '../../config/queryClient';
import { HEADER_REFRESH_BUTTON_CYPRESS } from '../../config/selectors';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  logo: {
    height: '48px',
    marginRight: theme.spacing(2),
  },
}));

const Header = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const context = useContext(Context);
  const permission = context.get('permission');
  const standalone = context.get('standalone');

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

    if (
      [PERMISSION_LEVELS.WRITE, PERMISSION_LEVELS.ADMIN].includes(permission)
    ) {
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
          <Logo className={classes.logo} />
          <Typography variant="h6" color="inherit" className={classes.grow}>
            {t('File Drop')}
          </Typography>
          {renderViewButtons()}
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;
