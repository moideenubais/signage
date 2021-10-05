import React, { useEffect, useState, useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik, FieldArray } from 'formik';
import CONSTANTS from '../../constants';
import axios from 'axios';
import Image from 'material-ui-image';
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
  Input,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Select,
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
import { isEmpty, rest } from 'lodash';
import Spinner from '../../components/Spinner';
import TabPanel from 'src/components/TabPanel';
import getPrivileges from '../../utils/getPrivileges';

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
  buttonStyle: {
    // width: '100px',
    // height:"50px",
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

const AddPlaylist = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const theme = useTheme();
  const [logoImageFile, setLogoImage] = useState(null);
  const [iconImageFile, setIconImage] = useState(null);
  const [translationModel, setTranslationModel] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [groups, setGroups] = useState(null);
  const [disabledSubmit, setDisabledSubmit] = useState(false);
  // const [roles, setRoles] = useState(null);
  // const { associate } = useContext(AuthContext);

  const getImages = images => {
    return images.map((image, index) => (
      <img className={classes.uploadBigImage} src={image} key={index + image} />
    ));
  };

  useEffect(() => {
    getAllGroups();
    // getAllRoles();
  }, []);

  const getAllGroups = () => {
    axios
      .get(CONSTANTS.BASE_URL + 'api/group', {
        params: { page: 1, limit: 10000 }
      })
      .then(response => {
        const allGroups = response.data.groups;
        if (!isEmpty(allGroups)) {
          console.log('assocaite', allGroups);
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

  let logoImageRender = logoImageFile ? (
    <Image src={logoImageFile} aspectRatio={9 / 3} alt="uploaded logo image" />
  ) : null;

  // let iconImageRender = (iconImageFile)?<Image
  //   src={iconImageFile}
  //   aspectRatio={9 / 3}
  //   alt="uploaded icon image"
  // /> : null;
  //   let menu = null;
  // let logoImageRender = logoImageFile ? (
  //   <Image src={logoImageFile} aspectRatio={9 / 3} alt="upload Image" />
  // ) : null;

  // useEffect( () => {
  //   getAllPlaylists();
  // },[]);

  // const getLanguageLabel = key => {
  //   return privileges.filter(language => language.key === key)[0].label;
  // };

  // const getAllPlaylists = () => {
  //   axios.get(CONSTANTS.BASE_URL+'api/group',{params:{limit:1000,page:1}})
  //   .then(response => {
  //     // console.log("group data",response.data.groups);
  //     const allPlaylists = response.data.groups;
  //     getPlaylists(allPlaylists);
  //     // setLoading(false);
  //   //   menu = allPlaylists.map((group)=>{
  //   //       console.log("sdlksl",group)
  //   //       return(<MenuItem value={group._id}>{group.name}</MenuItem>)
  //   //       });
  //   })
  //   .catch(error => {
  //     console.log(error)
  //     // setLoading(false)
  //   })
  // }

  // const onEditorStateChange = editorState => {
  //   getEditorState(editorState);
  // };
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
  // const isDeliveryBoy = privileges => {
  //   if (privileges.includes('delivery_boy')) return true;
  //   return false;
  // };
  // const isSeller = privileges => {
  //   if (privileges.includes('seller')) {
  //     if (isEmpty(groups)) setDisabledSubmit(true);
  //     return true;
  //   } else {
  //     setDisabledSubmit(false);
  //     return false;
  //   }
  // };
  // const getRolesWithPlaylistId = groupId => {
  //   // setRoles([]);
  //   axios
  //     .get(CONSTANTS.BASE_URL + 'api/role', {
  //       params: { page: 1, limit: 10000, group_id: groupId }
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

  const PlaylistTypes = [
    { key: 'simple', value: 'Simple' },
    { key: 'template', value: 'Template' }
  ];
  const page = groups && (
    <Page className={classes.root} title="Add Playlist">
      <Container maxWidth="md">
        <Formik
          initialValues={{
            name: '',
            description: '',
            width: 100,
            height: 100,
            type: PlaylistTypes[0].key,
            default: false,
            group: ''
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
            console.log('valsues', values);
            // return;
            let data = {};
            data.name = values.name;
            if (!isEmpty(values.description))
              data.description = values.description;
            data.width = values.width;
            data.height = values.height;
            data.default = values.default;
            data.type = values.type;
            data.group = values.group;

            axios
              .post(CONSTANTS.BASE_URL + 'api/playlist', data)
              .then(response => {
                const bill = response.data;
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
            return (
              <React.Fragment>
                <form onSubmit={handleSubmit}>
                  <Card>
                    <CardHeader
                      // subheader="Add Bill"
                      title="Add Playlist"
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
                        label="Description"
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
                        label="Description"
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
                      {/* <Box className={classes.imageStyle}>{logoImageRender}</Box> */}
                      <Box>
                        <Button
                          color="red"
                          variant="contained"
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
                          // disabled={disabledSubmit}
                          disabled={isSubmitting}
                        >
                          Add Playlist
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
  );
  return page;
};

export default AddPlaylist;
