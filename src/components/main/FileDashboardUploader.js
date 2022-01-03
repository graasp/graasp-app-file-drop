import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import { Dashboard } from '@uppy/react';
import { routines, MUTATION_KEYS } from '@graasp/query-client';
import { useTranslation } from 'react-i18next';
import { FILE_UPLOAD_MAX_FILES, UPLOAD_METHOD } from '../../config/constants';
import { useMutation } from '../../config/queryClient';
import configureUppy from '../../utils/uppy';
import { DASHBOARD_UPLOADER_ID } from '../../config/selectors';
import { AppDataContext } from '../context/AppDataContext';
import { UPLOAD_FILES_METHODS } from '../../enums';
import notifier from '../../middlewares/notifier';

const { uploadFileRoutine } = routines;

const FileDashboardUploader = ({ value }) => {
  const [uppy, setUppy] = useState(null);
  const { itemId, token, reFetch, setReFetch } = useContext(AppDataContext);
  const { t } = useTranslation();
  const { mutate: onFileUploadComplete } = useMutation(
    MUTATION_KEYS.FILE_UPLOAD,
  );

  const method = UPLOAD_FILES_METHODS.DEFAULT;

  const onComplete = result => {
    setReFetch(!reFetch);
    if (!result?.failed.length) {
      onFileUploadComplete({ id: itemId });
    }
    return false;
  };

  const onUpload = () => {
    switch (method) {
      case UPLOAD_FILES_METHODS.S3:
        break;

      case UPLOAD_FILES_METHODS.DEFAULT:
      default:
        notifier({ type: uploadFileRoutine.REQUEST });
        break;
    }
  };

  const onError = error => {
    onFileUploadComplete({ id: itemId, error });
  };

  const applyUppy = () => {
    if (value) {
      setUppy(
        configureUppy({
          itemId,
          token,
          onComplete,
          onError,
          onUpload,
          method: UPLOAD_METHOD,
        }),
      );
    }
  };

  useEffect(() => {
    if (value) {
      applyUppy();

      return () => {
        uppy?.close();
      };
    }
    return null;
  }, []);

  // update uppy configuration each time itemId changes
  useEffect(() => {
    applyUppy();
  }, [itemId, token]);

  if (!uppy) {
    return null;
  }

  return (
    <>
      <div id={DASHBOARD_UPLOADER_ID}>
        <Dashboard
          uppy={uppy}
          height={200}
          width="100%"
          proudlyDisplayPoweredByUppy={false}
          note={t(
            `You can upload up to FILE_UPLOAD_MAX_FILES files at a time`,
            {
              maxFiles: FILE_UPLOAD_MAX_FILES,
            },
          )}
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
    </>
  );
};

FileDashboardUploader.propTypes = {
  value: PropTypes.bool.isRequired,
};

export default FileDashboardUploader;
