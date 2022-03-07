import React, { useContext } from 'react';
import Header from '../layout/Header';
import { Context } from '../context/ContextContext';
import AppDataTable from '../common/AppDataTable';
import Settings from '../common/Settings';
import { PERMISSION_LEVELS } from '../../config/constants';

const BuilderView = () => {
  const context = useContext(Context);
  switch (context.get('context')) {
    case PERMISSION_LEVELS.ADMIN:
    case PERMISSION_LEVELS.WRITE:
      return (
        <>
          <Header />
          <AppDataTable showMember />
          <Settings />
        </>
      );

    case PERMISSION_LEVELS.READ:
    default:
      return (
        <>
          <Header />
          <AppDataTable showMember={false} />
        </>
      );
  }
};

export default BuilderView;
