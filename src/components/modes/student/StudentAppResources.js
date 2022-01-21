import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import TableRow from '@material-ui/core/TableRow';
import Loader from '../../common/Loader';
import StudentResource from './StudentResource';
import { AppDataContext } from '../../context/AppDataContext';
import FileDashboardUploader from '../../main/FileDashboardUploader';
import { useGetAppResources } from '../../../api/hooks';

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

const AppResources = () => {
  const { apiHost, token, itemId, reFetch } = useContext(AppDataContext);
  const classes = useStyles();

  let check = false;
  if (token) {
    check = true;
  }

  const { data, status } = useGetAppResources(token, apiHost, itemId, reFetch);

  return (
    <div>
      <div>
        <Grid container spacing={0}>
          <Grid item xs={12} className={classes.main}>
            <Grid item xs={12} className={classes.main}>
              <FileDashboardUploader value={check} />
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
                    {!data.length ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          No files have been uploaded.
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.map(resource => (
                        <StudentResource
                          key={resource.id}
                          resource={resource}
                        />
                      ))
                    )}
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
