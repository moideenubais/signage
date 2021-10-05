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
  Collapse,
  TablePagination,
  TableRow,
  Typography,
  makeStyles,
  Switch,
  FormControlLabel,
  IconButton,
  colors,
  CardContent,
  Button
} from '@material-ui/core';
import BlurLinearIcon from '@material-ui/icons/BlurLinear';
import getInitials from 'src/utils/getInitials';
import CONSTANTS from 'src/constants';
import { useNavigate } from 'react-router-dom';
import SimpleModal from '../../components/Modal/Modal';
import AlertDialog from '../../components/confirmModal/confirmModal';
import axios from 'axios';
import { isEmpty, set } from 'lodash';
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
  uploadBannerImage: {
    height: '100px',
    margin: '10px'
  },
  cardStyle: {
    width: 'inline-block',
    display: 'flex'
  }
}));

const Results = ({
  className,
  contents,
  page,
  limit,
  total,
  handlePageChange,
  handleLimitChange,
  onUpdateActive,
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

  const openCollapseHandler = (content, index) => {
    // setconfirmOpen(false);
    console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiii', content.openCollapse);
    content.openCollapse = !content.openCollapse;
    console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiii', content.openCollapse);
    contents[index] = content;
    setOpenCollapse(prev => !prev);
    // onDelete();
  };

  const handleDelete = (content, index) => {
    axios
      .delete(CONSTANTS.BASE_URL + 'api/content/' + content._id)
      .then(response => {
        setconfirmOpen(false);
        content.openConfirm = false;
        contents[index] = content;
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
    contents[index] = cus;
    // console.log("got here", cus);
  };

  const handleConfirmclose = (cus, index) => {
    cus.openConfirm = false;
    contents[index] = cus;
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
                    checked={selectedCustomerIds.length === contents.length}
                    color="primary"
                    indeterminate={
                      selectedCustomerIds.length > 0
                      && selectedCustomerIds.length < contents.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell> */}
                {/* <TableCell>#</TableCell> */}
                <TableCell>Name</TableCell>
                {/* <TableCell>Description</TableCell> */}
                <TableCell>Associate</TableCell>
                {/* <TableCell>Storage</TableCell> */}
                {/* <TableCell>Icon</TableCell>
                <TableCell>Featured</TableCell> */}
                {<TableCell></TableCell>}
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contents.slice(0, limit).map((content, index) => (
                <>
                  <TableRow
                    hover
                    key={content._id}
                    onClick={() => {
                      openCollapseHandler(content, index);
                    }}
                    // selected={selectedCustomerIds.indexOf(content.id) !== -1}
                  >
                    {/* <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomerIds.indexOf(content.id) !== -1}
                      onChange={(event) => handleSelectOne(event, content.id)}
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
                        src={CONSTANTS.BASE_URL + content.image_url}
                      >
                        {getInitials(content.name)}
                      </Avatar> */}
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          // onClick={() => {
                          //   openCollapseHandler(content, index);
                          // }}
                        >
                          {content.openCollapse ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                        <Typography color="textPrimary" variant="body1">
                          {!console.log(
                            'locallllllllllll',
                            content.openCollapse
                          ) && content.label}
                        </Typography>
                      </Box>
                    </TableCell>
                    {/* <TableCell>
                    {content.description ? content.description : ''}
                  </TableCell> */}
                    <TableCell>{content.associate.name}</TableCell>
                    {/* <TableCell>
                      
                    </TableCell> */}
                    {/* <TableCell>
                    {content.logo_url?<img className={classes.logoImage} src={CONSTANTS.BASE_URL+content.logo_url} alt="logo" />:"No Logo"}
                  </TableCell> */}
                    {/* <TableCell>
                    {content.icon_url?<img className={classes.iconImage} src={CONSTANTS.BASE_URL+content.icon_url} alt="icon" />:"No Image"}
                  </TableCell> */}

                    {
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          className={classes.editButton}
                          onClick={() => {
                            navigate(
                              '/corevine/admin/app/contents/editContent/' + content._id,
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
                            handleDeleteConfirm(content, index);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                        {confirmOpen ? (
                          <AlertDialog
                            open={content.openConfirm}
                            handleClose={() => {
                              handleConfirmclose(content, index);
                            }}
                            handleConfirm={() => {
                              handleDelete(content, index);
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
                    {moment(content.createdAt).format('DD/MM/YYYY')}
                  </TableCell> */}
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={6}
                    >
                      <Collapse in={content.openCollapse} timeout="auto">
                        <Box sx={{ margin: 1 }}>
                          {/* <Typography variant="h6" gutterBottom component="div">
                            History
                          </Typography> */}
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row-reverse'
                            }}
                          >
                            <Button
                              onClick={() => {
                                navigate(
                                  '/corevine/admin/app/contents/addMedia/' + content._id,
                                  {
                                    replace: false
                                  }
                                );
                              }}
                            >
                              Add Media
                            </Button>
                          </div>
                          <div style={{ display: 'flex' }}>
                            {isEmpty(content.media) ? (
                              <p>No media found</p>
                            ) : (
                              content.media.map(media => {
                                let content = (
                                  <IconButton
                                    disableRipple
                                    disableFocusRipple
                                    color="primary"
                                    // className={classes.editButton}
                                    onClick={() => {
                                      window.open(media.url, '_blank');
                                    }}
                                  >
                                    <BlurLinearIcon fontSize="large" />
                                  </IconButton>
                                );
                                if (media.type.includes('image'))
                                  content = (
                                    <img
                                      className={classes.uploadBannerImage}
                                      src={CONSTANTS.BASE_URL + media.url}
                                    />
                                  );
                                if (media.type.includes('video'))
                                  content = (
                                    <video width="150" height="100" controls>
                                      <source
                                        src={CONSTANTS.BASE_URL + media.url}
                                        type={media.type}
                                      />
                                    </video>
                                  );

                                return (
                                  <div
                                    key={media._id}
                                    className={classes.cardStyle}
                                  >
                                    {/* <img
                                      className={classes.uploadBannerImage}
                                      src={CONSTANTS.BASE_URL + media.url}
                                    /> */}
                                    {content}
                                    <div
                                      minWidth="50px"
                                      style={{ margin: '10px' }}
                                    >
                                      <p>{media.name}</p>
                                      <p>{media.type}</p>
                                      <p>{media.duration}</p>
                                      <IconButton
                                        color="primary"
                                        className={classes.editButton}
                                        onClick={() => {
                                          navigate(
                                            '/corevine/admin/app/contents/editMedia/' +
                                              media._id,
                                            {
                                              replace: false
                                            }
                                          );
                                        }}
                                      >
                                        <EditIcon />
                                      </IconButton>
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
  contents: PropTypes.array.isRequired
};

export default Results;
