import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const FileDownloader = ({ appDataId, open, handleClose }) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {t('Downloading item...')}
        <p>{appDataId}</p>
      </DialogTitle>
    </Dialog>
  );
};

FileDownloader.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
  appDataId: PropTypes.arrayOf(PropTypes.string).isRequired,
};

FileDownloader.defaultProps = {
  open: false,
};

export default FileDownloader;
