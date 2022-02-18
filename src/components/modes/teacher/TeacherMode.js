import React, { useContext } from 'react';
import Header from '../../layout/Header';
import CONTEXTS from '../../../config/contexts';
import { Context } from '../../context/ContextContext';
import AppDataTable from '../../common/AppDataTable';
import Settings from './Settings';

const TeacherMode = () => {
  const context = useContext(Context);
  switch (context.get('context')) {
    case CONTEXTS.ANALYZER:
    case CONTEXTS.PLAYER:
    default:
      return (
        <>
          <Header />
          <AppDataTable showMember />
          <Settings />
        </>
      );
  }
};

export default TeacherMode;
