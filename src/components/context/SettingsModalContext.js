import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Tooltip, makeStyles } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import { MUTATION_KEYS } from '@graasp/query-client';
import Modal from '@material-ui/core/Modal';
// eslint-disable-next-line no-unused-vars
import Switch from '@material-ui/core/Switch';
import { useMutation } from '../../config/queryClient';
import { AppDataContext } from './AppDataContext';

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
    appInstanceId,
    dev,
    itemId,
    lang,
    mode,
    offline,
    userId,
    view,
    token,
  } = useContext(AppDataContext);
  const classes = useStyles();
  const mutation = useMutation(MUTATION_KEYS.EDIT_ITEM);

  // updated properties are separated from the original item
  // so only necessary properties are sent when editing
  const [updatedProperties, setUpdatedItem] = useState({});
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState(null);
  // const { headerVisible, publicStudentUploads } = settings;
  const settings = null;
  // const { headerVisible, publicStudentUploads } = null;
  const publicStudentUploads = null;
  const headerVisible = null;

  const openModal = newItem => {
    setOpen(true);
    setItem(newItem);
  };

  const onClose = () => {
    setOpen(false);
    setItem(null);
    setUpdatedItem(null);
  };
  // eslint-disable-next-line no-unused-vars
  const submit = () => {
    // add id to changed properties
    mutation.mutate({ id: item.id, ...updatedProperties });
    onClose();
  };
  // eslint-disable-next-line no-unused-vars
  const saveSettings = settingsToChange => {
    // const { settings, dispatchPatchAppInstance } = this.props;
    // eslint-disable-next-line no-unused-vars
    const newSettings = {
      ...settings,
      ...settingsToChange,
    };
    // dispatchPatchAppInstance({
    //   data: newSettings,
    // });
  };

  const handleChangeHeaderVisibility = () => {
    // const {
    //   settings: { headerVisible },
    // } = this.props;
    // const settingsToChange = {
    //   headerVisible: !headerVisible,
    // };
    // saveSettings(settingsToChange);
    console.log('handleChangeHeaderVisibility');
  };

  const handleChangeStudentUploadVisibility = () => {
    // const {
    //   settings: { publicStudentUploads },
    // } = this.props;
    // const settingsToChange = {
    //   publicStudentUploads: !publicStudentUploads,
    // };
    // saveSettings(settingsToChange);
    console.log('handleChangeStudentUploadVisibility');
  };

  const headerVisibilitySwitch = (
    <Switch
      color="primary"
      checked={headerVisible}
      onChange={handleChangeHeaderVisibility}
      value="headerVisibility"
    />
  );

  const studentUploadVisibilitySwitch = (
    <Switch
      color="primary"
      checked={publicStudentUploads}
      onChange={handleChangeStudentUploadVisibility}
      value="headerVisibility"
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
