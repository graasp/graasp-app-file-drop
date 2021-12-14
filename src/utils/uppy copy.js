import Uppy from '@uppy/core';

// import AwsS3 from '@uppy/aws-s3';
import XHRUpload from '@uppy/xhr-upload';
// import { API_ROUTES } from '@graasp/query-client';
import { API_HOST, FILE_UPLOAD_MAX_FILES } from '../config/constants';
import { UPLOAD_FILES_METHODS } from '../enums';
// import { uploadItemToS3 } from '../api/item';
// import { DEFAULT_PUT } from '../api/utils';
import { APP_ITEMS_ENDPOINT } from '../config/api';

const configureUppy = ({
  itemId,
  token,
  onComplete,
  onProgress,
  // onUpload,
  // onFilesAdded,
  onError,
  method = UPLOAD_FILES_METHODS.DEFAULT,
}) => {
  const uppy = new Uppy({
    restrictions: { maxNumberOfFiles: FILE_UPLOAD_MAX_FILES },
    autoProceed: true,
  });

  uppy.use(XHRUpload, {
    // endpoint: `${API_HOST}/${API_ROUTES.buildUploadFilesRoute(itemId)}`,
    endpoint: `${API_HOST}/${APP_ITEMS_ENDPOINT}/upload?id=${itemId}`,
    withCredentials: true,
    formData: true,
    metaFields: [],
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const onUpload = () => {
    switch (method) {
      case UPLOAD_FILES_METHODS.S3:
        break;

      case UPLOAD_FILES_METHODS.DEFAULT:
      default:
        console.log(`${API_HOST}/${APP_ITEMS_ENDPOINT}/upload?id=${itemId}`);
        break;
    }
  };

  const onFilesAdded = () => {
    console.log('onFilesAdded');
  };

  // define upload method

  uppy.on('file-added', () => {
    console.log('-------iuyhfg');
  });
  uppy.on('files-added', onFilesAdded);

  uppy.on('upload', onUpload);

  uppy.on('progress', onProgress);

  uppy.on('complete', result => {
    onComplete?.(result);
  });

  uppy.on('error', error => {
    onError?.(error);
  });

  uppy.on('upload-error', error => {
    onError?.(error);
  });

  console.log('--------uppy copy');
  console.log(uppy);
  return uppy;
};

export default configureUppy;
