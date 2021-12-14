import React, { useContext, useState } from 'react';
import { useQuery } from 'react-query';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
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
import {
  TABLE_CELL_FILE_NAME,
  TABLE_CELL_FILE_ACTION_DELETE,
  TABLE_CELL_FILE_CREATED_AT,
  // ROW_NO_FILES_UPLOADED_ID,
} from '../../constants/selectors';
import { buildDownloadFileRoute } from '../../api/routes';
import DeleteResourceDialog from './DeleteResourceDialog';

const getUsers = async key => {
  const token = key.queryKey[1];
  const url = `http://localhost:3000/${APP_ITEMS_ENDPOINT}/86a0eed7-70c6-47ba-8584-00c898c0d134/context`;

  // const url = `//${apiHost + SPACES_ENDPOINT}/${spaceId}/${USERS_ENDPOINT}`;

  // const response = await fetch(url, DEFAULT_GET_REQUEST);
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

  // eslint-disable-next-line no-unused-vars
  const anonymousUser = {
    name: 'Anonymous',
  };
  let userObj = anonymousUser;

  function checkToken() {
    let check;
    if (token == null) {
      check = false;
    } else {
      check = true;
    }
    return check;
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
    const actions = [];
    if (resource.memberId === userId) {
      actions.push(
        <>
          <IconButton
            data-cy={TABLE_CELL_FILE_ACTION_DELETE}
            color="primary"
            // onClick={() => handleDelete({ id, uri })}
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
      );
    }
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
      <TableCell scope="row" data-cy={TABLE_CELL_FILE_CREATED_AT}>
        {resource.createdAt && new Date(resource.createdAt).toLocaleString()}
      </TableCell>
      {/* <TableCell>{userObj.name || 'Anonymous'}</TableCell> */}
      <TableCell>
        <a
          data-cy={TABLE_CELL_FILE_NAME}
          href={buildDownloadFileRoute(resource.id)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {resource.data.name}
        </a>
      </TableCell>
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
