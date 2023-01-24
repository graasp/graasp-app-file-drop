import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { AppData, Member, useLocalContext } from '@graasp/apps-query-client';
import { PermissionLevel } from '@graasp/sdk';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import {
  TABLE_CELL_FILE_CREATED_AT_CYPRESS,
  TABLE_CELL_FILE_NAME_CYPRESS,
  TABLE_CELL_FILE_USER_CYPRESS,
  buildTableRowId,
} from '../../config/selectors';
import DeleteAppDataButton from './DeleteAppDataButton';
import FileDownloadButton from './FileDownloadButton';

interface AppDataRowProps {
  data: AppData;
  showMember: boolean;
  member?: Member;
}

const AppDataRow: FC<AppDataRowProps> = ({ data, showMember, member }) => {
  const { t } = useTranslation();
  const context = useLocalContext();
  const { permission, memberId } = context;

  const username = member?.name || t('Anonymous');

  const renderActions = (): JSX.Element[] => {
    // const { visibility } = data;
    const actions: JSX.Element[] = [];
    // show if app data is from authenticated member
    // or if has at least write permission
    if (
      data.memberId === memberId ||
      [PermissionLevel.Write, PermissionLevel.Admin].includes(
        (permission || PermissionLevel.Read) as PermissionLevel,
      )
    ) {
      actions.push(<FileDownloadButton data={data} key="download" />);
      actions.push(<DeleteAppDataButton data={data} key="delete" />);
    }
    // TODO: fix this after fixing https://github.com/graasp/graasp-apps-query-client/issues/68
    // if (visibility === VISIBILITIES.ITEM) {
    //   actions.push(
    //     <Tooltip
    //       key="visibility"
    //       title={t('This file was uploaded for everyone.')}
    //     >
    //       <span>
    //         <IconButton color="primary" size="large">
    //           <Visibility />
    //         </IconButton>
    //       </span>
    //     </Tooltip>,
    //   );
    // }
    return actions;
  };

  // TODO: find better way to do this...
  const filename: string = (data.data?.name as string) ?? t('Anonymous');

  return (
    <TableRow id={buildTableRowId(data.id)}>
      <TableCell scope="row" data-cy={TABLE_CELL_FILE_CREATED_AT_CYPRESS}>
        {data.createdAt && new Date(data.createdAt).toLocaleString()}
      </TableCell>
      {showMember && (
        <TableCell data-cy={TABLE_CELL_FILE_USER_CYPRESS}>
          {renderUsername()}
        </TableCell>
      )}
      <TableCell data-cy={TABLE_CELL_FILE_NAME_CYPRESS}>
        <p>{filename}</p>
      </TableCell>
      <TableCell>{renderActions()}</TableCell>
    </TableRow>
  );
};

export default AppDataRow;
