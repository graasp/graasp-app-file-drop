import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useLocalContext } from '@graasp/apps-query-client';
import {
  AppData,
  Member,
  PermissionLevel,
  PermissionLevelCompare,
} from '@graasp/sdk';

import Visibility from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';

import {
  TABLE_CELL_FILE_CREATED_AT_CYPRESS,
  TABLE_CELL_FILE_NAME_CYPRESS,
  TABLE_CELL_FILE_USER_CYPRESS,
  buildTableRowId,
} from '../../config/selectors';
import { AppDataVisibility } from '../../types/appData';
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
  const {
    member: { id: dataMemberId },
    visibility,
  } = data;

  const username = member?.name || t('Anonymous');

  const renderActions = (): JSX.Element[] => {
    // const { visibility } = data;
    const actions: JSX.Element[] = [];
    // show if app data is from authenticated member
    // or if has at least write permission
    if (
      dataMemberId === memberId ||
      PermissionLevelCompare.gte(
        permission as PermissionLevel,
        PermissionLevel.Write,
      )
    ) {
      actions.push(<FileDownloadButton data={data} key="download" />);
      actions.push(<DeleteAppDataButton data={data} key="delete" />);
    }
    if (visibility === AppDataVisibility.ITEM) {
      actions.push(
        <Tooltip
          key="visibility"
          title={t('This file was uploaded for everyone.')}
        >
          <span>
            <IconButton color="primary" size="large">
              <Visibility />
            </IconButton>
          </span>
        </Tooltip>,
      );
    }
    return actions;
  };

  // TODO: find better way to do this...
  const filename: string =
    (data.data as { s3File: { name: string } })?.s3File?.name ?? t('Anonymous');

  return (
    <TableRow id={buildTableRowId(data.id)}>
      <TableCell scope="row" data-cy={TABLE_CELL_FILE_CREATED_AT_CYPRESS}>
        {data.createdAt && new Date(data.createdAt).toLocaleString()}
      </TableCell>
      {showMember && (
        <TableCell data-cy={TABLE_CELL_FILE_USER_CYPRESS}>{username}</TableCell>
      )}
      <TableCell data-cy={TABLE_CELL_FILE_NAME_CYPRESS}>{filename}</TableCell>
      <TableCell>{renderActions()}</TableCell>
    </TableRow>
  );
};

export default AppDataRow;
