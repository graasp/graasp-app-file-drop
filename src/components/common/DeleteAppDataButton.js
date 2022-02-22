import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { TABLE_CELL_FILE_ACTION_DELETE_CYPRESS } from '../../config/selectors';
import DeleteAppDataDialog from '../main/DeleteAppDataDialog';

const DeleteAppDataButton = ({ data }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton
        data-cy={TABLE_CELL_FILE_ACTION_DELETE_CYPRESS}
        color="primary"
        onClick={handleClickOpen}
      >
        <DeleteIcon />
      </IconButton>
      <DeleteAppDataDialog
        open={open}
        handleClose={handleClose}
        appDataId={data.id}
      />
    </>
  );
};

DeleteAppDataButton.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default DeleteAppDataButton;
