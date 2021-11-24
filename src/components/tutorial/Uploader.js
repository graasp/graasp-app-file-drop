import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { DragDrop } from '@uppy/react';
import { DEFAULT_VISIBILITY } from '../../config/settings';
import '@uppy/core/dist/style.css';
import '@uppy/drag-drop/dist/style.css';
// import { postAppInstanceResource } from '../../actions';
import configureUppy from '../../utils/uppy';

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

    this.uppy = configureUppy({
      t,
      offline,
      standalone,
      spaceId,
      appInstanceId,
      visibility,
      dispatchPostAppInstanceResource,
      userId,
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

// const mapStateToProps = state => {
//   const {
//     context: { userId, standalone, offline, appInstanceId, spaceId },
//   } = state;
//   return {
//     standalone,
//     offline,
//     userId,
//     spaceId,
//     appInstanceId,
//   };
// };

// const mapDispatchToProps = {
//   dispatchPostAppInstanceResource: postAppInstanceResource,
// };

const TranslatedComponent = withTranslation()(Uploader);

export default connect()(TranslatedComponent);
// mapStateToProps,
// mapDispatchToProps,
