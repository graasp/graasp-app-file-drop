import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDownloadButton from './FileDownloadButton';
import DeleteAppDataButton from './DeleteAppDataButton';
import {
  buildTableRowId,
  TABLE_CELL_FILE_CREATED_AT_CYPRESS,
  TABLE_CELL_FILE_NAME_CYPRESS,
  TABLE_CELL_FILE_USER_CYPRESS,
} from '../../config/selectors';
import { useLocalContext } from '@graasp/apps-query-client';
import { AppDataVisibility, PermissionLevel } from '@graasp/sdk';
import { AppDataRecord } from '@graasp/sdk/frontend';

type Props = {
  data: AppDataRecord;
  showMember?: boolean;
};

const AppDataRow = ({ data, showMember = false }: Props): JSX.Element => {
  const { t } = useTranslation();
  const context = useLocalContext();
  const memberId = context.get('memberId');
  const permission = context.get('permission');

  const renderUsername = () => {
    return data.member?.name || t('Anonymous');
  };

  const renderActions = () => {
    const { visibility } = data;
    const actions = [];
    // show if app data is from authenticated member
    // or if has at least write permission
    if (
      data.member.id === memberId ||
      [PermissionLevel.Write, PermissionLevel.Admin].includes(permission)
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
            <IconButton color="primary">
              <VisibilityIcon />
            </IconButton>
          </span>
        </Tooltip>,
      );
    }
    return actions;
  };

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
        {/* TODO: use graasp sdk */}
        {
          (
            data.data?.toJS() as {
              s3File: {
                name: string;
              };
            }
          )?.s3File?.name
        }
      </TableCell>
      <TableCell>{renderActions()}</TableCell>
    </TableRow>
  );
};

export default AppDataRow;
