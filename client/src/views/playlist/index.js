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

const PlaylistView = () => {
  const classes = useStyles();
  // const [playlists] = useState({});
  const [playlists, setPlaylists] = useState(null);
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
    getAllPlaylists();
  };

  const handlePageChange = (event, newPage) => {
    let tempUrl = urlParams;
    tempUrl.limit = limit;
    tempUrl.page = newPage + 1;
    setUrlParams(tempUrl);
    getAllPlaylists();
    setPage(newPage);
  };

  useEffect(() => {
    getAllPlaylists();
  }, []);

  const getAllPlaylists = () => {
    axios
      .get(CONSTANTS.BASE_URL + 'api/playlist', { params: urlParams })
      .then(response => {
        // console.log("+++++++++++++++++++",response.data.playlists);
        const allPlaylists = response.data.playlists;
        if (!isEmpty(allPlaylists)) {
          const totalRows = response.data.info.totalNumber;
          setTotalRows(totalRows);
          // console.log("totol",totalRows)
          setPlaylists(allPlaylists);
        } else {
          setPlaylists([]);
          setTotalRows(0);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const handleUpdateDefault = (playlist, index) => {
    // console.log('in handle');
    let updateData = {};
    updateData.default = !playlist.default;
    // updateData.append('default', !playlist.default);
    if (snackBarOpen) setSnackBarOpen(false);
    // let updateData = {default:!playlist.default}
    axios
      .put(CONSTANTS.BASE_URL + 'api/playlist/' + playlist._id, updateData)
      .then(response => {
        playlist.default = !playlist.default;
        let newPlaylists = playlists;
        newPlaylists[index] = playlist;
        setPlaylists(newPlaylists);
        setSnackBarOpen(true);
        setdefaultUpdated(true);
        getAllPlaylists();
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
    getAllPlaylists();
  };
  const handlePlaylistTypeSearch = playlistType => {
    // console.log("in")
    let tempUrl = urlParams;
    if (playlistType === 'all') {
      if (tempUrl.hasOwnProperty('playlist_type')) delete tempUrl.playlist_type;
    } else {
      tempUrl.playlist_type = playlistType;
    }
    setUrlParams(tempUrl);
    // urlParams.customerName = event.target.value;
    getAllPlaylists();
  };

  return (
    <Page className={classes.root} title="Playlists">
      <Container maxWidth={false}>
        <Toolbar
          onSearchName={event => {
            handelSearch(event);
          }}
          // onPlaylistTypeChange={handlePlaylistTypeSearch}
        />
        <Box mt={3}>
          {playlists ? (
            <Results
              playlists={playlists}
              onDelete={getAllPlaylists}
              handlePageChange={handlePageChange}
              handleLimitChange={handleLimitChange}
              page={page}
              limit={limit}
              total={totalRows}
              onUpdateDefault={handleUpdateDefault}
              // onDelete={getAllPlaylists}
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

export default PlaylistView;
