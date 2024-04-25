import React, { FC, useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

import { AppData } from '@graasp/sdk';

import { TABLE_CELL_FILE_ACTION_DELETE_CYPRESS } from '../../config/selectors';
import DeleteAppDataDialog from '../main/DeleteAppDataDialog';

interface DeleteAppDataButtonProps {
  data: {
    id: AppData['id'];
  };
}

const DeleteAppDataButton: FC<DeleteAppDataButtonProps> = ({ data }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <IconButton
        data-cy={TABLE_CELL_FILE_ACTION_DELETE_CYPRESS}
        color="primary"
        onClick={handleClickOpen}
        size="large"
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

export default DeleteAppDataButton;
