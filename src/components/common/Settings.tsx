import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import SettingsIcon from '@mui/icons-material/Settings';
import Fab from '@mui/material/Fab';
import FormControlLabel from '@mui/material/FormControlLabel';
import Modal from '@mui/material/Modal';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { AppSetting } from '@graasp/sdk';

import { makeStyles } from 'tss-react/mui';

import { APP_SETTINGS_TYPES } from '../../config/appSettingTypes';
import {
  DEFAULT_HEADER_VISIBLE,
  DEFAULT_PUBLIC_STUDENT_UPLOADS,
} from '../../config/constants';
import { mutations } from '../../config/queryClient';
import {
  SETTINGS_BUTTON_CYPRESS,
  SETTING_HEADER_VISIBILITY_SWITCH_CYPRESS,
} from '../../config/selectors';
import { useAppSettingContext } from '../context/AppSettingContext';

function getModalStyle(): { top: string; left: string; transform: string } {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles()((theme) => ({
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

const Settings: FC = () => {
  const [open, setOpen] = useState(false);
  const { classes } = useStyles();
  const { t } = useTranslation();
  const settings = useAppSettingContext();

  const { mutate: postAppSetting } = mutations.usePostAppSetting();
  const { mutate: patchAppSetting } = mutations.usePatchAppSetting();

  interface NewSetting {
    id?: AppSetting['id'];
    name?: AppSetting['name'];
    data: AppSetting['data'];
  }
  const saveSettings = (newSetting: NewSetting): void => {
    const { id, name, data } = newSetting;
    if (id) {
      patchAppSetting({ id, data });
    } else if (typeof name === 'string') {
      postAppSetting({ name, data });
    }
  };

  const handleChangeHeaderVisibility = (): void => {
    const key = APP_SETTINGS_TYPES.HEADER_VISIBLE;
    const originalSetting = settings.find(({ name }) => name === key);
    const settingsToChange = {
      ...originalSetting,
      name: key,
      data: {
        [key]: !originalSetting?.data?.[key] ?? !DEFAULT_HEADER_VISIBLE,
      },
    };
    saveSettings(settingsToChange);
  };

  const handleChangeStudentUploadVisibility = (): void => {
    const key = APP_SETTINGS_TYPES.PUBLIC_STUDENT_UPLOADS;
    const originalSetting = settings.find(({ name }) => name === key);
    const settingsToChange = {
      ...originalSetting,
      name: key,
      data: {
        [key]: !originalSetting?.data?.[key] ?? !DEFAULT_PUBLIC_STUDENT_UPLOADS,
      },
    };
    saveSettings(settingsToChange);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleOpen = (): void => {
    setOpen(true);
  };

  const renderModalContent = (): JSX.Element => {
    const headerVisible = settings?.find(
      ({ name }) => name === APP_SETTINGS_TYPES.HEADER_VISIBLE,
    );
    const publicStudentUploads = settings?.find(
      ({ name }) => name === APP_SETTINGS_TYPES.PUBLIC_STUDENT_UPLOADS,
    );

    const headerVisibilitySwitch = (
      <Switch
        color="primary"
        checked={
          (headerVisible?.data[APP_SETTINGS_TYPES.HEADER_VISIBLE] ??
            DEFAULT_HEADER_VISIBLE) as boolean
        }
        onChange={handleChangeHeaderVisibility}
        value={APP_SETTINGS_TYPES.HEADER_VISIBLE}
        data-cy={SETTING_HEADER_VISIBILITY_SWITCH_CYPRESS}
      />
    );

    const studentUploadVisibilitySwitch = (
      <Switch
        color="primary"
        checked={
          (publicStudentUploads?.data[
            APP_SETTINGS_TYPES.PUBLIC_STUDENT_UPLOADS
          ] ?? DEFAULT_PUBLIC_STUDENT_UPLOADS) as boolean
        }
        onChange={handleChangeStudentUploadVisibility}
        value={APP_SETTINGS_TYPES.PUBLIC_STUDENT_UPLOADS}
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
