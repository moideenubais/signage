import React, { useState, useEffect } from 'react';
import { Box, Container, makeStyles, Snackbar, Slide } from '@material-ui/core';
import Page from 'src/components/Page';
import Results from './Results';
import Toolbar from './Toolbar';
// import data from './data';
import CONSTANTS from 'src/constants';
import axios from 'axios';
import { isEmpty } from 'lodash';
import MuiAlert from '@material-ui/lab/Alert';
// import Spinner from '../../components/Spinner';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const GroupView = () => {
  const classes = useStyles();
  // const [groups] = useState({});
  const [groups, setGroups] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [urlParams, setUrlParams] = useState({ limit: limit, page: 1 });
  const [totalRows, setTotalRows] = useState(undefined);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [activeUpdated, setactiveUpdated] = useState(false);

  const handleLimitChange = event => {
    setLimit(event.target.value);
    let tempUrl = urlParams;
    tempUrl.page = page + 1;
    tempUrl.limit = event.target.value;
    setUrlParams(tempUrl);
    getAllGroups();
  };

  const handlePageChange = (event, newPage) => {
    let tempUrl = urlParams;
    tempUrl.limit = limit;
    tempUrl.page = newPage + 1;
    setUrlParams(tempUrl);
    getAllGroups();
    setPage(newPage);
  };

  useEffect(() => {
    getAllGroups();
  }, []);

  const getAllGroups = () => {
    axios
      .get(CONSTANTS.BASE_URL + 'api/group', { params: urlParams })
      .then(response => {
        // console.log("+++++++++++++++++++",response.data.groups);
        const allGroups = response.data.groups;
        if (!isEmpty(allGroups)) {
          const totalRows = response.data.info.totalNumber;
          setTotalRows(totalRows);
          // console.log("totol",totalRows)
          setGroups(allGroups);
        } else {
          setGroups([]);
          setTotalRows(0);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const handleUpdateActive = (group, index) => {
    // console.log('in handle');
    let updateData = {};
    updateData.active = !group.active;
    // updateData.append('active', !group.active);
    if (snackBarOpen) setSnackBarOpen(false);
    // let updateData = {active:!group.active}
    axios
      .put(CONSTANTS.BASE_URL + 'api/group/' + group._id, updateData)
      .then(response => {

        group.active = !group.active;
        let newGroups = groups;
        newGroups[index] = group;
        setGroups(newGroups);
        setSnackBarOpen(true);
        setactiveUpdated(true);
        
      })
      .catch(error => {
        setSnackBarOpen(true);
        setactiveUpdated(false);
        console.log(error);
      });
  };
  const handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackBarOpen(false);
  };
  const handelSearch = event => {
    // console.log("in")
    let tempUrl = urlParams;
    tempUrl.search = event.target.value;
    setUrlParams(tempUrl);
    // urlParams.customerName = event.target.value;
    getAllGroups();
  };
  const handleGroupTypeSearch = groupType => {
    // console.log("in")
    let tempUrl = urlParams;
    if (groupType === 'all') {
      if (tempUrl.hasOwnProperty('group_type')) delete tempUrl.group_type;
    } else {
      tempUrl.group_type = groupType;
    }
    setUrlParams(tempUrl);
    // urlParams.customerName = event.target.value;
    getAllGroups();
  };

  return (
    <Page className={classes.root} title="Groups">
      <Container maxWidth={false}>
        <Toolbar
          onSearchName={event => {
            handelSearch(event);
          }}
          // onGroupTypeChange={handleGroupTypeSearch}
        />
        <Box mt={3}>
          {groups ? (
            <Results
              groups={groups}
              onDelete={getAllGroups}
              handlePageChange={handlePageChange}
              handleLimitChange={handleLimitChange}
              page={page}
              limit={limit}
              total={totalRows}
              // onUpdateActive={handleUpdateActive}
              // onDelete={getAllGroups}
            />
          ) : null}
        </Box>
      </Container>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        open={snackBarOpen}
        autoHideDuration={3000}
        onClose={handleSnackBarClose}
        // TransitionComponent={SlideTransition}
      >
        {activeUpdated ? (
          <Alert onClose={handleSnackBarClose} severity="success">
            Active Updated Successfully
          </Alert>
        ) : (
          <Alert onClose={handleSnackBarClose} severity="error">
            Active Updation Failed
          </Alert>
        )}
      </Snackbar>
    </Page>
  );
};

export default GroupView;
