import { Member as MemberAppsQueryClient } from '@graasp/apps-query-client';

export type Member = MemberAppsQueryClient & {
  color: string;
};
