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

const AssociateView = () => {
  const classes = useStyles();
  // const [associates] = useState({});
  const [associates, setAssociates] = useState(null);
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
    getAllAssociates();
  };

  const handlePageChange = (event, newPage) => {
    let tempUrl = urlParams;
    tempUrl.limit = limit;
    tempUrl.page = newPage + 1;
    setUrlParams(tempUrl);
    getAllAssociates();
    setPage(newPage);
  };

  useEffect(() => {
    getAllAssociates();
  }, []);

  const getAllAssociates = () => {
    axios
      .get(CONSTANTS.BASE_URL + 'api/associate', { params: urlParams })
      .then(response => {
        // console.log("+++++++++++++++++++",response.data.associates);
        const allAssociates = response.data.associates;
        if (!isEmpty(allAssociates)) {
          const totalRows = response.data.info.totalNumber;
          setTotalRows(totalRows);
          // console.log("totol",totalRows)
          setAssociates(allAssociates);
        } else {
          setAssociates([]);
          setTotalRows(0);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const handleUpdateActive = (associate, index) => {
    // console.log('in handle');
    let updateData = {};
    updateData.active = !associate.active;
    // updateData.append('active', !associate.active);
    if (snackBarOpen) setSnackBarOpen(false);
    // let updateData = {active:!associate.active}
    axios
      .put(CONSTANTS.BASE_URL + 'api/associate/' + associate._id, updateData)
      .then(response => {

        associate.active = !associate.active;
        let newAssociates = associates;
        newAssociates[index] = associate;
        setAssociates(newAssociates);
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
    getAllAssociates();
  };
  const handleAssociateTypeSearch = associateType => {
    // console.log("in")
    let tempUrl = urlParams;
    if (associateType === 'all') {
      if (tempUrl.hasOwnProperty('associate_type')) delete tempUrl.associate_type;
    } else {
      tempUrl.associate_type = associateType;
    }
    setUrlParams(tempUrl);
    // urlParams.customerName = event.target.value;
    getAllAssociates();
  };

  return (
    <Page className={classes.root} title="Associates">
      <Container maxWidth={false}>
        <Toolbar
          onSearchName={event => {
            handelSearch(event);
          }}
          // onAssociateTypeChange={handleAssociateTypeSearch}
        />
        <Box mt={3}>
          {associates ? (
            <Results
              associates={associates}
              onDelete={getAllAssociates}
              handlePageChange={handlePageChange}
              handleLimitChange={handleLimitChange}
              page={page}
              limit={limit}
              total={totalRows}
              // onUpdateActive={handleUpdateActive}
              // onDelete={getAllAssociates}
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

export default AssociateView;
