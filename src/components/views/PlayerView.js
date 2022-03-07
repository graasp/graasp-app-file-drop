import React, { useContext } from 'react';
import Header from '../layout/Header';
import { Context } from '../context/ContextContext';
import AppDataTable from '../common/AppDataTable';
import { PERMISSION_LEVELS } from '../../config/constants';

const PlayerView = () => {
  const context = useContext(Context);
  const standalone = context?.get('standalone');
  const settings = context.get('settings');
  const header = settings?.headerVisible || standalone ? <Header /> : null;
  switch (context.get('permission')) {
    case PERMISSION_LEVELS.ADMIN:
    case PERMISSION_LEVELS.WRITE:
      return (
        <>
          {header}
          <AppDataTable showMember />
        </>
      );
    case PERMISSION_LEVELS.READ:
    default:
      return (
        <>
          {header}
          <AppDataTable showMember={false} />
        </>
      );
  }
};

export default PlayerView;
