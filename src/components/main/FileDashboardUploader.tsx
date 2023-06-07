import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ROUTINES, useLocalContext } from '@graasp/apps-query-client';

import Uppy, { UploadResult } from '@uppy/core';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import { Dashboard } from '@uppy/react';

import { FILE_UPLOAD_MAX_FILES } from '../../config/constants';
import notifier from '../../config/notifier';
import { hooks, mutations } from '../../config/queryClient';
import { DASHBOARD_UPLOADER_ID } from '../../config/selectors';
import configureUppy from '../../utils/uppy';

const { uploadAppDataFileRoutine } = ROUTINES;

const FileDashboardUploader: FC = () => {
  const { t } = useTranslation();
  const { itemId, apiHost } = useLocalContext();
  const { data: token } = hooks.useAuthToken(itemId);
  const [uppy, setUppy] = useState<Uppy | null>(null);
  const { mutate: onFileUploadComplete } = mutations.useUploadAppDataFile();

  const onComplete = (result: UploadResult): boolean | void => {
    if (!result?.failed.length) {
      onFileUploadComplete({
        data: result.successful
          ?.map(({ response }) => response?.body?.[0])
          .filter(Boolean),
      });
    }
    return false;
  };

  const onUpload = (): void => {
    notifier({ type: uploadAppDataFileRoutine.REQUEST });
  };

  const onError = (error: Error): void => {
    onFileUploadComplete({ error });
  };

  const applyUppy = (): void => {
    if (typeof token !== 'undefined') {
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
    }
  };

  // update uppy configuration each time itemId changes
  useEffect(() => {
    applyUppy();

    return () => {
      uppy?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        note={t('You can upload up to FILE_UPLOAD_MAX_FILES files at a time', {
          maxFiles: FILE_UPLOAD_MAX_FILES,
        })}
        locale={{
          strings: {
            // Text to show on the droppable area.
            // `%{browseFiles}` is replaced with a link that opens the system file selection dialog.
            // See https://uppy.io/docs/dashboard/#locale
            dropPasteFiles: `${t('Drop here or')} %{browseFiles}`,
          },
        }}
      />
    </div>
  );
};

export default FileDashboardUploader;
