import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import { FILE_UPLOAD_MAX_FILES } from '../config/constants';
import { API_ROUTES } from '../config/queryClient';

const configureUppy = ({
  apiHost,
  itemId,
  token,
  onComplete,
  onProgress,
  onFileAdded,
  onFilesAdded,
  onError,
  onUpload,
}) => {
  const uppy = new Uppy({
    restrictions: { maxNumberOfFiles: FILE_UPLOAD_MAX_FILES },
    autoProceed: true,
  });

  uppy.use(XHRUpload, {
    endpoint: `${apiHost}/${API_ROUTES.buildUploadFilesRoute(itemId)}`,
    withCredentials: true,
    formData: true,
    metaFields: [],
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  uppy.on('file-added', (file) => {
    onFileAdded?.(file);
  });

  uppy.on('files-added', (files) => {
    onFilesAdded?.(files);
  });

  uppy.on('upload', onUpload);

  uppy.on('progress', onProgress);

  uppy.on('complete', (result) => {
    onComplete?.(result);
  });

  uppy.on('error', (error) => {
    onError?.(error);
  });

  uppy.on('upload-error', (error) => {
    onError?.(error);
  });

  return uppy;
};

export default configureUppy;
