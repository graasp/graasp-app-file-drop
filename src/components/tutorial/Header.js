import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import { IconButton, makeStyles, Tooltip } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import WarningIcon from '@material-ui/icons/Warning';
import { ReactComponent as Logo } from '../../resources/logo.svg';
import { TEACHER_MODES } from '../../config/settings';
import { AppDataContext } from '../context/AppDataContext';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  logo: {
    height: '48px',
    marginRight: theme.spacing.unit * 2,
  },
}));

const Header = () => {
  const { t } = useTranslation();
  const { mode, standalone, reFetch, setReFetch } = useContext(AppDataContext);
  const classes = useStyles();

  const handleRefresh = () => {
    setReFetch(!reFetch);
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

    if (TEACHER_MODES.includes(mode)) {
      return [
        <IconButton onClick={handleRefresh} key="refresh">
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
