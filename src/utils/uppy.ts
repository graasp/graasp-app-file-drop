import Uppy, {
  ErrorCallback,
  FileAddedCallback,
  FilesAddedCallback,
  ProgressCallback,
  UploadCallback,
  UploadCompleteCallback,
} from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';

import { FILE_UPLOAD_MAX_FILES } from '../config/constants';
import { API_ROUTES } from '../config/queryClient';

interface UppyConfiguration {
  apiHost: string;
  itemId: string;
  token: string;
  onComplete: UploadCompleteCallback<any>;
  onProgress?: ProgressCallback;
  onFileAdded?: FileAddedCallback<any>;
  onFilesAdded?: FilesAddedCallback<any>;
  onError: ErrorCallback;
  onUpload: UploadCallback;
}

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
}: UppyConfiguration): Uppy => {
  const uppy = new Uppy({
    restrictions: { maxNumberOfFiles: FILE_UPLOAD_MAX_FILES },
    autoProceed: true,
  });

  uppy.use(XHRUpload, {
    endpoint: `${apiHost}/${API_ROUTES.buildUploadFilesRoute(itemId)}`,
    withCredentials: true,
    formData: true,
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

  if (typeof onProgress !== 'undefined') {
    uppy.on('progress', onProgress);
  }

  uppy.on('complete', (result) => {
    onComplete?.(result);
  });

  if (typeof onError !== 'undefined') {
    uppy.on('error', onError);
    uppy.on('upload-error', (_, error) => {
      onError(error);
    });
  }

  return uppy;
};

export default configureUppy;
