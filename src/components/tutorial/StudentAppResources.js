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

import {
  DEFAULT_GET_REQUEST,
  APP_DATA_ENDPOINT,
  APP_ITEMS_ENDPOINT,
} from '../../config/api';
import Loader from '../common/Loader';
import StudentResource from './StudentResource';
import { AppDataContext } from '../context/AppDataContext';
import FileDashboardUploader from '../main/FileDashboardUploader';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  main: {
    textAlign: 'center',
    padding: theme.spacing.unit,
  },
  table: {
    minWidth: 700,
  },
}));

const getAppResources = async key => {
  const apiHost = key.queryKey[1];
  const token = key.queryKey[2];
  const itemId = key.queryKey[3];
  const url = `${apiHost}/${APP_ITEMS_ENDPOINT}/${itemId}/${APP_DATA_ENDPOINT}`;

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
  const { apiHost, token, itemId, reFetch } = useContext(AppDataContext);
  const classes = useStyles();

  function checkToken() {
    if (token == null) {
      return false;
    }
    return true;
  }
  const check = checkToken();

  const { data, status } = useQuery(
    ['resources', apiHost, token, itemId, reFetch],
    getAppResources,
    { enabled: checkToken() },
  );

  return (
    <div>
      <div>
        <Grid container spacing={0}>
          <Grid item xs={12} className={classes.main}>
            <Grid item xs={12} className={classes.main}>
              {!checkToken() && <Loader />}
              {checkToken() && <FileDashboardUploader value={check} />}
            </Grid>
            {status === 'loading' && <Loader />}
            {status === 'error' && <div>Error fetching data</div>}
            {status === 'success' && (
              <Paper className={classes.root}>
                <Table className={classes.table} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>File Name</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map(resource => (
                      <StudentResource key={resource.id} resource={resource} />
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
AppResources.contextType = AppDataContext;

export default AppResources;
