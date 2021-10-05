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

const ContentView = () => {
  const classes = useStyles();
  // const [contents] = useState({});
  const [contents, setContents] = useState(null);
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
    getAllContents();
  };

  const handlePageChange = (event, newPage) => {
    let tempUrl = urlParams;
    tempUrl.limit = limit;
    tempUrl.page = newPage + 1;
    setUrlParams(tempUrl);
    getAllContents();
    setPage(newPage);
  };

  useEffect(() => {
    getAllContents();
  }, []);

  const getAllContents = () => {
    axios
      .get(CONSTANTS.BASE_URL + 'api/content', { params: urlParams })
      .then(response => {
        // console.log("+++++++++++++++++++",response.data.contents);
        const allContents = response.data.contents;
        if (!isEmpty(allContents)) {
          const totalRows = response.data.info.totalNumber;
          setTotalRows(totalRows);
          // console.log("totol",totalRows)
          setContents(allContents);
        } else {
          setContents([]);
          setTotalRows(0);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const handleUpdateActive = (content, index) => {
    // console.log('in handle');
    let updateData = {};
    updateData.active = !content.active;
    // updateData.append('active', !content.active);
    if (snackBarOpen) setSnackBarOpen(false);
    // let updateData = {active:!content.active}
    axios
      .put(CONSTANTS.BASE_URL + 'api/content/' + content._id, updateData)
      .then(response => {

        content.active = !content.active;
        let newContents = contents;
        newContents[index] = content;
        setContents(newContents);
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
    getAllContents();
  };
  const handleContentTypeSearch = contentType => {
    // console.log("in")
    let tempUrl = urlParams;
    if (contentType === 'all') {
      if (tempUrl.hasOwnProperty('content_type')) delete tempUrl.content_type;
    } else {
      tempUrl.content_type = contentType;
    }
    setUrlParams(tempUrl);
    // urlParams.customerName = event.target.value;
    getAllContents();
  };

  return (
    <Page className={classes.root} title="Contents">
      <Container maxWidth={false}>
        <Toolbar
          onSearchName={event => {
            handelSearch(event);
          }}
          // onContentTypeChange={handleContentTypeSearch}
        />
        <Box mt={3}>
          {contents ? (
            <Results
              contents={contents}
              onDelete={getAllContents}
              handlePageChange={handlePageChange}
              handleLimitChange={handleLimitChange}
              page={page}
              limit={limit}
              total={totalRows}
              // onUpdateActive={handleUpdateActive}
              // onDelete={getAllContents}
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

export default ContentView;
