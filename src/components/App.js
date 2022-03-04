import React, { useContext } from 'react';
import TeacherMode from './modes/teacher/TeacherMode';
import StudentMode from './modes/student/StudentMode';
import ModalProviders from './context/ModalProviders';
import { DEFAULT_PERMISSION, PERMISSION_LEVELS } from '../config/constants';
import { Context } from './context/ContextContext';
import { TokenProvider } from './context/TokenContext';

const App = () => {
  const context = useContext(Context);

  const renderContent = () => {
    switch (context?.get('permission', DEFAULT_PERMISSION)) {
      case PERMISSION_LEVELS.WRITE:
      case PERMISSION_LEVELS.ADMIN:
        return (
          <ModalProviders>
            <TeacherMode />
          </ModalProviders>
        );

      case PERMISSION_LEVELS.READ:
      default:
        return (
          <ModalProviders>
            <StudentMode />
          </ModalProviders>
        );
    }
  };

  return <TokenProvider>{renderContent()}</TokenProvider>;
};
export default App;
