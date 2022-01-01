import React, { useContext } from 'react';
import { useMutation } from 'react-query';
import Dialog from '@material-ui/core/Dialog';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

// import {
//   APP_DATA_ENDPOINT,
//   APP_ITEMS_ENDPOINT,
//   DEFAULT_DELETE_REQUEST,
//   DEFAULT_PATCH_REQUEST,
// } from '../../config/api';
import { AppDataContext } from '../context/AppDataContext';
import { APP_ITEMS_ENDPOINT } from '../../config/api';
// import { DEFAULT_DELETE } from '../../api/utils';

const useStyles = makeStyles(() => ({
  confirmDeleteButton: {
    color: 'red',
  },
}));
console.log(useStyles);

// const {
//   DELETE_RESOURCE,
// } = MY_MUTATION_KEYS;

const FileDownloader = ({ resourceId, open, handleClose }) => {
  const { t } = useTranslation();
  const { apiHost, itemId, token } = useContext(AppDataContext);
  console.log(resourceId);
  console.log(apiHost);
  console.log(itemId);
  console.log(token);
  console.log(open);

  const { mutateAsync, isloading } = useMutation(id => {
    const url = `${apiHost}/${APP_ITEMS_ENDPOINT}/${id}/download`;
    console.log('url');
    console.log(url);
    // eslint-disable-next-line no-unused-vars
    const response = fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response);
    return response;
  });

  // const classes = useStyles();

  const onDownload = () => {
    console.log('onDelete');
    // console.log(reFetch);
    // // eslint-disable-next-line no-unused-vars
    mutateAsync(resourceId).then(handleClose());
  };

  console.log(isloading);
  console.log(onDownload);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {t('Downloading item...')}
      </DialogTitle>
      {/* <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t('Downloading item...')}
        </DialogContentText>
      </DialogContent> */}
      {/* <DialogActions>
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
      </DialogActions> */}
    </Dialog>
  );
};

FileDownloader.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
  resourceId: PropTypes.arrayOf(PropTypes.string).isRequired,
};

FileDownloader.defaultProps = {
  open: false,
};

export default FileDownloader;
