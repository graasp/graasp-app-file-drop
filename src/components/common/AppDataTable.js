import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import TableRow from '@material-ui/core/TableRow';
import Loader from './Loader';
import FileDashboardUploader from '../main/FileDashboardUploader';
import { useAppContext, useAppData } from '../context/hooks';
import { useTranslation } from 'react-i18next';
import AppDataRow from './AppDataRow';
import { ROW_NO_FILES_UPLOADED_ID } from '../../config/selectors';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  main: {
    textAlign: 'center',
    padding: theme.spacing(1),
  },
  button: {
    marginTop: theme.spacing(3),
  },
  table: {
    minWidth: 700,
  },
  message: {
    padding: theme.spacing(1),
    backgroundColor: theme.status.danger.background[500],
    color: theme.status.danger.color,
    marginBottom: theme.spacing(2),
  },
}));

const AppDataTable = ({ showMember }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { data: appContext, isLoading: isAppContextLoading } = useAppContext();
  const members = appContext?.get('members');
  const { data: appData, isLoading, isSuccess, isError } = useAppData();

  if (isAppContextLoading || isLoading) {
    return <Loader />;
  }

  return (
    <Grid container spacing={0}>
      <Grid item xs={12} className={classes.main}>
        <Grid item xs={12} className={classes.main}>
          <FileDashboardUploader />
        </Grid>
        {isLoading && <Loader />}
        {isError && <div>{t('Error fetching data')}</div>}
        {isSuccess && (
          <Paper className={classes.root}>
            <Table className={classes.table} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('Date')}</TableCell>
                  {showMember && <TableCell>{t('User')}</TableCell>}
                  <TableCell>{t('File Name')}</TableCell>
                  <TableCell>{t('Actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appData.isEmpty() ? (
                  <TableRow>
                    <TableCell
                      id={ROW_NO_FILES_UPLOADED_ID}
                      colSpan={4}
                      align="center"
                    >
                      {t('No files have been uploaded.')}
                    </TableCell>
                  </TableRow>
                ) : (
                  appData
                    .sortBy(({ createdAt }) => createdAt)
                    .map((a) => (
                      <AppDataRow
                        key={a.id}
                        data={a}
                        showMember={showMember}
                        member={members.find(({ id }) => id === a.memberId)}
                      />
                    ))
                )}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

AppDataTable.propTypes = {
  showMember: PropTypes.bool.isRequired,
};

export default AppDataTable;
