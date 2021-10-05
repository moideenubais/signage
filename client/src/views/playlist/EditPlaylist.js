import React, { useEffect, useState, useContext } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik, FieldArray } from 'formik';
import CONSTANTS from '../../constants';
import { isEmpty, isUndefined, find } from 'lodash';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AuthContext from 'src/context/auth-context';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormHelperText,
  Link,
  TextField,
  Typography,
  // makeStyles,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Select,
  Input,
  MenuItem,
  InputLabel,
  FormControl,
  Tab,
  Tabs,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Radio,
  RadioPlaylist,
  FormLabel,
  FormControlLabel,
  Grid
} from '@material-ui/core';
import Page from 'src/components/Page';
import Image from 'material-ui-image';
import axios from 'axios';
import getPrivileges from '../../utils/getPrivileges';
import TabPanel from 'src/components/TabPanel';

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  };
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  imageStyle: {
    paddingLeft: '25px',
    width: '150px',
    height: '100px'
  },
  imageStyle: {
    paddingLeft: '25px',
    width: '150px',
    height: '100px'
  },
  buttonStyle: {
    // width:"150px",
    // height:"40px",
    marginRight: '10px',
    marginLeft: '10px'
  },
  richEditor: {
    border: '1px #d0c0c0 solid',
    margin: '10px 0px'
  },
  uploadBigImage: {
    height: '100px',
    margin: '10px'
  }
}));

const EditPlaylist = props => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  let [playlistData, setPlaylistData] = useState(null);
  const [logoImageFile, setLogoImage] = useState(null);
  // const [iconImageFile, setIconImage] = useState(null);
  const [services, getServices] = useState([]);
  //   const [editorState, getEditorState] = useState(EditorState.createEmpty());
  const [translationModel, setTranslationModel] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [groups, setGroups] = useState(null);
  const [disabledSubmit, setDisabledSubmit] = useState(false);
  const [playlistMedias, setPlaylistMedias] = useState(null);
  // const [roles, setRoles] = useState(null);
  // const { playlist } = useContext(AuthContext);

  //   const [playlists, getPlaylists] = useState([]);

  const getImages = images => {
    return images.map((image, index) => (
      <img className={classes.uploadBigImage} src={image} key={index + image} />
    ));
  };
  const languages = [
    { key: 'en', label: 'English' },
    { key: 'ar', label: 'Arabic' }
  ];

  useEffect(() => {
    getSinglePlaylist();
    getAllPlaylistMedias();
    getAllGroups();
    // getAllRoles();
    // getAllPlaylists();
    // getAllPlaylists();
  }, []);

  const getAllGroups = () => {
    axios
      .get(CONSTANTS.BASE_URL + 'api/group', {
        params: { page: 1, limit: 10000 }
      })
      .then(response => {
        // console.log("+++++++++++++++++++",response.data.groups);
        const allGroups = response.data.groups;
        if (!isEmpty(allGroups)) {
          // const totalRows = response.data.info.totalNumber;
          // setTotalRows(totalRows);
          // console.log("totol",totalRows)
          setGroups(allGroups);
        } else {
          setGroups([]);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  // const getAllRoles = () => {
  //   axios
  //     .get(CONSTANTS.BASE_URL + 'api/role', {
  //       params: { page: 1, limit: 10000 }
  //     })
  //     .then(response => {
  //       // console.log("+++++++++++++++++++",response.data.roles);
  //       const allRoles = response.data.roles;
  //       if (!isEmpty(allRoles)) {
  //         setRoles(allRoles);
  //       } else {
  //         setRoles([]);
  //       }
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // };

  const getSinglePlaylist = () => {
    axios
      .get(CONSTANTS.BASE_URL + 'api/playlist/' + id)
      .then(response => {
        console.log('get resoposldsl', response.data);
        const playlistData = response.data;
        // const html = playlistData.description || '';
        // const contentBlock = htmlToDraft(html);
        // if (contentBlock) {
        //   const contentState = ContentState.createFromBlockArray(
        //     contentBlock.contentBlocks
        //   );
        //   let editorState = EditorState.createWithContent(contentState);
        //   getEditorState(editorState);
        // }
        setPlaylistData(playlistData);
        setProfileImageFile(CONSTANTS.BASE_URL + playlistData.image_url);
        // setIconImage(CONSTANTS.BASE_URL + playlistData.icon_url);
        // setImage(CONSTANTS.BASE_URL+playlistData.imageUrl);
        //   getBills(allBills);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getAllPlaylistMedias = () => {
    axios
      .get(CONSTANTS.BASE_URL + 'api/media/playlist/' + id, {
        params: { page: 1, limit: 10000 }
      })
      .then(response => {
        const allPlaylistMedias = response.data.medias;
        if (!isEmpty(allPlaylistMedias)) {
          console.log('assocaite', allPlaylistMedias);
          setPlaylistMedias(allPlaylistMedias);
        } else {
          setPlaylistMedias([]);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  // const getAllPlaylists = () => {
  //   axios.get(CONSTANTS.BASE_URL+'api/playlist',{params:{limit:1000,page:1}})
  //   .then(response => {
  //   //   console.log("service data",response.data);
  //     const allPlaylists = response.data.playlists;
  //     getPlaylists(allPlaylists);
  //   //   menu = allServices.map((service)=>{
  //   //       console.log("sdlksl",service)
  //   //       return(<MenuItem value={service._id}>{service.name}</MenuItem>)
  //   //       });
  //   })
  //   .catch(error => {
  //     console.log(error)
  //   })
  // }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    };
  }
  const handleModelOpen = () => {
    setTranslationModel(true);
  };

  const handleModelClose = () => {
    setTranslationModel(false);
  };

  //   const onEditorStateChange = editorState => {
  //     getEditorState(editorState);
  //   };

  const getLanguageLabel = key => {
    return languages.filter(language => language.key === key)[0].label;
  };

  // const isDeliveryBoy = privileges => {
  //   if (privileges.includes('delivery_boy')) return true;
  //   return false;
  // };
  // const isSeller = privileges => {
  //   if (privileges.includes('seller')) {
  //     if (isEmpty(playlists)) setDisabledSubmit(true);
  //     return true;
  //   } else {
  //     setDisabledSubmit(false);
  //     return false;
  //   }
  // };

  // const getRolesWithPlaylistId = playlistId => {
  //   // setRoles([]);
  //   axios
  //     .get(CONSTANTS.BASE_URL + 'api/role', {
  //       params: { page: 1, limit: 10000, playlist_id: playlistId }
  //     })
  //     .then(response => {
  //       // console.log("+++++++++++++++++++",response.data.roles);
  //       const allRoles = response.data.roles;
  //       if (!isEmpty(allRoles)) {
  //         setRoles(allRoles);
  //       } else {
  //         setRoles([]);
  //       }
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // };

  // const [values,setValues] = useState({
  //   billId: '',
  //   customerName: '',
  //   mobile: '',
  //   details: ''
  // })
  const PlaylistTypes = [
    { key: 'simple', value: 'Simple' },
    { key: 'template', value: 'Template' }
  ];
  const getPlaylistMedia = playlist => {
    return playlist.map(el => el.media_id);
  };
  let page =
    playlistData && groups && playlistMedias ? (
      <Page className={classes.root} title="Update Playlist">
        {/* <div style={{ marginTop: '10px', overflow: 'auto' }}>
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      > */}
        <Container maxWidth="md">
          <Formik
            initialValues={{
              name: playlistData.name,
              description: playlistData.description
                ? playlistData.description
                : '',
              width: playlistData.width,
              height: playlistData.height,
              type: playlistData.type,
              default: playlistData.default,
              group: playlistData.group,
              playlist: !isEmpty(playlistData.playlist)
                ? getPlaylistMedia(playlistData.playlist)
                : []
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string().required('Name required'),
              description: Yup.string(),
              width: Yup.number()
                .min(100)
                .required('Width required'),
              height: Yup.number()
                .min(100)
                .required('Height required'),
              type: Yup.string().required('Type required'),
              group: Yup.string().required('Group required')
            })}
            onSubmit={values => {
              let data = {};
              data.name = values.name;
              if (!isEmpty(values.description))
                data.description = values.description;
              data.width = values.width;
              data.height = values.height;
              data.default = values.default;
              data.type = values.type;
              data.group = values.group;
              const playlist = values.playlist.map((playlist, index) => {
                return { position: index + 1, media_id: playlist };
              });
              data.playlist = playlist;

              axios
                .put(
                  CONSTANTS.BASE_URL + 'api/playlist/' + playlistData._id,
                  data
                )
                .then(response => {
                  // console.log(response.data);
                  const bill = response.data;
                  // getBills(allBills);
                  // navigate('/bills', { replace: true });
                  // props.history.goBack();
                  navigate(-1);
                })
                .catch(error => {
                  console.log(error);
                });
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values,
              ...formProps
            }) => {
              console.log('valueslkl=++++++++++', values);
              return (
                <React.Fragment>
                  <form onSubmit={handleSubmit}>
                    <Card>
                      <CardHeader
                        // subheader="Update Bill"
                        title="Update Playlist"
                      />
                      <Divider />
                      <CardContent>
                        <FormControl
                          fullWidth
                          variant="outlined"
                          className={classes.formControl}
                        >
                          <InputLabel id="group_label">Group</InputLabel>
                          <Select
                            fullWidth
                            error={Boolean(touched.group && errors.group)}
                            helperText={touched.group && errors.group}
                            margin="normal"
                            variant="outlined"
                            labelId="group_label"
                            id="group"
                            name="group"
                            value={values.group}
                            onChange={handleChange}
                            label="Group"
                          >
                            {/* <MenuItem value="">
                            <em>None</em>
                          </MenuItem> */}
                            {groups.map(group => {
                              return (
                                <MenuItem key={group._id} value={group._id}>
                                  {group.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                        <TextField
                          fullWidth
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                          label="Name"
                          margin="normal"
                          name="name"
                          onChange={handleChange}
                          type="text"
                          value={values.name}
                          variant="outlined"
                        />

                        <TextField
                          fullWidth
                          error={Boolean(
                            touched.description && errors.description
                          )}
                          helperText={touched.description && errors.description}
                          label="Description"
                          margin="normal"
                          multiline
                          name="description"
                          onChange={handleChange}
                          type="description"
                          value={values.description}
                          variant="outlined"
                        />
                        <TextField
                          fullWidth
                          error={Boolean(touched.width && errors.width)}
                          helperText={touched.width && errors.width}
                          label="Width"
                          margin="normal"
                          name="width"
                          onChange={handleChange}
                          type="number"
                          value={values.width}
                          variant="outlined"
                        />
                        <TextField
                          fullWidth
                          error={Boolean(touched.height && errors.height)}
                          helperText={touched.height && errors.height}
                          label="Height"
                          margin="normal"
                          name="height"
                          onChange={handleChange}
                          type="number"
                          value={values.height}
                          variant="outlined"
                        />
                        <FormControl
                          fullWidth
                          variant="outlined"
                          className={classes.formControl}
                          margin="normal"
                        >
                          <InputLabel id="playlist_label">
                            Playlist Media
                          </InputLabel>
                          <Select
                            fullWidth
                            multiple
                            error={Boolean(touched.playlist && errors.playlist)}
                            helperText={touched.playlist && errors.playlist}
                            margin="normal"
                            variant="outlined"
                            labelId="playlist_label"
                            id="playlist"
                            name="playlist"
                            value={values.playlist}
                            onChange={handleChange}
                            label="Playlist Media"
                          >
                            {/* <MenuItem value="">
                            <em>None</em>
                          </MenuItem> */}
                            {playlistMedias.map(playlist => {
                              return (
                                <MenuItem
                                  key={playlist._id}
                                  value={playlist._id}
                                  style={getStyles(
                                    playlist._id,
                                    values.playlist,
                                    theme
                                  )}
                                >
                                  {playlist.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                        <FormControl
                          fullWidth
                          variant="outlined"
                          className={classes.formControl}
                          margin="normal"
                        >
                          <InputLabel id="type_label">Layout Type</InputLabel>
                          <Select
                            fullWidth
                            error={Boolean(touched.type && errors.type)}
                            helperText={touched.type && errors.type}
                            margin="normal"
                            variant="outlined"
                            labelId="type_label"
                            id="type"
                            name="type"
                            value={values.type}
                            onChange={handleChange}
                            label="Layout Type"
                          >
                            {/* <MenuItem value="">
                            <em>None</em>
                          </MenuItem> */}
                            {PlaylistTypes.map(type => {
                              return (
                                <MenuItem key={type.key} value={type.key}>
                                  {type.value}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={values.default}
                              color="primary"
                              name="default"
                              onChange={event => {
                                formProps.setFieldValue(
                                  'default',
                                  event.target.checked
                                );
                              }}
                            />
                          }
                          label="Mark as default"
                        />
                      </CardContent>
                      {/* <Divider /> */}
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-end"
                        padding="10px"
                      >
                        {/* <Box className={classes.imageStyle}>
                        <Image
                          src={imageFile}
                          aspectRatio={9 / 3}
                          alt="upload Image"
                          name="imageSource"
                        />
                      </Box> */}
                        <Box>
                          <Button
                            color="red"
                            variant="contained"
                            // type="submit"
                            // className={classes.buttonStyle}

                            // disabled={isSubmitting}
                            onClick={() => {
                              navigate(-1);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            color="primary"
                            variant="contained"
                            type="submit"
                            className={classes.buttonStyle}
                            disabled={isSubmitting}
                          >
                            Update Playlist
                          </Button>
                        </Box>
                      </Box>
                    </Card>
                  </form>
                </React.Fragment>
              );
            }}
          </Formik>
        </Container>
        {/* </Box>
    </div> */}
      </Page>
    ) : null;
  return page;
};

export default EditPlaylist;
