import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Refresh from '@mui/icons-material/Refresh';
import Warning from '@mui/icons-material/Warning';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { useLocalContext } from '@graasp/apps-query-client';
import { PermissionLevel, PermissionLevelCompare } from '@graasp/sdk';

import { makeStyles } from 'tss-react/mui';

import { queryClient } from '../../config/queryClient';
import { HEADER_REFRESH_BUTTON_CYPRESS } from '../../config/selectors';

const useStyles = makeStyles()(() => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  logo: {
    height: '48px',
    marginRight: 2, // theme.spacing(2),
  },
}));

const Header: FC = () => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const context = useLocalContext();
  const { permission, standalone } = context;

  const handleRefresh = (): void => {
    queryClient.invalidateQueries();
  };

  const renderViewButtons = (): JSX.Element[] | JSX.Element | null => {
    if (standalone) {
      return (
        <Tooltip
          title={t('This is just a preview. No files will be uploaded.')}
        >
          <Warning color="secondary" />
        </Tooltip>
      );
    }

    const p = permission || PermissionLevel.Read;
    if (PermissionLevelCompare.gte(p, PermissionLevel.Write)) {
      return [
        <IconButton
          onClick={handleRefresh}
          key="refresh"
          data-cy={HEADER_REFRESH_BUTTON_CYPRESS}
          size="large"
        >
          <Refresh color="secondary" />
        </IconButton>,
      ];
    }
    return null;
  };
  return (
    <header>
      <AppBar position="static">
        <Toolbar>
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
