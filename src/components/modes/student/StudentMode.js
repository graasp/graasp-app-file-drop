import React, { useContext } from 'react';
import Header from '../../layout/Header';
import { Context } from '../../context/ContextContext';
import CONTEXTS from '../../../config/contexts';
import AppDataTable from '../../common/AppDataTable';

const StudentMode = () => {
  const context = useContext(Context);
  const standalone = context?.get('standalone');
  const settings = context.get('settings');
  switch (context.get('context')) {
    case CONTEXTS.PLAYER:
    default:
      return (
        <>
          {settings?.headerVisible || standalone ? <Header /> : null}
          <AppDataTable showMember={false} />
        </>
      );
  }
};

export default StudentMode;
