import React, { useContext } from 'react';
import { DEFAULT_VIEW, FEEDBACK_VIEW } from '../../config/views';
// import Loader from '../common/Loader';
import Header from '../layout/Header';
import StudentAppResources from './StudentAppResources';
import { AppDataContext } from '../context/AppDataContext';

const StudentMode = () => {
  const context = useContext(AppDataContext);
  const { view, headerVisible, standalone } = context;
  switch (view) {
    case FEEDBACK_VIEW:
    case DEFAULT_VIEW:
    default:
      return (
        <>
          {headerVisible || standalone ? <Header /> : null}
          <StudentAppResources />
        </>
      );
  }
};

export default StudentMode;
