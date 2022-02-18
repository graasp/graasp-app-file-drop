import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import DeleteResourceDialog from '../main/DeleteResourceDialog';
import { TABLE_CELL_FILE_ACTION_DELETE } from '../../constants/selectors';

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
        data-cy={TABLE_CELL_FILE_ACTION_DELETE}
        color="primary"
        onClick={handleClickOpen}
      >
        <DeleteIcon />
      </IconButton>
      <DeleteResourceDialog
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
