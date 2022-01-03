import React, { useContext } from 'react';
import { DASHBOARD_VIEW, DEFAULT_VIEW } from '../../../config/views';
import { AppDataContext } from '../../context/AppDataContext';
import Header from '../../layout/Header';
import TeacherAppResources from './TeacherAppResources';

const TeacherMode = () => {
  const context = useContext(AppDataContext);
  const { view } = context;
  switch (view) {
    case DASHBOARD_VIEW:
    case DEFAULT_VIEW:
    default:
      return (
        <>
          <Header />
          <TeacherAppResources />
        </>
      );
  }
};

export default TeacherMode;
