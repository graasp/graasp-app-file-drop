import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { getContext, getAuthToken } from '../actions';
import { DEFAULT_LANG, DEFAULT_MODE } from '../config/settings';
import { DEFAULT_VIEW } from '../config/views';
import TeacherMode from './modes/teacher/TeacherMode';
import Loader from './common/Loader';
import StudentMode from './modes/student/StudentMode';
import USER_TYPES from '../config/userTypes';

export class App extends Component {
  static propTypes = {
    i18n: PropTypes.shape({
      defaultNS: PropTypes.string,
      changeLanguage: PropTypes.func,
    }).isRequired,
    dispatchGetContext: PropTypes.func.isRequired,
    // dispatchGetAppInstance: PropTypes.func.isRequired,
    dispatchGetAuthToken: PropTypes.func.isRequired,
    // appInstanceId: PropTypes.string,
    lang: PropTypes.string,
    mode: PropTypes.string,
    view: PropTypes.string,
    userType: PropTypes.string,
    ready: PropTypes.bool.isRequired,
    standalone: PropTypes.bool.isRequired,
    contextIsLoading: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    lang: DEFAULT_LANG,
    mode: DEFAULT_MODE,
    view: DEFAULT_VIEW,
    // appInstanceId: null,
    userType: null,
  };

  constructor(props) {
    super(props);
    // first thing to do is get the context
    props.dispatchGetContext();
    // then get the app instance
    // props.dispatchGetAppInstance();
  }

  componentDidMount() {
    const { lang, ready, dispatchGetAuthToken, contextIsLoading } = this.props;
    // set the language on first load
    this.handleChangeLang(lang);

    if (!contextIsLoading) {
      dispatchGetAuthToken();
    }

    if (ready) {
      // dispatchGetAppInstance();
    }
  }

  // componentDidUpdate({ lang: prevLang, appInstanceId: prevAppInstanceId }) {
  componentDidUpdate({ lang: prevLang, ready: prevReady }) {
    const {
      lang,
      // appInstanceId,
      // dispatchGetAppInstance,
      contextIsLoading,
      dispatchGetAuthToken,
      ready,
    } = this.props;

    // handle a change of language
    if (lang !== prevLang) {
      this.handleChangeLang(lang);
    }

    // get item context
    if (!contextIsLoading && !ready) {
      dispatchGetAuthToken();
    }

    // handle receiving the app instance id
    // if (appInstanceId !== prevAppInstanceId) {
    //   dispatchGetAppInstance();
    // }
    if (ready && ready !== prevReady) {
      // dispatchGetAppInstance();
    }
  }

  handleChangeLang = lang => {
    const { i18n } = this.props;
    i18n.changeLanguage(lang);
  };

  render() {
    const { mode, view, ready, standalone, userType } = this.props;

    if (!standalone && !ready) {
      return <Loader />;
    }

    switch (mode) {
      // show teacher view when in producer (educator) mode
      case 'teacher':
      case 'producer':
      case 'educator':
      case 'admin':
        // unless the user is a viewer
        if (userType === USER_TYPES.VIEWER) {
          return <StudentMode />;
        }
        return <TeacherMode view={view} />;

      // by default go with the consumer (learner) mode
      case 'student':
      case 'consumer':
      case 'learner':
      default:
        return <StudentMode />;
    }
  }
}

const mapStateToProps = ({ context, appInstance }) => ({
  headerVisible: appInstance.content.settings.headerVisible,
  standalone: context.standalone,
  lang: context.lang,
  mode: context.mode,
  view: context.view,
  userType: context.userType,
  ready: Boolean(context.token),
  contextIsLoading: Boolean(context.activity.length),
});

const mapDispatchToProps = {
  dispatchGetContext: getContext,
  // dispatchGetAppInstance: getAppInstance,
  dispatchGetAuthToken: getAuthToken,
};

const ConnectedApp = connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

export default withTranslation()(ConnectedApp);
