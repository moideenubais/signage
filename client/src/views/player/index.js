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

const PlayerView = () => {
  const classes = useStyles();
  // const [players] = useState({});
  const [players, setPlayers] = useState(null);
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
    getAllPlayers();
  };

  const handlePageChange = (event, newPage) => {
    let tempUrl = urlParams;
    tempUrl.limit = limit;
    tempUrl.page = newPage + 1;
    setUrlParams(tempUrl);
    getAllPlayers();
    setPage(newPage);
  };

  useEffect(() => {
    getAllPlayers();
  }, []);

  const getAllPlayers = () => {
    axios
      .get(CONSTANTS.BASE_URL + 'api/player', { params: urlParams })
      .then(response => {
        // console.log("+++++++++++++++++++",response.data.players);
        const allPlayers = response.data.players;
        if (!isEmpty(allPlayers)) {
          const totalRows = response.data.info.totalNumber;
          setTotalRows(totalRows);
          // console.log("totol",totalRows)
          setPlayers(allPlayers);
        } else {
          setPlayers([]);
          setTotalRows(0);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const handleUpdateDefault = (player, index) => {
    // console.log('in handle');
    let updateData = {};
    updateData.default = !player.default;
    // updateData.append('default', !player.default);
    if (snackBarOpen) setSnackBarOpen(false);
    // let updateData = {default:!player.default}
    axios
      .put(CONSTANTS.BASE_URL + 'api/player/' + player._id, updateData)
      .then(response => {
        player.default = !player.default;
        let newPlayers = players;
        newPlayers[index] = player;
        setPlayers(newPlayers);
        setSnackBarOpen(true);
        setdefaultUpdated(true);
        getAllPlayers();
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
    getAllPlayers();
  };
  const handlePlayerTypeSearch = playerType => {
    // console.log("in")
    let tempUrl = urlParams;
    if (playerType === 'all') {
      if (tempUrl.hasOwnProperty('player_type')) delete tempUrl.player_type;
    } else {
      tempUrl.player_type = playerType;
    }
    setUrlParams(tempUrl);
    // urlParams.customerName = event.target.value;
    getAllPlayers();
  };

  return (
    <Page className={classes.root} title="Players">
      <Container maxWidth={false}>
        <Toolbar
          onSearchName={event => {
            handelSearch(event);
          }}
          // onPlayerTypeChange={handlePlayerTypeSearch}
        />
        <Box mt={3}>
          {players ? (
            <Results
              players={players}
              onDelete={getAllPlayers}
              handlePageChange={handlePageChange}
              handleLimitChange={handleLimitChange}
              page={page}
              limit={limit}
              total={totalRows}
              onUpdateDefault={handleUpdateDefault}
              // onDelete={getAllPlayers}
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

export default PlayerView;
