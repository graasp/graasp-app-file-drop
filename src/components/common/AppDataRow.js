import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { useTranslation } from 'react-i18next';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { VISIBILITIES } from '../../config/settings';
import { TABLE_CELL_FILE_CREATED_AT } from '../../constants/selectors';
import { Context } from '../context/ContextContext';
import { PERMISSION_LEVELS } from '../../config/constants';
import FileDownloadButton from './FileDownloadButton';
import DeleteAppDataButton from './DeleteAppDataButton';

const AppDataRow = ({ data, showMember, member }) => {
  const { t } = useTranslation();
  const context = useContext(Context);
  const memberId = context.get('memberId');
  const permission = context.get('permission');

  const renderUsername = () => {
    return member?.name || t('Anonymous');
  };

  const renderActions = () => {
    const { visibility } = data;
    const actions = [];
    // show if app data is from authenticated member
    // or if has at least write permission
    if (
      data.memberId === memberId ||
      [PERMISSION_LEVELS.WRITE, PERMISSION_LEVELS.ADMIN].includes(permission)
    ) {
      actions.push(
        <>
          <FileDownloadButton data={data} />
          <DeleteAppDataButton data={data} />
        </>,
      );
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
    <TableRow key={data.id}>
      <TableCell scope="row" data-cy={TABLE_CELL_FILE_CREATED_AT}>
        {data.createdAt && new Date(data.createdAt).toLocaleString()}
      </TableCell>
      {showMember && <TableCell>{renderUsername()}</TableCell>}
      <TableCell>{data.data.name}</TableCell>
      <TableCell>{renderActions()}</TableCell>
    </TableRow>
  );
};

AppDataRow.propTypes = {
  showMember: PropTypes.bool.isRequired,
  member: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    id: PropTypes.string,
    itemId: PropTypes.string,
    memberId: PropTypes.string,
    type: PropTypes.string,
    visibility: PropTypes.string,
    createdAt: PropTypes.string,
    creator: PropTypes.string,
    updatedAt: PropTypes.string,
    data: PropTypes.shape({
      name: PropTypes.string,
      type: PropTypes.string,
      extra: PropTypes.shape({
        file: PropTypes.shape({}).isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

AppDataRow.defaultProps = {
  showMember: false,
  member: null,
};

export default AppDataRow;
