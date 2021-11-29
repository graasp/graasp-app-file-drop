import React, { useContext } from 'react';
// import ModalProviders from './context/ModalProviders';
// import Tutorial from './tutorial/Tutorial';
import TeacherMode from './tutorial/TeacherMode';
import StudentMode from './tutorial/StudentMode';
import { AppDataContext } from './context/AppDataContext';

// import { GRAASP_APP_ID } from '../config/settings';

// import { connect } from 'react-redux';
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// import { withTranslation } from 'react-i18next';
// import PropTypes from 'prop-types';
// import {
//   ITEMS_PATH
// } from '../config/paths';
// import Home from './main/Home';
// import { getContext, getAuthToken } from '../actions';
// import { DEFAULT_LANG, DEFAULT_MODE } from '../config/settings';
// import { DEFAULT_VIEW } from '../config/views';
// import TeacherMode from './modes/teacher/TeacherMode';
// // import TeacherMode2 from './modes/teacher/TeacherMode2';
// import Loader from './common/Loader';
// import USER_TYPES from '../config/userTypes';
// import Authorization from './common/Authorization';

// const postMessage = data => {
//   const message = JSON.stringify(data);
//   if (window.parent.postMessage) {
//     window.parent.postMessage(message, '*');
//   } else {
//     // console.error('unable to find postMessage');
//   }
// };

// eslint-disable-next-line react/prefer-stateless-function
const App = () => {
  const context = useContext(AppDataContext);
  console.log(context);
  const { mode, view } = context; // function checkToken() {
  //   let check;
  //   if (context.token == null) {
  //     check = false;
  //   } else {
  //     check = true;
  //   }
  //   return check;
  // }

  switch (mode) {
    // show teacher view when in producer (educator) mode
    case 'teacher':
    case 'producer':
    case 'educator':
    case 'admin':
      // unless the user is a viewer
      // if (userType === USER_TYPES.VIEWER) {
      //   // return <StudentMode />;
      // }
      return <TeacherMode view={view} />;

    // by default go with the consumer (learner) mode
    case 'student':
    case 'consumer':
    case 'learner':
    default:
      return <StudentMode />;
  }
  // return (
  //   // <ModalProviders>
  //   <TeacherMode />
  //   // </ModalProviders>
  // );
};
export default App;
// export default withTranslation()(ConnectedApp);

// export class App extends Component {
//   static propTypes = {
//     i18n: PropTypes.shape({
//       defaultNS: PropTypes.string,
//       changeLanguage: PropTypes.func,
//     }).isRequired,
//     dispatchGetContext: PropTypes.func.isRequired,
//     // dispatchGetAppInstance: PropTypes.func.isRequired,
//     dispatchGetAuthToken: PropTypes.func.isRequired,
//     // appInstanceId: PropTypes.string,
//     lang: PropTypes.string,
//     mode: PropTypes.string,
//     view: PropTypes.string,
//     userType: PropTypes.string,
//     ready: PropTypes.bool.isRequired,
//     standalone: PropTypes.bool.isRequired,
//     contextIsLoading: PropTypes.bool.isRequired,
//   };

//   static defaultProps = {
//     lang: DEFAULT_LANG,
//     mode: DEFAULT_MODE,
//     view: DEFAULT_VIEW,
//     // appInstanceId: null,
//     userType: null,
//   };

//   constructor(props) {
//     super(props);
//     // first thing to do is get the context
//     props.dispatchGetContext();
//     // then get the app instance
//     // props.dispatchGetAppInstance();
//   }

//   componentDidMount() {
//     const { lang, ready, dispatchGetAuthToken, contextIsLoading } = this.props;
//     // set the language on first load
//     this.handleChangeLang(lang);

//     if (!contextIsLoading) {
//       dispatchGetAuthToken();
//     }

//     if (ready) {
//       // dispatchGetAppInstance();
//     }
//   }

//   // componentDidUpdate({ lang: prevLang, appInstanceId: prevAppInstanceId }) {
//   componentDidUpdate({ lang: prevLang, ready: prevReady }) {
//     const {
//       lang,
//       // appInstanceId,
//       // dispatchGetAppInstance,
//       contextIsLoading,
//       dispatchGetAuthToken,
//       ready,
//     } = this.props;

//     // handle a change of language
//     if (lang !== prevLang) {
//       this.handleChangeLang(lang);
//     }

//     // get item context
//     if (!contextIsLoading && !ready) {
//       dispatchGetAuthToken();
//     }

//     // handle receiving the app instance id
//     // if (appInstanceId !== prevAppInstanceId) {
//     //   dispatchGetAppInstance();
//     // }
//     if (ready && ready !== prevReady) {
//       // dispatchGetAppInstance();
//     }
//   }

//   handleChangeLang = lang => {
//     const { i18n } = this.props;
//     i18n.changeLanguage(lang);
//   };

//   render() {
//     const { mode, view, ready, standalone, userType } = this.props;

//     if (!standalone && !ready) {
//       return <Loader />;
//     }

//     switch (mode) {
//       // show teacher view when in producer (educator) mode
//       case 'teacher':
//       case 'producer':
//       case 'educator':
//       case 'admin':
//         // unless the user is a viewer
//         if (userType === USER_TYPES.VIEWER) {
//           // return <StudentMode />;
//         }
//         return (
//           <ModalProviders>
//             <Router>
//               <Switch>
//                 <Route path={ITEMS_PATH} exact component={Authorization()(Home)} />
//                 <TeacherMode view={view} />
//               </Switch>
//             </Router>
//           </ModalProviders>
//         );

//       // by default go with the consumer (learner) mode
//       case 'student':
//       case 'consumer':
//       case 'learner':
//       default:
//         return <StudentMode />;
//     }
//   }
// }

// const mapStateToProps = ({ context }) => ({
//   // headerVisible: appInstance.content.settings.headerVisible,
//   standalone: context.standalone,
//   lang: context.lang,
//   mode: context.mode,
//   view: context.view,
//   userType: context.userType,
//   ready: Boolean(context.token),
//   contextIsLoading: Boolean(context.activity.length),
// });

// const mapDispatchToProps = {
//   dispatchGetContext: getContext,
//   // dispatchGetAppInstance: getAppInstance,
//   dispatchGetAuthToken: getAuthToken,
// };

// const ConnectedApp = connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )(App);
