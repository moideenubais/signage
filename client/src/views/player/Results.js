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
  colors
} from '@material-ui/core';
import getInitials from 'src/utils/getInitials';
import CONSTANTS from 'src/constants';
import { useNavigate } from 'react-router-dom';
import SimpleModal from '../../components/Modal/Modal';
import AlertDialog from '../../components/confirmModal/confirmModal';
import axios from 'axios';
import { isEmpty } from 'lodash';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

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
  }
}));

const Results = ({
  className,
  players,
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

  const handleDelete = (player, index) => {
    axios
      .delete(CONSTANTS.BASE_URL + 'api/player/' + player._id)
      .then(response => {
        setconfirmOpen(false);
        player.openConfirm = false;
        players[index] = player;

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
    players[index] = cus;
    // console.log("got here", cus);
  };

  const handleConfirmclose = (cus, index) => {
    cus.openConfirm = false;
    players[index] = cus;
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
                    checked={selectedCustomerIds.length === players.length}
                    color="primary"
                    indeterminate={
                      selectedCustomerIds.length > 0
                      && selectedCustomerIds.length < players.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell> */}
                {/* <TableCell>#</TableCell> */}
                <TableCell>Device Key</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Group</TableCell>
                <TableCell>Valid From</TableCell>
                <TableCell>Valid To</TableCell>
                <TableCell>Sleep Time</TableCell>
                <TableCell>Wake Up Time</TableCell>
                {/* <TableCell>Storage</TableCell> */}
                {/* <TableCell>Icon</TableCell>
                <TableCell>Featured</TableCell> */}
                {<TableCell></TableCell>}
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {players.slice(0, limit).map((player, index) => (
                <TableRow
                  hover
                  key={player._id}
                  // selected={selectedCustomerIds.indexOf(player.id) !== -1}
                >
                  {/* <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomerIds.indexOf(player.id) !== -1}
                      onChange={(event) => handleSelectOne(event, player.id)}
                      value="true"
                    />
                  </TableCell> */}
                  {/* <TableCell>
                    {page * limit + index + 1}
                  </TableCell> */}
                  <TableCell>{player.device_key}</TableCell>
                  <TableCell>
                    {/* <Box alignItems="center" display="flex"> */}
                    {/* <Avatar
                        className={classes.avatar}
                        src={CONSTANTS.BASE_URL + player.image_url}
                      >
                        {getInitials(player.name)}
                      </Avatar> */}
                    <Typography color="textPrimary" variant="body1">
                      {player.display_name}
                    </Typography>
                    {/* </Box> */}
                  </TableCell>
                  <TableCell>
                    {player.description ? player.description : ''}
                  </TableCell>
                  <TableCell>{player.group.name}</TableCell>
                  <TableCell>
                    {moment(player.valid_from).format(
                      'MMMM Do YYYY, h:mm:ss a'
                    )}
                  </TableCell>
                  {/* <TableCell>{player.type}</TableCell> */}
                  {/* <TableCell>
                    <Switch
                      checked={player.default}
                      onChange={() => {
                        onUpdateDefault(player, index);
                      }}
                      name="checkedDefault"
                    />
                  </TableCell> */}
                  <TableCell>
                    {moment(player.valid_to).format('MMMM Do YYYY, h:mm a')}
                  </TableCell>
                  <TableCell>
                    {player.sleep_time
                      ? moment(player.sleep_time).format('h:mm a')
                      : ''}
                  </TableCell>
                  <TableCell>
                    {player.wakeup_time
                      ? moment(player.wakeup_time).format('h:mm a')
                      : ''}
                  </TableCell>
                  {/* <TableCell>
                    {player.storage}
                    </TableCell> */}
                  {/* <TableCell>
                    {player.logo_url?<img className={classes.logoImage} src={CONSTANTS.BASE_URL+player.logo_url} alt="logo" />:"No Logo"}
                  </TableCell> */}
                  {/* <TableCell>
                    {player.icon_url?<img className={classes.iconImage} src={CONSTANTS.BASE_URL+player.icon_url} alt="icon" />:"No Image"}
                  </TableCell> */}

                  {
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        className={classes.editButton}
                        onClick={() => {
                          navigate('/corevine/admin/app/players/editPlayer/' + player._id, {
                            replace: false
                          });
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
                          handleDeleteConfirm(player, index);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                      {confirmOpen ? (
                        <AlertDialog
                          open={player.openConfirm}
                          handleClose={() => {
                            handleConfirmclose(player, index);
                          }}
                          handleConfirm={() => {
                            handleDelete(player, index);
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
                    {moment(player.createdAt).format('DD/MM/YYYY')}
                  </TableCell> */}
                </TableRow>
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
  players: PropTypes.array.isRequired
};

export default Results;
