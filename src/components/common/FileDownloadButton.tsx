import { useContext } from 'react';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import IconButton from '@mui/material/IconButton';
import downloadHelper from './utils';
import { TABLE_CELL_FILE_ACTION_DOWNLOAD_CYPRESS } from '../../config/selectors';
import { Api, TokenContext, useLocalContext } from '@graasp/apps-query-client';
import { AppDataRecord } from '@graasp/sdk/frontend';

type Props = {
  data: AppDataRecord;
};

const FileDownloadButton = ({ data }: Props): JSX.Element => {
  const context = useLocalContext();
  const token = useContext(TokenContext);

  const handleOpenDownloader = async () => {
    const file = await Api.getFileContent({
      id: data.id,
      apiHost: context?.get('apiHost'),
      token,
    });
    downloadHelper(
      file,
      (data.data?.s3File as { name: string }).name ?? 'file',
    );
  };

  return (
    <IconButton
      color="primary"
      onClick={handleOpenDownloader}
      data-cy={TABLE_CELL_FILE_ACTION_DOWNLOAD_CYPRESS}
    >
      <ArrowDownward />
    </IconButton>
  );
};

export default FileDownloadButton;
