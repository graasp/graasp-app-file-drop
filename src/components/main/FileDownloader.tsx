import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

interface FileDownloaderProps {
  appDataId: string[];
  open?: boolean;
  handleClose: () => void;
}

const FileDownloader: FC<FileDownloaderProps> = ({
  appDataId,
  open = false,
  handleClose,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {t('DOWNLOADING_ITEM')}
        <p>{appDataId}</p>
      </DialogTitle>
    </Dialog>
  );
};

export default FileDownloader;
