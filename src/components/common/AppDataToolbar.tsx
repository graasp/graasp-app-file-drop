import saveAs from 'file-saver';
import { t } from 'i18next';
import JSZip from 'jszip';

import { FC, useState } from 'react';

import { Api, useLocalContext } from '@graasp/apps-query-client';
import { AppData } from '@graasp/sdk';

import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { hooks } from '../../config/queryClient';
import { DOWNLOAD_ALL_CYPRESS } from '../../config/selectors';
import { showErrorToast } from '../../utils/toasts';
import { useAppDataContext } from '../context/AppDataContext';

const zip = new JSZip();

const AppDataToolbar: FC = () => {
  const appDataArray = useAppDataContext();

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

  const getAllFiles = async (appDataFiles: AppData[]): Promise<void> => {
    await Promise.all(
      appDataFiles.map(async (appDataFile) => {
        const name: string =
          (appDataFile.data as { s3File: { name: string } })?.s3File?.name ??
          appDataFile.id;
        await getFile(appDataFile.id).then((file) => zip.file(name, file));
      }),
    );
  };

  const handleDownloadAll = async (): Promise<void> => {
    if (!isLoading) {
      setIsLoading(true);
      const appDataFiles = appDataArray.filter(({ type }) => type === 'file');
      if (!appDataFiles.length) {
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
          >
            <FileDownloadIcon color="primary" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

export default AppDataToolbar;
