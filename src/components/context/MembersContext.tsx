import { List } from 'immutable';

import React, { FC, ReactElement, createContext, useMemo } from 'react';

import { Member } from '@graasp/apps-query-client';
import { Loader } from '@graasp/ui';

import { hooks } from '../../config/queryClient';

export type MembersContextType = List<Member>;

const defaultContextValue = List<Member>();
const MembersContext = createContext<MembersContextType>(defaultContextValue);

type Prop = {
  children: ReactElement | ReactElement[];
};

export const MembersProvider: FC<Prop> = ({ children }) => {
  const appContext = hooks.useAppContext();

  const members = useMemo(() => {
    const updatedMembers = List(appContext.data?.get('members'));

    return updatedMembers ?? defaultContextValue;
  }, [appContext.data]);

  if (appContext.isLoading) {
    return <Loader />;
  }

  return (
    <MembersContext.Provider value={members}>
      {children}
    </MembersContext.Provider>
  );
};

export const useMembersContext = (): MembersContextType =>
  React.useContext<MembersContextType>(MembersContext);
