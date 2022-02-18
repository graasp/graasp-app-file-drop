import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { CONFIRM_DELETE_BUTTON_ID } from '../../config/selectors';
import { MUTATION_KEYS, useMutation } from '../../config/queryClient';

const useStyles = makeStyles(() => ({
  confirmDeleteButton: {
    color: 'red',
  },
}));

const DeleteResourceDialog = ({ appDataId, open, handleClose }) => {
  const { t } = useTranslation();

  const { mutateAsync: deleteAppData } = useMutation(
    MUTATION_KEYS.DELETE_APP_DATA,
  );

  const classes = useStyles();

  const onDelete = () => {
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

DeleteResourceDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
  appDataId: PropTypes.string.isRequired,
};

DeleteResourceDialog.defaultProps = {
  open: false,
};

export default DeleteResourceDialog;
