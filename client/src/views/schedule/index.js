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

const ScheduleView = () => {
  const classes = useStyles();
  // const [schedules] = useState({});
  const [schedules, setSchedules] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [urlParams, setUrlParams] = useState({ limit: limit, page: 1 });
  const [totalRows, setTotalRows] = useState(undefined);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [defaultUpdated, setdefaultUpdated] = useState(false);

  const handleLimitChange = event => {
    setLimit(event.target.value);
    let tempUrl = urlParams;
    tempUrl.page = page + 1;
    tempUrl.limit = event.target.value;
    setUrlParams(tempUrl);
    getAllSchedules();
  };

  const handlePageChange = (event, newPage) => {
    let tempUrl = urlParams;
    tempUrl.limit = limit;
    tempUrl.page = newPage + 1;
    setUrlParams(tempUrl);
    getAllSchedules();
    setPage(newPage);
  };

  useEffect(() => {
    getAllSchedules();
  }, []);

  const getAllSchedules = () => {
    axios
      .get(CONSTANTS.BASE_URL + 'api/schedule', { params: urlParams })
      .then(response => {
        // console.log("+++++++++++++++++++",response.data.schedules);
        const allSchedules = response.data.schedules;
        if (!isEmpty(allSchedules)) {
          const totalRows = response.data.info.totalNumber;
          setTotalRows(totalRows);
          // console.log("totol",totalRows)
          setSchedules(allSchedules);
        } else {
          setSchedules([]);
          setTotalRows(0);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const handleUpdateDefault = (schedule, index) => {
    // console.log('in handle');
    let updateData = {};
    updateData.default = !schedule.default;
    // updateData.append('default', !schedule.default);
    if (snackBarOpen) setSnackBarOpen(false);
    // let updateData = {default:!schedule.default}
    axios
      .put(CONSTANTS.BASE_URL + 'api/schedule/' + schedule._id, updateData)
      .then(response => {
        schedule.default = !schedule.default;
        let newSchedules = schedules;
        newSchedules[index] = schedule;
        setSchedules(newSchedules);
        setSnackBarOpen(true);
        setdefaultUpdated(true);
        getAllSchedules();
      })
      .catch(error => {
        setSnackBarOpen(true);
        setdefaultUpdated(false);
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
    getAllSchedules();
  };
  const handleScheduleTypeSearch = scheduleType => {
    // console.log("in")
    let tempUrl = urlParams;
    if (scheduleType === 'all') {
      if (tempUrl.hasOwnProperty('schedule_type')) delete tempUrl.schedule_type;
    } else {
      tempUrl.schedule_type = scheduleType;
    }
    setUrlParams(tempUrl);
    // urlParams.customerName = event.target.value;
    getAllSchedules();
  };

  return (
    <Page className={classes.root} title="Schedules">
      <Container maxWidth={false}>
        <Toolbar
          onSearchName={event => {
            handelSearch(event);
          }}
          // onScheduleTypeChange={handleScheduleTypeSearch}
        />
        <Box mt={3}>
          {schedules ? (
            <Results
              schedules={schedules}
              onDelete={getAllSchedules}
              handlePageChange={handlePageChange}
              handleLimitChange={handleLimitChange}
              page={page}
              limit={limit}
              total={totalRows}
              onUpdateDefault={handleUpdateDefault}
              // onDelete={getAllSchedules}
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
        {defaultUpdated ? (
          <Alert onClose={handleSnackBarClose} severity="success">
            Default Updated Successfully
          </Alert>
        ) : (
          <Alert onClose={handleSnackBarClose} severity="error">
            Default Updation Failed
          </Alert>
        )}
      </Snackbar>
    </Page>
  );
};

export default ScheduleView;
