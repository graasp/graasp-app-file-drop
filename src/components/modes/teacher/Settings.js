import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Fab from '@material-ui/core/Fab';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import SettingsIcon from '@material-ui/icons/Settings';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Context } from '../../context/ContextContext';
import { MUTATION_KEYS, useMutation } from '../../../config/queryClient';
import {
  SETTINGS_BUTTON_CYPRESS,
  SETTING_HEADER_VISIBILITY_SWITCH_CYPRESS,
} from '../../../config/selectors';

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
  fab: {
    margin: theme.spacing(1),
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
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

const Settings = () => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { t } = useTranslation();
  const context = useContext(Context);
  const settings = context?.get('settings');
  const { mutate: updateSettings } = useMutation(MUTATION_KEYS.PATCH_SETTINGS);

  const saveSettings = (settingsToChange) => {
    const newSettings = {
      ...settings,
      ...settingsToChange,
    };
    updateSettings(newSettings);
  };

  const handleChangeHeaderVisibility = () => {
    const { headerVisible } = settings;
    const settingsToChange = {
      headerVisible: !headerVisible,
    };
    saveSettings(settingsToChange);
  };

  const handleChangeStudentUploadVisibility = () => {
    const { publicStudentUploads } = settings;
    const settingsToChange = {
      publicStudentUploads: !publicStudentUploads,
    };
    saveSettings(settingsToChange);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const renderModalContent = () => {
    const { headerVisible, publicStudentUploads } = settings;

    const headerVisibilitySwitch = (
      <Switch
        color="primary"
        checked={headerVisible}
        onChange={handleChangeHeaderVisibility}
        value="headerVisibility"
        data-cy={SETTING_HEADER_VISIBILITY_SWITCH_CYPRESS}
      />
    );

    const studentUploadVisibilitySwitch = (
      <Switch
        color="primary"
        checked={publicStudentUploads}
        onChange={handleChangeStudentUploadVisibility}
        value="headerVisibility"
        // todo: enable when feature is available
        disabled
      />
    );

    return (
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
    );
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="Settings"
        className={classes.fab}
        onClick={handleOpen}
        data-cy={SETTINGS_BUTTON_CYPRESS}
      >
        <SettingsIcon />
      </Fab>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <div style={getModalStyle()} className={classes.paper}>
          <Typography variant="h5" id="modal-title">
            {t('Settings')}
          </Typography>
          {renderModalContent()}
        </div>
      </Modal>
    </>
  );
};

export default Settings;
