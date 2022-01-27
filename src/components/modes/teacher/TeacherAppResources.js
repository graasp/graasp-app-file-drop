import React, { useContext } from 'react';
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
import { AppDataContext } from '../../context/AppDataContext';
import Loader from '../../common/Loader';
import TeacherResource from './TeacherResource';
import SettingsButton from '../../common/SettingsButton';
import { SettingsModalContext } from '../../context/SettingsModalContext';
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

const AppResources = () => {
  const { apiHost, itemId, token, reFetch } = useContext(AppDataContext);
  const classes = useStyles();
  const { openModal } = useContext(SettingsModalContext);

  const handleSettings = () => {
    openModal(itemId);
  };

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
                      <TableCell>User</TableCell>
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
                        <TeacherResource
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
