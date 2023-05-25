import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import FileDashboardUploader from '../main/FileDashboardUploader';
import { useTranslation } from 'react-i18next';
import AppDataRow from './AppDataRow';
import { hooks } from '../../config/queryClient';
import { ROW_NO_FILES_UPLOADED_ID } from '../../config/selectors';
import { useLocalContext } from '@graasp/apps-query-client';
import Alert from '@mui/material/Alert';
import { Loader } from '@graasp/ui';

const { useAppData } = hooks;

type Props = {
  showMember?: boolean;
};

const AppDataTable = ({ showMember = false }: Props) => {
  const { t } = useTranslation();
  const { memberId } = useLocalContext();
  const { data: appData, isLoading, isSuccess, isError } = useAppData();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Grid container spacing={0}>
      <Grid
        item
        xs={12}
        sx={{
          textAlign: 'center',
          padding: 1,
        }}
      >
        {!memberId && (
          <Alert severity="error">
            {t('You are not authenticated and cannot use this app')}
          </Alert>
        )}
        <Grid
          item
          xs={12}
          sx={{
            textAlign: 'center',
            padding: 1,
          }}
        >
          <FileDashboardUploader />
        </Grid>
        {isLoading && <Loader />}
        {isError && memberId && <div>{t('Error fetching data')}</div>}
        {isSuccess && (
          <Paper
            sx={{
              marginTop: 3,
              overflowX: 'auto',
            }}
          >
            <Table
              sx={{
                minWidth: 700,
              }}
              size="small"
            >
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
                      <AppDataRow key={a.id} data={a} showMember={showMember} />
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

export default AppDataTable;
