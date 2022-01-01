import React, { useContext, useState } from 'react';
import { useQuery } from 'react-query';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Tooltip from '@material-ui/core/Tooltip';
import VisibilityIcon from '@material-ui/icons/Visibility';
// import { actions } from 'react-redux-toastr';
import { PUBLIC_VISIBILITY } from '../../config/settings';
import {
  APP_ITEMS_ENDPOINT,
  DEFAULT_GET_REQUEST,
  // SPACES_ENDPOINT,
  // USERS_ENDPOINT,
} from '../../config/api';
import { AppDataContext } from '../context/AppDataContext';
import { buildDownloadFileRoute } from '../../api/routes';
import { TABLE_CELL_FILE_ACTION_DELETE } from '../../constants/selectors';
import DeleteResourceDialog from './DeleteResourceDialog';

const getUsers = async key => {
  const token = key.queryKey[1];
  const url = `http://localhost:3000/${APP_ITEMS_ENDPOINT}/86a0eed7-70c6-47ba-8584-00c898c0d134/context`;
  const response = await fetch(url, {
    ...DEFAULT_GET_REQUEST,
    headers: {
      ...DEFAULT_GET_REQUEST.headers,
      Authorization: `Bearer ${token}`,
    },
  });
  const users = (await response.json())?.members;
  return users;
};

const Resource = ({ resource }) => {
  const { userId, token } = useContext(AppDataContext);
  console.log('userId');
  console.log(userId);
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
    // console.log('-------download');
    // setDownloader(true);
    const url = buildDownloadFileRoute(resource.id);
    // eslint-disable-next-line no-unused-vars
    downloadFile(url).then(async response => {
      console.log('response');
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

  function checkToken() {
    if (token == null) {
      return false;
    }
    return true;
  }
  const { data, status } = useQuery(['users', token], getUsers, {
    enabled: checkToken(),
  });
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
      <TableCell>
        {renderActions(
          resource.visibility,
          resource.id,
          // resource.data.data.uri,
        )}
      </TableCell>
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
