import React, { useContext } from 'react';
import { useMutation } from 'react-query';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
// import { MUTATION_KEYS } from '@graasp/query-client';
// import { useMutation } from '../../config/queryClient';
import {
  CONFIRM_DELETE_BUTTON_ID,
  // CONFIRM_RECYCLE_BUTTON_ID,
} from '../../config/selectors';
// import { MY_MUTATION_KEYS } from '../../queryClient/keys';

import {
  APP_DATA_ENDPOINT,
  APP_ITEMS_ENDPOINT,
  DEFAULT_DELETE_REQUEST,
  DEFAULT_PATCH_REQUEST,
} from '../../config/api';
import { AppDataContext } from '../context/AppDataContext';
// import { DEFAULT_DELETE } from '../../api/utils';

const useStyles = makeStyles(() => ({
  confirmDeleteButton: {
    color: 'red',
  },
}));

// const {
//   DELETE_RESOURCE,
// } = MY_MUTATION_KEYS;

const DeleteResourceDialog = ({ resourceId, open, handleClose }) => {
  const { t } = useTranslation();
  const { apiHost, itemId, token, reFetch, setReFetch } = useContext(
    AppDataContext,
  );
  console.log('reFetch');
  console.log(reFetch);
  console.log('setReFetch');
  console.log(setReFetch);

  // const { mutate: deleteResource } = useMutation(DELETE_RESOURCE);
  const { mutateAsync, isloading } = useMutation(id => {
    const url = `${apiHost}/${APP_ITEMS_ENDPOINT}/${itemId}/${APP_DATA_ENDPOINT}/${id}`;

    // eslint-disable-next-line no-unused-vars
    const response = fetch(url, {
      ...DEFAULT_DELETE_REQUEST,
      headers: {
        ...DEFAULT_PATCH_REQUEST.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  });

  const classes = useStyles();

  const onDelete = () => {
    console.log('onDelete');
    console.log(reFetch);
    // eslint-disable-next-line no-unused-vars
    mutateAsync(resourceId).then(async response => {
      setReFetch(!reFetch);
      console.log(reFetch);
    });
    // }
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
          isloading={isloading}
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
  resourceId: PropTypes.arrayOf(PropTypes.string).isRequired,
};

DeleteResourceDialog.defaultProps = {
  open: false,
};

export default DeleteResourceDialog;
