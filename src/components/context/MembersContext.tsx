import React, { createContext, useMemo } from 'react';

import { CircularProgress } from '@mui/material';

import { Member } from '@graasp/sdk';

import { hooks } from '../../config/queryClient';

const defaultContextValue: Member[] = [];
const MembersContext = createContext(defaultContextValue);

export const MembersProvider = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const appContext = hooks.useAppContext();

  const members = useMemo(() => {
    const updatedMembers = appContext.data?.members;

    return updatedMembers ?? defaultContextValue;
  }, [appContext.data]);

  if (appContext.isLoading) {
    return <CircularProgress />;
  }

  return (
    <MembersContext.Provider value={members}>
      {children}
    </MembersContext.Provider>
  );
};

export const useMembersContext = (): Member[] =>
  React.useContext(MembersContext);
