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
import Paper from '@material-ui/core/Paper';
import Uploader from '../../common/Uploader';
import { deleteFile } from '../../../actions/file';
import {
  DEFAULT_VISIBILITY,
  PUBLIC_VISIBILITY,
} from '../../../config/settings';

class StudentView extends Component {
  static styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      overflowX: 'auto',
    },
    main: {
      textAlign: 'center',
      padding: theme.spacing.unit,
    },
    table: {
      minWidth: 700,
    },
  });

  static propTypes = {
    t: PropTypes.func.isRequired,
    dispatchDeleteFile: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      main: PropTypes.string,
      table: PropTypes.string,
      root: PropTypes.string,
    }).isRequired,
    currentUserId: PropTypes.string.isRequired,
    appInstanceResources: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    visibility: PropTypes.string,
  };

  static defaultProps = {
    visibility: DEFAULT_VISIBILITY,
  };

  handleDelete = async ({ _id, id, uri }) => {
    const { dispatchDeleteFile } = this.props;
    const fileId = _id || id;
    try {
      await dispatchDeleteFile({ id: fileId, uri });
    } catch (e) {
      // do something
    }
  };

  renderActions({ visibility, id, _id, uri, user }) {
    const { t, currentUserId } = this.props;
    const actions = [];
    if (visibility === PUBLIC_VISIBILITY) {
      actions.push(
        <Tooltip title={t('This file was uploaded for everyone.')}>
          <span>
            <IconButton color="primary">
              <VerifiedUserIcon />
            </IconButton>
          </span>
        </Tooltip>,
      );
    }

    // students can always delete their own files
    if (user === currentUserId) {
      actions.push(
        <IconButton
          color="primary"
          onClick={() => this.handleDelete({ id, _id, uri })}
        >
          <DeleteIcon />
        </IconButton>,
      );
    }
    return actions;
  }

  renderAppInstanceResources() {
    const { t, appInstanceResources } = this.props;
    // if there are no resources, show an empty table
    if (!appInstanceResources.length) {
      return (
        <TableRow>
          <TableCell colSpan={3} align="center">
            {t('No files have been uploaded.')}
          </TableCell>
        </TableRow>
      );
    }
    // map each app instance resource to a row in the table
    return appInstanceResources.map(
      ({ _id, id, data: { name, uri }, visibility, createdAt, user }) => {
        const identifier = id || _id;
        return (
          <TableRow key={identifier}>
            <TableCell scope="row">
              {createdAt && new Date(createdAt).toLocaleString()}
            </TableCell>
            <TableCell>
              <a href={uri} target="_blank" rel="noopener noreferrer">
                {name}
              </a>
            </TableCell>
            <TableCell>
              {this.renderActions({ visibility, id: identifier, uri, user })}
            </TableCell>
          </TableRow>
        );
      },
    );
  }

  render() {
    const { t, classes, visibility } = this.props;
    return (
      <Grid container spacing={0}>
        <Grid item xs={12} className={classes.main}>
          <Grid item xs={12} className={classes.main}>
            <Uploader visibility={visibility} />
          </Grid>
          <Paper className={classes.root}>
            <Table className={classes.table} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('Date')}</TableCell>
                  <TableCell>{t('File Name')}</TableCell>
                  <TableCell>{t('Actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{this.renderAppInstanceResources()}</TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = ({ context, appInstance }) => {
  const { userId } = context;
  const {
    content: {
      settings: { publicStudentUploads },
    },
  } = appInstance;
  const visibility = publicStudentUploads
    ? PUBLIC_VISIBILITY
    : DEFAULT_VISIBILITY;
  return {
    visibility,
    currentUserId: userId,
  };
};

const mapDispatchToProps = {
  dispatchDeleteFile: deleteFile,
};

const StyledComponent = withStyles(StudentView.styles)(StudentView);

const TranslatedComponent = withTranslation()(StyledComponent);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TranslatedComponent);
