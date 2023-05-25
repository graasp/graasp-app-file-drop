import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { TABLE_CELL_FILE_ACTION_DELETE_CYPRESS } from '../../config/selectors';
import DeleteAppDataDialog from '../main/DeleteAppDataDialog';
import { AppDataRecord } from '@graasp/sdk/frontend';

type Props = {
  data: AppDataRecord;
};

const DeleteAppDataButton = ({ data }: Props): JSX.Element => {
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

export default DeleteAppDataButton;
