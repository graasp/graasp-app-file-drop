import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import TableRow from '@material-ui/core/TableRow';
import Fab from '@material-ui/core/Fab';
import SettingsIcon from '@material-ui/icons/Settings';

import {
  DEFAULT_GET_REQUEST,
  APP_DATA_ENDPOINT,
  APP_ITEMS_ENDPOINT,
} from '../../config/api';
// import { GET_APP_INSTANCE_RESOURCES_SUCCEEDED } from '../../types';
// import { AppDataContext } from '../context/AppDataContext';
import Loader from '../common/Loader';
// import Uploader from './Uploader';
import FileUploader from './FileUploader';
import TeacherResource from './TeacherResource';
// import Settings from './Settings';
import SettingsButton from './SettingsButton';

import { AppDataContext } from '../context/AppDataContext';
import { PUBLIC_VISIBILITY } from '../../config/settings';
import { SettingsModalContext } from '../context/SettingsModalContext';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  main: {
    textAlign: 'center',
    padding: theme.spacing.unit,
  },
  button: {
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 700,
  },
  message: {
    padding: theme.spacing.unit,
    backgroundColor: theme.status.danger.background[500],
    color: theme.status.danger.color,
    marginBottom: theme.spacing.unit * 2,
  },
  fab: {
    margin: theme.spacing.unit,
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  teacherView: {
    marginBottom: '100px',
  },
}));

const getAppResources = async key => {
  const token = key.queryKey[1];
  const url = `http://localhost:3000/${APP_ITEMS_ENDPOINT}/86a0eed7-70c6-47ba-8584-00c898c0d134/${APP_DATA_ENDPOINT}`;

  const response = await fetch(url, {
    ...DEFAULT_GET_REQUEST,
    headers: {
      ...DEFAULT_GET_REQUEST.headers,
      Authorization: `Bearer ${token}`,
    },
  });
  const resources = await response.json();
  return resources;
};

const AppResources = () => {
  // eslint-disable-next-line no-unused-vars
  const {
    apiHost,
    appInstanceId,
    dev,
    itemId,
    lang,
    mode,
    offline,
    userId,
    view,
    token,
  } = useContext(AppDataContext);
  const classes = useStyles();
  const { openModal } = useContext(SettingsModalContext);

  const handleSettings = () => {
    openModal(itemId);
  };

  function checkToken() {
    let check;
    if (token == null) {
      check = false;
    } else {
      check = true;
    }
    return check;
  }

  const { data, status } = useQuery(['resources', token], getAppResources, {
    enabled: checkToken(),
  });

  return (
    <div>
      <div>
        <Grid container spacing={0}>
          <Grid item xs={12} className={classes.main}>
            <Grid item xs={12} className={classes.main}>
              <FileUploader visibility={PUBLIC_VISIBILITY} />
            </Grid>
            {status === 'loading' && <Loader />}
            {status === 'error' && <div>Error fetching data</div>}
            {status === 'success' && (
              <Paper className={classes.root}>
                <Table className={classes.table} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>File Name</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map(resource => (
                      <TeacherResource key={resource.id} resource={resource} />
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            )}
          </Grid>
        </Grid>
        <SettingsButton />
        <Fab
          color="primary"
          aria-label="Settings"
          className={classes.fab}
          onClick={handleSettings}
        >
          <SettingsIcon />
        </Fab>
      </div>
    </div>
  );
};
AppResources.contextType = AppDataContext;

export default AppResources;
