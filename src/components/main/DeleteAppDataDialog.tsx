import { makeStyles } from 'tss-react/mui';

import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { mutations } from '../../config/queryClient';
import { CONFIRM_DELETE_BUTTON_ID } from '../../config/selectors';

const useStyles = makeStyles()(() => ({
  confirmDeleteButton: {
    color: 'red',
  },
}));

interface DeleteAppDataDialogProps {
  appDataId: string;
  open: boolean;
  handleClose: () => void;
}

const DeleteAppDataDialog: FC<DeleteAppDataDialogProps> = ({
  appDataId,
  open,
  handleClose,
}) => {
  const { t } = useTranslation();

  const { mutate: deleteAppData } = mutations.useDeleteAppData();

  const { classes } = useStyles();

  const onDelete = (): void => {
    deleteAppData({ id: appDataId });
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {t('Confirm deleting item.')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t('Choose one of the following action.')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {t('Cancel')}
        </Button>
        <Button
          id={CONFIRM_DELETE_BUTTON_ID}
          className={classes.confirmDeleteButton}
          onClick={onDelete}
          color="secondary"
          autoFocus
        >
          {t('Delete Permanently')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAppDataDialog;
