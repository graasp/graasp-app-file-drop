import { useContext, useEffect, useState } from 'react';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import {
  ROUTINES,
  TokenContext,
  useLocalContext,
} from '@graasp/apps-query-client';
import { Dashboard } from '@uppy/react';
import { useTranslation } from 'react-i18next';
import { FILE_UPLOAD_MAX_FILES } from '../../config/constants';
import { mutations } from '../../config/queryClient';
import configureUppy, { ConfigureUppyArgs } from '../../utils/uppy';
import { DASHBOARD_UPLOADER_ID } from '../../config/selectors';
import notifier from '../../config/notifier';
import Uppy from '@uppy/core';
import { Alert } from '@mui/material';

const { uploadFileRoutine } = ROUTINES;

const FileDashboardUploader = () => {
  const { t } = useTranslation();
  const context = useLocalContext();
  const token = useContext(TokenContext);
  const itemId = context?.itemId;
  const apiHost = context?.apiHost;
  const [uppy, setUppy] = useState<Uppy>();
  const { mutate: onFileUploadComplete } = mutations.useUploadAppDataFile();

  const onComplete: ConfigureUppyArgs['onComplete'] = (result) => {
    if (!result?.failed.length) {
      onFileUploadComplete({
        data: result.successful
          ?.map(({ response }) => response?.body?.[0])
          .filter(Boolean),
      });
    }
    return false;
  };

  const onUpload = () => {
    notifier({ type: uploadFileRoutine.REQUEST, payload: '' });
  };

  const onError: ConfigureUppyArgs['onError'] = (error) => {
    onFileUploadComplete({ error });
  };

  const applyUppy = () => {
    setUppy(
      configureUppy({
        apiHost,
        itemId,
        token,
        onComplete,
        onError,
        onUpload,
      }),
    );
  };

  // update uppy configuration each time itemId changes
  useEffect(() => {
    applyUppy();

    return () => {
      uppy?.close();
    };
  }, [itemId, token]);

  if (!uppy) {
    return null;
  }

  if (!itemId) {
    return <Alert severity="error">{t('Item is not defined')}</Alert>;
  }

  return (
    <div id={DASHBOARD_UPLOADER_ID}>
      <Dashboard
        disabled={Boolean(!context?.memberId)}
        uppy={uppy}
        height={200}
        width="100%"
        proudlyDisplayPoweredByUppy={false}
        note={t(`You can upload up to FILE_UPLOAD_MAX_FILES files at a time`, {
          maxFiles: FILE_UPLOAD_MAX_FILES,
        })}
        locale={{
          strings: {
            dropPasteFiles: 'Drop files here or %{browseFiles}',
          },
        }}
      />
    </div>
  );
};

export default FileDashboardUploader;
