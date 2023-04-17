import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { useTranslation } from 'react-i18next';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { VISIBILITIES } from '../../config/settings';
import { Context } from '../context/ContextContext';
import { PERMISSION_LEVELS } from '../../config/constants';
import FileDownloadButton from './FileDownloadButton';
import DeleteAppDataButton from './DeleteAppDataButton';
import {
  buildTableRowId,
  TABLE_CELL_FILE_CREATED_AT_CYPRESS,
  TABLE_CELL_FILE_NAME_CYPRESS,
  TABLE_CELL_FILE_USER_CYPRESS,
} from '../../config/selectors';

const AppDataRow = ({ data, showMember }) => {
  const { t } = useTranslation();
  const context = useContext(Context);
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
      [PERMISSION_LEVELS.WRITE, PERMISSION_LEVELS.ADMIN].includes(permission)
    ) {
      actions.push(<FileDownloadButton data={data} key="download" />);
      actions.push(<DeleteAppDataButton data={data} key="delete" />);
    }
    if (visibility === VISIBILITIES.ITEM) {
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
        {data.data?.s3File?.name}
      </TableCell>
      <TableCell>{renderActions()}</TableCell>
    </TableRow>
  );
};

AppDataRow.propTypes = {
  showMember: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    id: PropTypes.string,
    item: {
      id: PropTypes.string,
    },
    member: { id: PropTypes.string },
    type: PropTypes.string,
    visibility: PropTypes.string,
    createdAt: PropTypes.number,
    creator: PropTypes.string,
    updatedAt: PropTypes.string,
    data: PropTypes.shape({
      s3File: {
        name: PropTypes.string,
      },
    }).isRequired,
  }).isRequired,
};

AppDataRow.defaultProps = {
  showMember: false,
};

export default AppDataRow;
