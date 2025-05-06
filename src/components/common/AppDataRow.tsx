import { useTranslation } from 'react-i18next';

import Visibility from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';

import { useLocalContext } from '@graasp/apps-query-client';
import {
  AppDataVisibility,
  Member,
  PermissionLevel,
  PermissionLevelCompare,
} from '@graasp/sdk';

import {
  TABLE_CELL_FILE_CREATED_AT_CYPRESS,
  TABLE_CELL_FILE_NAME_CYPRESS,
  TABLE_CELL_FILE_USER_CYPRESS,
  buildTableRowId,
} from '../../config/selectors';
import { AppDataFile } from '../../types/appData';
import DeleteAppDataButton from './DeleteAppDataButton';
import FileDownloadButton from './FileDownloadButton';

interface AppDataRowProps {
  data: AppDataFile;
  showMember: boolean;
  member?: Member;
}

const AppDataRow = ({
  data,
  showMember,
  member,
}: AppDataRowProps): JSX.Element => {
  const { t } = useTranslation();
  const context = useLocalContext();
  const { permission, accountId } = context;
  const {
    account: { id: dataMemberId },
    visibility,
  } = data;

  const username = member?.name ?? t('Anonymous');

  const renderActions = (): JSX.Element[] => {
    const actions: JSX.Element[] = [];
    // show if app data is from authenticated member
    // or if has at least write permission
    if (
      dataMemberId === accountId ||
      PermissionLevelCompare.gte(permission, PermissionLevel.Write)
    ) {
      actions.push(<FileDownloadButton data={data} key="download" />);
      actions.push(<DeleteAppDataButton data={data} key="delete" />);
    }
    if (visibility === AppDataVisibility.Item) {
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

  const filename: string = data.data?.file?.name ?? t('Unknown');

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
