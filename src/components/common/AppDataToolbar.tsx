import { FC, useMemo, useState } from 'react';

import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { Api, useLocalContext } from '@graasp/apps-query-client';
import { AppData } from '@graasp/sdk';

import saveAs from 'file-saver';
import { t } from 'i18next';
import JSZip from 'jszip';

import { APP_DATA_TYPES } from '@/config/appDataTypes';

import { hooks } from '../../config/queryClient';
import { DOWNLOAD_ALL_CYPRESS } from '../../config/selectors';
import { showErrorToast, showWarningToast } from '../../utils/toasts';
import { useAppDataContext } from '../context/AppDataContext';

const zip = new JSZip();

const AppDataToolbar: FC = () => {
  const appDataArray = useAppDataContext();
  const appDataFiles = useMemo(
    () => appDataArray.filter(({ type }) => type === APP_DATA_TYPES.FILE),
    [appDataArray],
  );

  const [isLoading, setIsLoading] = useState(false);

  const { itemId, apiHost } = useLocalContext();

  const { data: token, isSuccess } = hooks.useAuthToken(itemId);

  if (!isSuccess) {
    return <CircularProgress color="primary" />;
  }

  const getFile = async (id: AppData['id']): Promise<Blob> =>
    Api.getAppDataFile({
      id,
      apiHost,
      token,
    });

  const getAllFiles = async (currentAppDataFiles: AppData[]): Promise<void> => {
    await Promise.all(
      currentAppDataFiles.map(async (appDataFile) => {
        const name: string =
          (appDataFile.data as { file: { name: string } })?.file?.name ??
          appDataFile.id;
        await getFile(appDataFile.id).then((file) => zip.file(name, file));
      }),
    );
  };

  const handleDownloadAll = async (): Promise<void> => {
    if (!isLoading) {
      setIsLoading(true);
      if (appDataFiles.length) {
        getAllFiles(appDataFiles)
          .then(() => {
            zip.generateAsync({ type: 'blob' }).then((archive) => {
              const d = new Date();
              saveAs(archive, `uploaded_files_${d.toISOString()}.zip`);
              setIsLoading(false);
            });
          })
          .catch((reason) =>
            showErrorToast(
              t('ERROR_DOWNLOAD_ALL', { reason: reason.toString() }),
            ),
          );
      } else {
        setIsLoading(false);
        showWarningToast(t('WARNING_NO_FILE_TO_DOWNLOAD'));
      }
    }
  };
  return (
    <Toolbar>
      <Typography
        sx={{ flex: '1 1 100%', textAlign: 'left' }}
        color="inherit"
        variant="subtitle1"
      >
        {t('UPLOADED_FILES_TOOLBAR')}
      </Typography>
      {isLoading ? (
        <CircularProgress color="primary" />
      ) : (
        <Tooltip title={t('DOWNLOAD_ALL')}>
          <IconButton
            onClick={handleDownloadAll}
            data-cy={DOWNLOAD_ALL_CYPRESS}
            disabled={appDataFiles.length === 0}
          >
            <FileDownloadIcon color="primary" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

export default AppDataToolbar;
