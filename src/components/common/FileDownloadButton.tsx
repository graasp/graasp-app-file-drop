import { FC } from 'react';

import ArrowDownward from '@mui/icons-material/ArrowDownward';
import IconButton from '@mui/material/IconButton';

import { Api, useLocalContext } from '@graasp/apps-query-client';
import { AppData } from '@graasp/sdk';

import { hooks } from '../../config/queryClient';
import { TABLE_CELL_FILE_ACTION_DOWNLOAD_CYPRESS } from '../../config/selectors';
import downloadHelper from './utils';

interface FileDownloadButtonProps {
  data: AppData;
}

const FileDownloadButton: FC<FileDownloadButtonProps> = ({ data }) => {
  const context = useLocalContext();
  const { itemId } = context;
  const { data: token, isSuccess } = hooks.useAuthToken(itemId);

  const handleOpenDownloader = async (): Promise<void> => {
    if (typeof token !== 'undefined') {
      const file = await Api.getAppDataFile({
        id: data.id,
        apiHost: context?.apiHost,
        token,
      });

      // this might happen because of mock server
      if (!(file instanceof Blob)) {
        // eslint-disable-next-line no-console
        console.error('file is not a blob');
      } else {
        downloadHelper(
          file,
          (data.data as { file: { name: string } }).file.name,
        );
      }
    }
  };
  if (isSuccess) {
    return (
      <IconButton
        color="primary"
        onClick={handleOpenDownloader}
        data-cy={TABLE_CELL_FILE_ACTION_DOWNLOAD_CYPRESS}
        size="large"
      >
        <ArrowDownward />
      </IconButton>
    );
  }
  return null;
};

export default FileDownloadButton;
