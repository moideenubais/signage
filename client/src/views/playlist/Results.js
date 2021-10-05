import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles,
  Switch,
  FormControlLabel,
  IconButton,
  colors,
  Button,
  Collapse
} from '@material-ui/core';
import BlurLinearIcon from '@material-ui/icons/BlurLinear';
import getInitials from 'src/utils/getInitials';
import CONSTANTS from 'src/constants';
import { useNavigate } from 'react-router-dom';
import SimpleModal from '../../components/Modal/Modal';
import AlertDialog from '../../components/confirmModal/confirmModal';
import axios from 'axios';
import { isEmpty } from 'lodash';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const useStyles = makeStyles(theme => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  },
  dangerButton: {
    color: colors.red[500]
    // color: 'white'
  },
  logoImage: {
    // color: colors.red[500],
    width: '120px'
    // color: 'white'
  },
  // iconImage: {
  //   // color: colors.red[500],
  //   width:"32px"
  //   // color: 'white'
  // },
  horizontalSpace: {
    display: 'inline-table',
    width: '30px',
    height: '10px'
  },
  cellStyle: {
    whiteSpace: 'normal',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    height: '100%'
    // width: '123px',
    // display: 'block',
    // minWidth: '123px'
    //   '& *':{

    // }
  },
  cardStyle: {
    width: 'inline-block',
    display: 'flex'
  }
}));

const Results = ({
  className,
  playlists,
  page,
  limit,
  total,
  handlePageChange,
  handleLimitChange,
  onUpdateDefault,
  onDelete,
  ...rest
}) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [confirmOpen, setconfirmOpen] = useState(false);
  const [modalBody, setModalBody] = useState({
    title: 'Delete',
    content: 'Are you sure'
  });
  const [cancelButtonAsOk, setCancelButtonAsOk] = useState('CANCEL');
  const [confirmDialog, setConfirmDialog] = useState(true);
  const [openCollapse, setOpenCollapse] = useState(false);
  const openCollapseHandler = (playlist, index) => {
    // setconfirmOpen(false);
    console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiii', playlist.openCollapse);
    playlist.openCollapse = !playlist.openCollapse;
    console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiii', playlist.openCollapse);
    playlists[index] = playlist;
    setOpenCollapse(prev => !prev);
    // onDelete();
  };

  const handleDelete = (playlist, index) => {
    axios
      .delete(CONSTANTS.BASE_URL + 'api/playlist/' + playlist._id)
      .then(response => {
        setconfirmOpen(false);
        playlist.openConfirm = false;
        playlists[index] = playlist;

        onDelete();
      })
      .catch(error => {
        setModalBody({ title: 'Error', content: error.response.data.error });
        setCancelButtonAsOk('OK');
        setConfirmDialog(false);
        // onDelete();
        console.log(error.response);
      });
  };
  const handleDeleteConfirm = (cus, index) => {
    setCancelButtonAsOk('CANCEL');
    setConfirmDialog(true);
    setconfirmOpen(true);
    cus.openConfirm = true;
    playlists[index] = cus;
    // console.log("got here", cus);
  };

  const handleConfirmclose = (cus, index) => {
    cus.openConfirm = false;
    playlists[index] = cus;
    setconfirmOpen(false);
    setModalBody({ title: 'Delete', content: 'Are you sure' });
    setCancelButtonAsOk('Confirm');
    onDelete();
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                {/* <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCustomerIds.length === playlists.length}
                    color="primary"
                    indeterminate={
                      selectedCustomerIds.length > 0
                      && selectedCustomerIds.length < playlists.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell> */}
                {/* <TableCell>#</TableCell> */}
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Group</TableCell>
                <TableCell>Width/Height</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Default</TableCell>
                {/* <TableCell>Storage</TableCell> */}
                {/* <TableCell>Icon</TableCell>
                <TableCell>Featured</TableCell> */}
                {<TableCell></TableCell>}
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {playlists.slice(0, limit).map((playlist, index) => (
                <>
                  <TableRow
                    hover
                    key={playlist._id}
                    onClick={() => {
                      openCollapseHandler(playlist, index);
                    }}
                    // selected={selectedCustomerIds.indexOf(playlist.id) !== -1}
                  >
                    {/* <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomerIds.indexOf(playlist.id) !== -1}
                      onChange={(event) => handleSelectOne(event, playlist.id)}
                      value="true"
                    />
                  </TableCell> */}
                    {/* <TableCell>
                    {page * limit + index + 1}
                  </TableCell> */}
                    <TableCell>
                      <Box alignItems="center" display="flex">
                        {/* <Avatar
                        className={classes.avatar}
                        src={CONSTANTS.BASE_URL + playlist.image_url}
                      >
                        {getInitials(playlist.name)}
                      </Avatar> */}
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          // onClick={() => {
                          //   openCollapseHandler(content, index);
                          // }}
                        >
                          {playlist.openCollapse ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                        <Typography color="textPrimary" variant="body1">
                          {playlist.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {playlist.description ? playlist.description : ''}
                    </TableCell>
                    <TableCell>{playlist.group.name}</TableCell>
                    <TableCell>
                      {playlist.width}/{playlist.height}
                    </TableCell>
                    <TableCell>{playlist.type}</TableCell>
                    <TableCell>
                      <Switch
                        checked={playlist.default}
                        onChange={() => {
                          onUpdateDefault(playlist, index);
                        }}
                        name="checkedDefault"
                      />
                    </TableCell>
                    {/* <TableCell>
                    {playlist.storage}
                    </TableCell> */}
                    {/* <TableCell>
                    {playlist.logo_url?<img className={classes.logoImage} src={CONSTANTS.BASE_URL+playlist.logo_url} alt="logo" />:"No Logo"}
                  </TableCell> */}
                    {/* <TableCell>
                    {playlist.icon_url?<img className={classes.iconImage} src={CONSTANTS.BASE_URL+playlist.icon_url} alt="icon" />:"No Image"}
                  </TableCell> */}

                    {
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          className={classes.editButton}
                          onClick={() => {
                            navigate(
                              '/corevine/admin/app/playlists/editPlaylist/' + playlist._id,
                              {
                                replace: false
                              }
                            );
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    }
                    {/* <div className={classes.horizontalSpace}></div> */}
                    {
                      <TableCell>
                        <IconButton
                          color="error"
                          className={classes.dangerButton}
                          onClick={() => {
                            handleDeleteConfirm(playlist, index);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                        {confirmOpen ? (
                          <AlertDialog
                            open={playlist.openConfirm}
                            handleClose={() => {
                              handleConfirmclose(playlist, index);
                            }}
                            handleConfirm={() => {
                              handleDelete(playlist, index);
                            }}
                            content={modalBody.content}
                            title={modalBody.title}
                            confirmDialog={confirmDialog}
                            cancelButtonAsOk={cancelButtonAsOk}
                          />
                        ) : null}
                      </TableCell>
                    }
                    {/* <TableCell>
                    {moment(playlist.createdAt).format('DD/MM/YYYY')}
                  </TableCell> */}
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={8}
                    >
                      <Collapse in={playlist.openCollapse} timeout="auto">
                        <Box sx={{ margin: 1 }}>
                          {/* <Typography variant="h6" gutterBottom component="div">
                            History
                          </Typography> */}

                          <div style={{ display: 'flex' }}>
                            {isEmpty(playlist.playlist) ? (
                              <p>No media found</p>
                            ) : (
                              playlist.playlist.map(media => {
                                let content = (
                                  <IconButton
                                    disableRipple
                                    disableFocusRipple
                                    color="primary"
                                    // className={classes.editButton}
                                    onClick={() => {
                                      window.open(media.media_id.url, '_blank');
                                    }}
                                  >
                                    <BlurLinearIcon fontSize="large" />
                                  </IconButton>
                                );
                                if (media.media_id.type.includes('image'))
                                  content = (
                                    <img
                                      className={classes.uploadBannerImage}
                                      src={
                                        CONSTANTS.BASE_URL + media.media_id.url
                                      }
                                    />
                                  );
                                if (media.media_id.type.includes('video'))
                                  content = (
                                    <video width="150" height="100" controls>
                                      <source
                                        src={
                                          CONSTANTS.BASE_URL +
                                          media.media_id.url
                                        }
                                        type={media.media_id.type}
                                      />
                                    </video>
                                  );

                                return (
                                  <div
                                    key={media.media_id._id}
                                    className={classes.cardStyle}
                                  >
                                    {/* <img
                                      className={classes.uploadBannerImage}
                                      src={CONSTANTS.BASE_URL + media.media_id.url}
                                    /> */}
                                    {content}
                                    <div
                                      minWidth="50px"
                                      style={{ margin: '10px' }}
                                    >
                                      <p>{media.media_id.name}</p>
                                      <p>{media.media_id.type}</p>
                                      <p>{media.media_id.duration}</p>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={total}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  playlists: PropTypes.array.isRequired
};

export default Results;
