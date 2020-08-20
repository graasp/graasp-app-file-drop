import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { DragDrop } from '@uppy/react';
import {
  DEFAULT_VISIBILITY,
  MAX_FILE_SIZE,
  MAX_NUM_FILES,
} from '../../config/settings';
import { FILE_UPLOAD_ENDPOINT } from '../../config/api';
import '@uppy/core/dist/style.css';
import '@uppy/drag-drop/dist/style.css';
import { postAppInstanceResource } from '../../actions';
import { showErrorToast, showWarningToast } from '../../utils/toasts';
import { POST_FILE } from '../../types';
import { postMessage } from '../../actions/common';
import { FILE } from '../../config/appInstanceResourceTypes';

class Uploader extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    dispatchPostAppInstanceResource: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
    visibility: PropTypes.string,
    spaceId: PropTypes.string.isRequired,
    appInstanceId: PropTypes.string.isRequired,
    standalone: PropTypes.bool.isRequired,
    offline: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    visibility: DEFAULT_VISIBILITY,
  };

  constructor(props) {
    super(props);

    const {
      dispatchPostAppInstanceResource,
      userId,
      visibility,
      standalone,
      offline,
      spaceId,
      appInstanceId,
      t,
    } = props;

    this.uppy = Uppy({
      restrictions: {
        maxNumberOfFiles: MAX_NUM_FILES,
        maxFileSize: MAX_FILE_SIZE,
      },
      autoProceed: true,
    });

    // when offline override upload to post corresponding resources
    if (offline) {
      this.uppy.upload = () => {
        const files = this.uppy.getFiles();
        files.forEach(file => {
          const {
            data: { path, name },
          } = file;

          return postMessage({
            type: POST_FILE,
            // the payload will be used in the resulting appInstanceResource
            payload: {
              data: { name, path },
              appInstanceId,
              userId,
              spaceId,
              type: FILE,
              visibility,
            },
          });
        });

        // remove files from stack and cancel upload
        this.uppy.cancelAll();
        return Promise.resolve({ files });
      };
    }

    // endpoint
    this.uppy.use(XHRUpload, {
      // on standalone flag upload should fail
      endpoint: standalone || FILE_UPLOAD_ENDPOINT,
    });

    this.uppy.on('complete', ({ successful }) => {
      successful.forEach(({ response: { body: uri }, name }) => {
        dispatchPostAppInstanceResource({
          data: {
            name,
            uri,
          },
          userId,
          visibility,
        });
      });
    });

    this.uppy.on('error', (file, error) => {
      if (standalone) {
        showWarningToast(
          t('This is just a preview. No files can be uploaded.'),
        );
      } else {
        showErrorToast(error);
      }
    });

    this.uppy.on('upload-error', (file, error, response) => {
      if (standalone) {
        showWarningToast(
          t('This is just a preview. No files can be uploaded.'),
        );
      } else {
        showErrorToast(response);
      }
    });

    this.uppy.on('restriction-failed', (file, error) => {
      if (standalone) {
        showWarningToast(
          t('This is just a preview. No files can be uploaded.'),
        );
      } else {
        showErrorToast(error);
      }
    });
  }

  render() {
    const { t } = this.props;
    return (
      <DragDrop
        uppy={this.uppy}
        locale={{
          strings: {
            dropHereOr: t('Drop Here or Click to Browse'),
          },
        }}
      />
    );
  }
}

const mapStateToProps = state => {
  const {
    context: { userId, standalone, offline, appInstanceId, spaceId },
  } = state;
  return {
    standalone,
    offline,
    userId,
    spaceId,
    appInstanceId,
  };
};

const mapDispatchToProps = {
  dispatchPostAppInstanceResource: postAppInstanceResource,
};

const TranslatedComponent = withTranslation()(Uploader);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TranslatedComponent);
