import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { Tooltip, makeStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import { SettingsModalContext } from '../context/SettingsModalContext';

// import { connect } from 'react-redux';
// import { withTranslation } from 'react-i18next';
// import { closeSettings, patchAppInstance } from '../../../actions';

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
  },
  button: {
    margin: theme.spacing.unit,
  },
}));

const SettingsButton = ({ item }) => {
  // const { open } = this.props;
  const { t } = useTranslation();
  const { openModal } = useContext(SettingsModalContext);
  const handleEdit = () => {
    openModal(item);
  };

  return (
    <Tooltip title={t('Edit')}>
      <IconButton aria-label="edit" onClick={handleEdit}>
        <EditIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

SettingsButton.propTypes = {
  item: PropTypes.shape({}).isRequired,
};

export default withStyles(useStyles)(SettingsButton);
