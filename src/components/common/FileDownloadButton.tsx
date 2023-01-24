import React, { FC } from 'react';

import { Api, AppData, useLocalContext } from '@graasp/apps-query-client';

import ArrowDownward from '@mui/icons-material/ArrowDownward';
import IconButton from '@mui/material/IconButton';

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
      const file = await Api.getFileContent({
        id: data.id,
        apiHost: context?.get('apiHost'),
        token,
      });
      downloadHelper(file, data.data.name as string);
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
