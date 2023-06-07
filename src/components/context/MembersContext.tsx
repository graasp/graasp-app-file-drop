import { List } from 'immutable';

import React, { createContext, useMemo } from 'react';

import { MemberRecord } from '@graasp/sdk/frontend';
import { Loader } from '@graasp/ui';

import { hooks } from '../../config/queryClient';

const defaultContextValue = List<MemberRecord>();
const MembersContext = createContext(defaultContextValue);

export const MembersProvider = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const appContext = hooks.useAppContext();

  const members = useMemo(() => {
    const updatedMembers = appContext.data?.get('members');

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

export const useMembersContext = (): List<MemberRecord> =>
  React.useContext(MembersContext);
