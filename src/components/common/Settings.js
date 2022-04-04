import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Fab from '@material-ui/core/Fab';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import SettingsIcon from '@material-ui/icons/Settings';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { MUTATION_KEYS, useMutation } from '../../config/queryClient';
import {
  SETTINGS_BUTTON_CYPRESS,
  SETTING_HEADER_VISIBILITY_SWITCH_CYPRESS,
} from '../../config/selectors';
import Loader from '../common/Loader';
import { useAppSettings } from '../context/hooks';
import {
  APP_SETTINGS,
  DEFAULT_HEADER_VISIBLE,
  DEFAULT_PUBLIC_STUDENT_UPLOADS,
} from '../../config/constants';

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
  const { data: settings, isLoading } = useAppSettings();
  const { mutate: postAppSetting } = useMutation(
    MUTATION_KEYS.POST_APP_SETTING,
  );
  const { mutate: patchAppSetting } = useMutation(
    MUTATION_KEYS.PATCH_APP_SETTING,
  );

  const saveSettings = (originalSetting, newSetting) => {
    if (originalSetting?.id) {
      patchAppSetting(newSetting);
    } else {
      postAppSetting(newSetting);
    }
  };

  const handleChangeHeaderVisibility = () => {
    const key = APP_SETTINGS.HEADER_VISIBLE;
    const originalSetting = settings.find(({ name }) => name === key) ?? {
      name: key,
    };
    const settingsToChange = {
      ...originalSetting,
      data: {
        [key]: !originalSetting?.data?.[key] ?? !DEFAULT_HEADER_VISIBLE,
      },
    };
    saveSettings(originalSetting, settingsToChange);
  };

  const handleChangeStudentUploadVisibility = () => {
    const key = APP_SETTINGS.PUBLIC_STUDENT_UPLOADS;
    const originalSetting = settings.find(({ name }) => name === key);
    const settingsToChange = {
      ...originalSetting,
      data: {
        [key]: !originalSetting?.data?.[key] ?? !DEFAULT_PUBLIC_STUDENT_UPLOADS,
      },
    };
    saveSettings(originalSetting, settingsToChange);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const renderModalContent = () => {
    const headerVisible = settings?.find(
      ({ name }) => name === APP_SETTINGS.HEADER_VISIBLE,
    );
    const publicStudentUploads = settings?.find(
      ({ name }) => name === APP_SETTINGS.PUBLIC_STUDENT_UPLOADS,
    );

    if (isLoading) {
      return <Loader />;
    }

    const headerVisibilitySwitch = (
      <Switch
        color="primary"
        checked={
          headerVisible?.data[APP_SETTINGS.HEADER_VISIBLE] ??
          DEFAULT_HEADER_VISIBLE
        }
        onChange={handleChangeHeaderVisibility}
        value={APP_SETTINGS.HEADER_VISIBLE}
        data-cy={SETTING_HEADER_VISIBILITY_SWITCH_CYPRESS}
      />
    );

    const studentUploadVisibilitySwitch = (
      <Switch
        color="primary"
        checked={
          publicStudentUploads?.data[APP_SETTINGS.PUBLIC_STUDENT_UPLOADS] ??
          DEFAULT_PUBLIC_STUDENT_UPLOADS
        }
        onChange={handleChangeStudentUploadVisibility}
        value={APP_SETTINGS.PUBLIC_STUDENT_UPLOADS}
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
