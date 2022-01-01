import React, { useContext } from 'react';
import TeacherMode from './tutorial/TeacherMode';
import StudentMode from './tutorial/StudentMode';
import { AppDataContext } from './context/AppDataContext';
import ModalProviders from './context/ModalProviders';
import FileUploader from './main/FileUploader';
import Loader from './common/Loader';

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
  const { mode, view, token } = useContext(AppDataContext);

  if (token != null) {
    switch (mode) {
      // show teacher view when in producer (educator) mode
      case 'teacher':
      case 'producer':
      case 'educator':
      case 'admin':
        return (
          <ModalProviders>
            <FileUploader />
            <TeacherMode view={view} />
          </ModalProviders>
        );

      // by default go with the consumer (learner) mode
      case 'student':
      case 'consumer':
      case 'learner':
      default:
        return (
          <ModalProviders>
            <FileUploader />
            <StudentMode />
          </ModalProviders>
        );
    }
  }
  return <Loader />;
};
export default App;
