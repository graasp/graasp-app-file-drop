import React, { useContext } from 'react';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import { API_ROUTES } from '../../config/queryClient';
import { TokenContext } from '../context/TokenContext';
import downloadHelper from './utils';
import { Context } from '../context/ContextContext';

const FileDownloadButton = ({ data }) => {
  const context = useContext(Context);
  const apiHost = context?.get('apiHost');
  const token = useContext(TokenContext);

  const downloadFile = async (url) => {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  };

  const handleOpenDownloader = () => {
    const url = `${apiHost}/${API_ROUTES.buildDownloadFileRoute(data.id)}`;
    downloadFile(url).then(async (response) => {
      downloadHelper(response, data);
    });
  };

  return (
    <IconButton color="primary" onClick={handleOpenDownloader}>
      <ArrowDownward />
    </IconButton>
  );
};

FileDownloadButton.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default FileDownloadButton;
