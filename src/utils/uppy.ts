import Uppy, { ProgressCallback } from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import { FILE_UPLOAD_MAX_FILES } from '../config/constants';
import { API_ROUTES } from '../config/queryClient';
import { UUID } from '@graasp/sdk';
import { UploadResult } from '@uppy/core';
import { UppyFile } from '@uppy/core';
import { UploadCallback } from '@uppy/core';

export type ConfigureUppyArgs = {
  apiHost: string,
  itemId: UUID,
  token: string,
  onComplete?: (result: UploadResult) => void,
  onProgress?: ProgressCallback,
  onFileAdded?: (files: UppyFile) => void,
  onFilesAdded?: (files: UppyFile[]) => void,
  onError?: (e: Error | UppyFile | undefined) => void,
  onUpload?: UploadCallback
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
}: ConfigureUppyArgs) => {
  const uppy = new Uppy({
    restrictions: { maxNumberOfFiles: FILE_UPLOAD_MAX_FILES },
    autoProceed: true,
  });

  uppy.use(XHRUpload, {
    endpoint: `${apiHost}/${API_ROUTES.buildUploadFilesRoute(itemId)}`,
    withCredentials: true,
    formData: true,
    allowedMetaFields: [],
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

  if (onUpload) {
    uppy.on('upload', onUpload);
  }

  if (onProgress) {
    uppy.on('progress', onProgress);
  }

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
