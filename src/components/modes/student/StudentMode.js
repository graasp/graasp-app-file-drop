import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import StudentView from './StudentView';
import { DEFAULT_VIEW, FEEDBACK_VIEW } from '../../../config/views';
import { getAppInstanceResources } from '../../../actions';
import Loader from '../../common/Loader';
import Header from '../../layout/Header';

class StudentMode extends Component {
  static propTypes = {
    appInstanceId: PropTypes.string,
    view: PropTypes.string,
    activity: PropTypes.number,
    dispatchGetAppInstanceResources: PropTypes.func.isRequired,
    userId: PropTypes.string,
    appInstanceResources: PropTypes.arrayOf(
      PropTypes.shape({
        // we need to specify number to avoid warnings with local server
        _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        appInstanceId: PropTypes.string,
        // data: PropTypes.objectOf(PropTypes.object()),
        data: PropTypes.oneOfType([PropTypes.object]).isRequired,
      }),
    ),
    headerVisible: PropTypes.bool.isRequired,
    standalone: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    view: 'normal',
    appInstanceId: null,
    activity: 0,
    userId: null,
    appInstanceResources: [],
  };

  constructor(props) {
    super(props);
    const { userId } = props;

    // get the resources for this user
    props.dispatchGetAppInstanceResources({ userId });
  }

  componentDidUpdate({ appInstanceId: prevAppInstanceId }) {
    const {
      appInstanceId,
      dispatchGetAppInstanceResources,
      userId,
    } = this.props;
    // handle receiving the app instance id
    if (appInstanceId !== prevAppInstanceId) {
      dispatchGetAppInstanceResources({ userId });
    }
  }

  render() {
    const {
      view,
      activity,
      appInstanceResources,
      headerVisible,
      standalone,
    } = this.props;
    if (activity) {
      return <Loader />;
    }
    switch (view) {
      case FEEDBACK_VIEW:
      case DEFAULT_VIEW:
      default:
        return (
          <>
            {headerVisible || standalone ? <Header /> : null}
            <StudentView appInstanceResources={appInstanceResources} />
          </>
        );
    }
  }
}
const mapStateToProps = ({ context, appInstance, appInstanceResources }) => {
  const { userId, appInstanceId } = context;
  return {
    userId,
    appInstanceId,
    activity: appInstanceResources.activity.length,
    appInstanceResources: _.sortBy(appInstanceResources.content, [
      'createdAt',
    ]).reverse(),
    headerVisible: appInstance.content.settings.headerVisible,
    standalone: context.standalone,
  };
};

const mapDispatchToProps = {
  dispatchGetAppInstanceResources: getAppInstanceResources,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(StudentMode);

export default ConnectedComponent;
