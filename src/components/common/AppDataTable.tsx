import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { ROW_NO_FILES_UPLOADED_ID } from '../../config/selectors';
import { useAppDataContext } from '../context/AppDataContext';
import { useMembersContext } from '../context/MembersContext';
import FileDashboardUploader from '../main/FileDashboardUploader';
import AppDataRow from './AppDataRow';
import AppDataToolbar from './AppDataToolbar';

interface AppDataTableProps {
  showMember: boolean;
}

const AppDataTable: FC<AppDataTableProps> = ({ showMember }) => {
  const { t } = useTranslation();
  const members = useMembersContext();
  const appData = useAppDataContext();

  return (
    <Grid container spacing={0}>
      <Grid item xs={12} p={1} textAlign="center">
        <Grid item xs={12} p={1} textAlign="center">
          <FileDashboardUploader />
        </Grid>
        <Paper sx={{ margin: 2, overflowX: 'auto' }}>
          <AppDataToolbar />
          <Table sx={{ minWidth: 700 }} size="small">
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
                      member={members.find(({ id }) => id === a.member.id)}
                    />
                  ))
              )}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AppDataTable;
