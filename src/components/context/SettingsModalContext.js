import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import { useTranslation } from 'react-i18next';
import { Tooltip, makeStyles } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
// eslint-disable-next-line no-unused-vars
import Switch from '@material-ui/core/Switch';
// import { MUTATION_KEYS } from '@graasp/query-client';
// import { useMutation } from '../../config/queryClient';
import { AppDataContext } from './AppDataContext';
import { DEFAULT_PATCH_REQUEST } from '../../config/api';
// import { DEFAULT_PATCH } from '../../api/utils';
import { ITEMS_ROUTE } from '../../api/routes';

// import FolderForm from '../item/form/FolderForm';
// import { ITEM_TYPES } from '../../enums';
// import BaseItemForm from '../item/form/BaseItemForm';
// import DocumentForm from '../item/form/DocumentForm';

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
  const {
    apiHost,
    itemId,
    token,
    reFetch,
    setReFetch,
    headerVisible,
    setHeaderVisible,
    publicStudentUploads,
    setPublicStudentUploads,
  } = useContext(AppDataContext);
  console.log('initialheaderVisible');
  console.log(headerVisible);
  console.log('initialpublicStudentUploads');
  console.log(publicStudentUploads);
  const classes = useStyles();
  // const mutation = useMutation(MUTATION_KEYS.EDIT_ITEM);

  // updated properties are separated from the original item
  // so only necessary properties are sent when editing
  const [updatedProperties, setUpdatedItem] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [updatedHeaderVisibility, setHeaderVisibility] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [updatedStudentUploadVisibility, setStudentUploadVisibility] = useState(
    {},
  );
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState(null);
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars

  const openModal = newItem => {
    setOpen(true);
    setItem(newItem);
    console.log('-------newItem');
    console.log(newItem);
  };

  const onClose = () => {
    setOpen(false);
    setItem(null);
    setUpdatedItem(null);
  };
  // eslint-disable-next-line no-unused-vars
  const { mutateAsync, isloading } = useMutation(id => {
    const url = `${apiHost}/${ITEMS_ROUTE}/${id}`;
    console.log(url);

    // eslint-disable-next-line no-unused-vars
    const req = fetch(url, {
      ...DEFAULT_PATCH_REQUEST,
      body: JSON.stringify({
        ...item,
        extra: {
          app: {
            url: 'http://app.localhost:3334',
            settings: {
              headerVisible: true,
              studentUploadVisibility: true,
            },
          },
        },
      }),
      headers: {
        ...DEFAULT_PATCH_REQUEST.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return req;
  });

  // // eslint-disable-next-line no-unused-vars
  // const saveSettings = settingsToChange => {
  //   // const { settings, dispatchPatchAppInstance } = this.props;
  //   // eslint-disable-next-line no-unused-vars
  //   const newSettings = {
  //     ...settings,
  //     ...settingsToChange,
  //   };
  // };

  const handleChangeHeaderVisibility = () => {
    setHeaderVisible(!headerVisible);
    console.log('---headerVisible');
    console.log(headerVisible);
  };

  const handleChangeStudentUploadVisibility = () => {
    // mutateAsync({id: itemId, ...updatedProperties}).then(async response => {
    // eslint-disable-next-line no-unused-vars
    mutateAsync(itemId).then(async response => {
      setReFetch(!reFetch);
      console.log(reFetch);
    });
    setPublicStudentUploads(!publicStudentUploads);
  };

  const headerVisibilitySwitch = (
    <Switch
      color="primary"
      checked={headerVisible}
      onChange={handleChangeHeaderVisibility}
      isloading={isloading}
      value="headerVisibility"
      item={item}
      updatedProperties={updatedProperties}
    />
  );

  const studentUploadVisibilitySwitch = (
    <Switch
      color="primary"
      // checked={publicStudentUploads}
      checked={publicStudentUploads}
      onChange={handleChangeStudentUploadVisibility}
      isloading={isloading}
      value="headerVisibility"
      item={item}
      updatedProperties={updatedProperties}
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
          {/* {renderModalContent()} */}
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
