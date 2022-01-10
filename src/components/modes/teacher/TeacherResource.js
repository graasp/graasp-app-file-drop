import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Tooltip from '@material-ui/core/Tooltip';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { PUBLIC_VISIBILITY } from '../../../config/settings';
import { AppDataContext } from '../../context/AppDataContext';
import { buildDownloadFileRoute } from '../../../api/routes';
import { TABLE_CELL_FILE_ACTION_DELETE } from '../../../constants/selectors';
import DeleteResourceDialog from '../../main/DeleteResourceDialog';
import { useGetUsers } from '../../../api/hooks';

const Resource = ({ resource }) => {
  const { token, apiHost, itemId } = useContext(AppDataContext);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const downloadFile = url => {
    const response = fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  };
  const handleOpenDownloader = () => {
    const url = `${apiHost}/${buildDownloadFileRoute(resource.id)}`;
    // eslint-disable-next-line no-unused-vars
    downloadFile(url).then(async response => {
      const blob = new Blob([await response.blob()], {
        type: response.headers.get('Content-Type'),
      });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${resource.data.name}`;
      link.click();
    });
  };
  // eslint-disable-next-line no-unused-vars
  const anonymousUser = {
    name: 'Anonymous',
  };
  let userObj = anonymousUser;

  const { data, status } = useGetUsers(token, apiHost, itemId);

  if (status === 'success') {
    const members = data;
    // eslint-disable-next-line no-unused-vars
    userObj =
      members.find(member => member.id === resource.memberId) || anonymousUser;
  }

  // eslint-disable-next-line no-unused-vars
  function renderActions(visibility, id, uri) {
    const actions = [
      <>
        <IconButton color="primary" onClick={handleOpenDownloader}>
          <ArrowDownward />
        </IconButton>
        <IconButton
          data-cy={TABLE_CELL_FILE_ACTION_DELETE}
          color="primary"
          onClick={handleClickOpen}
        >
          <DeleteIcon />
        </IconButton>
        <DeleteResourceDialog
          open={open}
          handleClose={handleClose}
          resourceId={resource.id}
        />
      </>,
    ];
    if (visibility === PUBLIC_VISIBILITY) {
      actions.push(
        <Tooltip key="visibility" title="This file was uploaded for everyone.">
          <span>
            <IconButton color="primary">
              <VisibilityIcon />
            </IconButton>
          </span>
        </Tooltip>,
      );
    }
    return actions;
  }

  return (
    <TableRow key={resource.id}>
      <TableCell scope="row">
        {resource.createdAt && new Date(resource.createdAt).toLocaleString()}
      </TableCell>
      <TableCell>{userObj.name || 'Anonymous'}</TableCell>
      <TableCell>{resource.data.name}</TableCell>
      <TableCell>{renderActions(resource.visibility, resource.id)}</TableCell>
    </TableRow>
  );
};

Resource.propTypes = {
  resource: PropTypes.shape({
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

export default Resource;
