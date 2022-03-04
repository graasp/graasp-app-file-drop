import React, { useContext } from 'react';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import downloadHelper from './utils';
import { TABLE_CELL_FILE_ACTION_DOWNLOAD_CYPRESS } from '../../config/selectors';
import { Api } from '@graasp/apps-query-client';
import { Context } from '../context/ContextContext';
import { TokenContext } from '../context/TokenContext';

const FileDownloadButton = ({ data }) => {
  const context = useContext(Context);
  const token = useContext(TokenContext);

  const handleOpenDownloader = async () => {
    const file = await Api.getFileContent({
      id: data.id,
      apiHost: context?.get('apiHost'),
      token,
    });
    downloadHelper(file.data, data.data.name);
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

FileDownloadButton.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    data: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default FileDownloadButton;
