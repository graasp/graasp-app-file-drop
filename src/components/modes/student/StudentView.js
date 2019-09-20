import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import Table from '@material-ui/core/Table';
import Tooltip from '@material-ui/core/Tooltip';
import Uploader from '../../common/Uploader';
import { deleteAppInstanceResource } from '../../../actions';
import { deleteFile } from '../../../actions/file';

class StudentView extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    dispatchDeleteAppInstanceResource: PropTypes.func.isRequired,
    dispatchDeleteFile: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      main: PropTypes.string,
      table: PropTypes.string,
    }).isRequired,
    appInstanceResources: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  };

  static styles = theme => ({
    main: {
      textAlign: 'center',
      margin: theme.spacing.unit,
    },
    table: {
      minWidth: 700,
    },
  });

  handleDelete = async ({ id, uri }) => {
    const {
      dispatchDeleteAppInstanceResource,
      dispatchDeleteFile,
    } = this.props;
    try {
      await dispatchDeleteAppInstanceResource(id);
      await dispatchDeleteFile(uri);
    } catch (e) {
      // do something
    }
  };

  renderActions({ visibility, id, uri }) {
    const { t } = this.props;
    if (visibility === 'public') {
      return (
        <Tooltip title={t('This file was uploaded for everyone.')}>
          <div>
            <IconButton color="primary" disabled>
              <VerifiedUserIcon />
            </IconButton>
          </div>
        </Tooltip>
      );
    }
    return (
      <IconButton
        color="primary"
        onClick={() => this.handleDelete({ id, uri })}
      >
        <DeleteIcon />
      </IconButton>
    );
  }

  renderAppInstanceResources() {
    const { appInstanceResources } = this.props;
    // if there are no resources, show an empty table
    if (!appInstanceResources.length) {
      return (
        <TableRow>
          <TableCell colSpan={4}>No App Instance Resources</TableCell>
        </TableRow>
      );
    }
    // map each app instance resource to a row in the table
    return appInstanceResources.map(
      ({ _id: id, data: { name, uri }, visibility, createdAt }) => (
        <TableRow key={id}>
          <TableCell scope="row">{createdAt}</TableCell>
          <TableCell>
            <a href={uri} target="_blank" rel="noopener noreferrer">
              {name}
            </a>
          </TableCell>
          <TableCell>{this.renderActions({ visibility, id, uri })}</TableCell>
        </TableRow>
      ),
    );
  }

  render() {
    const { t, classes } = this.props;
    return (
      <Grid container spacing={0}>
        <Grid item xs={12} className={classes.main}>
          <Uploader />
        </Grid>
        <Grid item xs={12} className={classes.main}>
          <Table className={classes.table} size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('Date')}</TableCell>
                <TableCell>{t('Name')}</TableCell>
                <TableCell>{t('Actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{this.renderAppInstanceResources()}</TableBody>
          </Table>
        </Grid>
      </Grid>
    );
  }
}

const mapDispatchToProps = {
  dispatchDeleteAppInstanceResource: deleteAppInstanceResource,
  dispatchDeleteFile: deleteFile,
};

const StyledComponent = withStyles(StudentView.styles)(StudentView);

const TranslatedComponent = withTranslation()(StyledComponent);

export default connect(
  null,
  mapDispatchToProps,
)(TranslatedComponent);
