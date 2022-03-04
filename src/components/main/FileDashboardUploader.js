import React, { useContext, useEffect, useState } from 'react';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import { ROUTINES } from '@graasp/apps-query-client';
import { Dashboard } from '@uppy/react';
import { useTranslation } from 'react-i18next';
import { FILE_UPLOAD_MAX_FILES } from '../../config/constants';
import { MUTATION_KEYS, useMutation } from '../../config/queryClient';
import configureUppy from '../../utils/uppy';
import { DASHBOARD_UPLOADER_ID } from '../../config/selectors';
import notifier from '../../config/notifier';
import { Context } from '../context/ContextContext';
import { TokenContext } from '../context/TokenContext';

const { uploadFileRoutine } = ROUTINES;

const FileDashboardUploader = () => {
  const { t } = useTranslation();
  const context = useContext(Context);
  const token = useContext(TokenContext);
  const itemId = context?.get('itemId');
  const apiHost = context?.get('apiHost');
  const [uppy, setUppy] = useState(null);
  const { mutate: onFileUploadComplete } = useMutation(
    MUTATION_KEYS.FILE_UPLOAD,
  );

  const onComplete = (result) => {
    if (!result?.failed.length) {
      onFileUploadComplete({
        id: itemId,
        data: result.successful
          ?.map(({ response }) => response?.body?.[0])
          .filter(Boolean),
      });
    }
    return false;
  };

  const onUpload = () => {
    notifier({ type: uploadFileRoutine.REQUEST });
  };

  const onError = (error) => {
    onFileUploadComplete({ id: itemId, error });
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

  return (
    <div id={DASHBOARD_UPLOADER_ID}>
      <Dashboard
        uppy={uppy}
        height={200}
        width="100%"
        proudlyDisplayPoweredByUppy={false}
        note={t(`You can upload up to FILE_UPLOAD_MAX_FILES files at a time`, {
          maxFiles: FILE_UPLOAD_MAX_FILES,
        })}
        locale={{
          strings: {
            // Text to show on the droppable area.
            // `%{browse}` is replaced with a link that opens the system file selection dialog.
            dropPaste: `${t('Drop here or')} %{browse}`,
            // Used as the label for the link that opens the system file selection dialog.
            browse: t('Browse'),
          },
        }}
      />
    </div>
  );
};

export default FileDashboardUploader;
