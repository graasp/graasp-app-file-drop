import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Fab from '@mui/material/Fab';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import SettingsIcon from '@mui/icons-material/Settings';
import FormControlLabel from '@mui/material/FormControlLabel';
import { hooks, mutations } from '../../config/queryClient';
import {
  SETTINGS_BUTTON_CYPRESS,
  SETTING_HEADER_VISIBILITY_SWITCH_CYPRESS,
} from '../../config/selectors';
import {
  APP_SETTINGS,
  DEFAULT_HEADER_VISIBLE,
  DEFAULT_PUBLIC_STUDENT_UPLOADS,
} from '../../config/constants';
import { Loader } from '@graasp/ui';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { AppSetting, UUID } from '@graasp/sdk';

const { useAppSettings } = hooks;

const Settings = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { data: settings, isLoading } = useAppSettings();
  const { mutate: postAppSetting } = mutations.usePostAppSetting();
  const { mutate: patchAppSetting } = mutations.usePatchAppSetting();

  const saveSetting = (
    id: UUID | undefined,
    newSetting: Partial<AppSetting>,
  ) => {
    if (id) {
      patchAppSetting({ id, ...newSetting });
    } else {
      postAppSetting(newSetting);
    }
  };

  const handleChangeHeaderVisibility = () => {
    const key = APP_SETTINGS.HEADER_VISIBLE;
    const originalSetting = settings?.find(({ name }) => name === key);
    const settingsToChange = {
      name: key,
      data: {
        [key]: !originalSetting?.data?.[key] ?? !DEFAULT_HEADER_VISIBLE,
      },
    };
    saveSetting(originalSetting?.id, settingsToChange);
  };

  const handleChangeStudentUploadVisibility = () => {
    const key = APP_SETTINGS.PUBLIC_STUDENT_UPLOADS;
    const originalSetting = settings?.find(({ name }) => name === key);
    const settingsToChange = {
      name: key,
      data: {
        [key]: !originalSetting?.data?.[key] ?? !DEFAULT_PUBLIC_STUDENT_UPLOADS,
      },
    };
    saveSetting(originalSetting?.id, settingsToChange);
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
          Boolean(headerVisible?.data[APP_SETTINGS.HEADER_VISIBLE]) ??
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
          Boolean(
            publicStudentUploads?.data[APP_SETTINGS.PUBLIC_STUDENT_UPLOADS],
          ) ?? DEFAULT_PUBLIC_STUDENT_UPLOADS
        }
        onChange={handleChangeStudentUploadVisibility}
        value={APP_SETTINGS.PUBLIC_STUDENT_UPLOADS}
        // todo: enable when feature is available
        disabled
      />
    );

    return (
      <DialogContent>
        <FormControlLabel
          control={headerVisibilitySwitch}
          label={t('Show Header to Students')}
        />
        <br />
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
      </DialogContent>
    );
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="Settings"
        sx={{
          margin: 1,
          position: 'fixed',
          bottom: 2,
          right: 2,
        }}
        onClick={handleOpen}
        data-cy={SETTINGS_BUTTON_CYPRESS}
      >
        <SettingsIcon />
      </Fab>
      <Dialog
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>{t('Settings')}</DialogTitle>
        {renderModalContent()}
      </Dialog>
    </>
  );
};

export default Settings;
