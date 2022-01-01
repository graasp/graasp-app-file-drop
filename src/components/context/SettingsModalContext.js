import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Tooltip, makeStyles, Button } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Switch from '@material-ui/core/Switch';
import { ITEM_FORM_CONFIRM_BUTTON_ID } from '../../config/selectors';
import { AppDataContext } from './AppDataContext';

const SettingsModalContext = React.createContext();

function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(theme => ({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
  },
  button: {
    margin: theme.spacing.unit,
  },
}));

const SettingsModalProvider = ({ children }) => {
  const { t } = useTranslation();
  // eslint-disable-next-line no-unused-vars
  const { messagePort } = useContext(AppDataContext);

  // updated properties are separated from the original item
  // so only necessary properties are sent when editing
  // const [updatedProperties, setUpdatedItem] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [headerVisible, setHeaderVisible] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [publicStudentUploads, setPublicStudentUploads] = useState(false);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState(null);
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars

  const openModal = newItem => {
    setOpen(true);
    setItem(newItem);
  };

  const onClose = () => {
    setOpen(false);
    setItem(null);
  };
  const submit = () => {
    messagePort
      ?.postMessage(
        JSON.stringify({
          type: 'UPDATE_SETTINGS',
          payload: {
            headerVisible,
            publicStudentUploads,
          },
        }),
      )
      .then(() => {
        setOpen(false);
        setItem(null);
        console.log('----------submitted');
        console.log(headerVisible);
        console.log(publicStudentUploads);
      });
  };
  // eslint-disable-next-line no-unused-vars
  // const { mutateAsync, isloading } = useMutation(id => {
  //   const url = `${apiHost}/${ITEMS_ROUTE}/${id}`;
  //   console.log(url);

  //   // eslint-disable-next-line no-unused-vars
  //   const req = fetch(url, {
  //     ...DEFAULT_PATCH_REQUEST,
  //     body: JSON.stringify({
  //       ...item,
  //       extra: {
  //         app: {
  //           url: 'http://app.localhost:3334',
  //           settings: {
  //             headerVisible: true,
  //             studentUploadVisibility: true,
  //           },
  //         },
  //       },
  //     }),
  //     headers: {
  //       ...DEFAULT_PATCH_REQUEST.headers,
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  //   return req;
  // });

  const handleChangeHeaderVisibility = () => {
    setHeaderVisible(!headerVisible);
    console.log(headerVisible);
  };

  const handleChangeStudentUploadVisibility = () => {
    // mutateAsync({id: itemId, ...updatedProperties}).then(async response => {
    // eslint-disable-next-line no-unused-vars
    // mutateAsync(itemId).then(async response => {
    //   setReFetch(!reFetch);
    //   console.log(reFetch);
    // });
    setPublicStudentUploads(!publicStudentUploads);
    console.log(publicStudentUploads);
  };

  const headerVisibilitySwitch = (
    <Switch
      color="primary"
      checked={headerVisible}
      onChange={handleChangeHeaderVisibility}
      value="headerVisibility"
      item={item}
    />
  );

  const studentUploadVisibilitySwitch = (
    <Switch
      color="primary"
      checked={publicStudentUploads}
      onChange={handleChangeStudentUploadVisibility}
      value="headerVisibility"
      item={item}
    />
  );

  const renderModal = () => (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={onClose}
      >
        <div style={getModalStyle()} className={classes.paper}>
          <Typography variant="h5" id="modal-title">
            {t('Settings')}
          </Typography>
          <>
            <FormControlLabel
              control={headerVisibilitySwitch}
              label={t('Show Header to Students')}
            />
            <Tooltip
              title={t(
                'When enabled, student uploads will be visible to other students. Teacher uploads are always visible to all students.',
              )}
            >
              <FormControlLabel
                control={studentUploadVisibilitySwitch}
                label={t('Student Uploads are Public')}
              />
            </Tooltip>
          </>
          <Button
            onClick={submit}
            color="primary"
            id={ITEM_FORM_CONFIRM_BUTTON_ID}
          >
            {t('Save new settings')}
          </Button>
        </div>
      </Modal>
    </div>
  );

  return (
    <SettingsModalContext.Provider value={{ openModal }}>
      {renderModal()}
      {children}
    </SettingsModalContext.Provider>
  );
};

SettingsModalProvider.propTypes = {
  children: PropTypes.node,
};

SettingsModalProvider.defaultProps = {
  children: null,
};

export { SettingsModalProvider, SettingsModalContext };
