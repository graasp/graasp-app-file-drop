import { UUID } from '@graasp/sdk';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';

type Props = {
  open?: boolean;
  handleClose: () => void;
  appDataId: UUID;
};

const FileDownloader = ({
  appDataId,
  open = false,
  handleClose,
}: Props): JSX.Element => {
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

export default FileDownloader;
