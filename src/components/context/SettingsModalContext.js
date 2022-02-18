import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Tooltip, makeStyles, Button } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Switch from '@material-ui/core/Switch';
import { ITEM_FORM_CONFIRM_BUTTON_ID } from '../../config/selectors';
import { MUTATION_KEYS, useMutation } from '../../config/queryClient';

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

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  paper: {
    position: 'absolute',
    width: theme.spacing(50),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: 'none',
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const SettingsModalProvider = ({ children }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  // TO DO: updated properties are separated from the original item
  // so only necessary properties are sent when editing

  const [headerVisible, setHeaderVisible] = useState(false);
  const [publicStudentUploads, setPublicStudentUploads] = useState(false);
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState(null);
  const { mutate: updateSettings } = useMutation(MUTATION_KEYS.UPDATE_SETTINGS);

  const openModal = useCallback((newItem) => {
    setOpen(true);
    setItem(newItem);
  }, []);

  const onClose = () => {
    setOpen(false);
    setHeaderVisible(false);
    setPublicStudentUploads(false);

    setItem(null);
  };

  const submit = () => {
    updateSettings({
      headerVisible,
      publicStudentUploads,
    });
  };

  const handleChangeHeaderVisibility = () => {
    setHeaderVisible(!headerVisible);
  };

  const handleChangeStudentUploadVisibility = () => {
    setPublicStudentUploads(!publicStudentUploads);
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
          <Tooltip
            title={t(
              'When clicked, settings will be saved and the app will be refreshed.',
            )}
          >
            <Button
              onClick={submit}
              color="primary"
              id={ITEM_FORM_CONFIRM_BUTTON_ID}
            >
              {t('Save new settings')}
            </Button>
          </Tooltip>
        </div>
      </Modal>
    </div>
  );

  const value = useMemo(() => ({ openModal }), [openModal]);

  return (
    <SettingsModalContext.Provider value={value}>
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
