import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { Tooltip, makeStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { SettingsModalContext } from '../context/SettingsModalContext';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: theme.spacing(50),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: 'none',
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const SettingsButton = ({ item }) => {
  const { t } = useTranslation();
  const { openModal } = useContext(SettingsModalContext);
  const handleEdit = () => {
    openModal(item);
  };

  return (
    <Tooltip title={t('Edit')}>
      <IconButton aria-label="edit" onClick={handleEdit} />
    </Tooltip>
  );
};

SettingsButton.propTypes = {
  item: PropTypes.shape({}).isRequired,
};

export default withStyles(useStyles)(SettingsButton);
