import React, { useEffect, useState, useContext } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik, FieldArray } from 'formik';
import CONSTANTS from '../../constants';
import { isEmpty, isUndefined, find } from 'lodash';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AuthContext from 'src/context/auth-context';
import DateFnsUtils from '@date-io/date-fns';
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
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
  RadioPlayer,
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

const EditPlayer = props => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  let [playerData, setPlayerData] = useState(null);
  const [logoImageFile, setLogoImage] = useState(null);
  // const [iconImageFile, setIconImage] = useState(null);
  const [services, getServices] = useState([]);
  //   const [editorState, getEditorState] = useState(EditorState.createEmpty());
  const [translationModel, setTranslationModel] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [groups, setGroups] = useState(null);
  const [disabledSubmit, setDisabledSubmit] = useState(false);
  // const [roles, setRoles] = useState(null);
  // const { player } = useContext(AuthContext);

  //   const [players, getPlayers] = useState([]);

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
    getSinglePlayer();
    getAllGroups();
    // getAllRoles();
    // getAllPlayers();
    // getAllPlayers();
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

  const getSinglePlayer = () => {
    axios
      .get(CONSTANTS.BASE_URL + 'api/player/' + id)
      .then(response => {
        console.log('get resoposldsl', response.data);
        const playerData = response.data;
        // const html = playerData.description || '';
        // const contentBlock = htmlToDraft(html);
        // if (contentBlock) {
        //   const contentState = ContentState.createFromBlockArray(
        //     contentBlock.contentBlocks
        //   );
        //   let editorState = EditorState.createWithContent(contentState);
        //   getEditorState(editorState);
        // }
        setPlayerData(playerData);
        setProfileImageFile(CONSTANTS.BASE_URL + playerData.image_url);
        // setIconImage(CONSTANTS.BASE_URL + playerData.icon_url);
        // setImage(CONSTANTS.BASE_URL+playerData.imageUrl);
        //   getBills(allBills);
      })
      .catch(error => {
        console.log(error);
      });
  };

  // const getAllPlayers = () => {
  //   axios.get(CONSTANTS.BASE_URL+'api/player',{params:{limit:1000,page:1}})
  //   .then(response => {
  //   //   console.log("service data",response.data);
  //     const allPlayers = response.data.players;
  //     getPlayers(allPlayers);
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
  //     if (isEmpty(players)) setDisabledSubmit(true);
  //     return true;
  //   } else {
  //     setDisabledSubmit(false);
  //     return false;
  //   }
  // };

  // const getRolesWithPlayerId = playerId => {
  //   // setRoles([]);
  //   axios
  //     .get(CONSTANTS.BASE_URL + 'api/role', {
  //       params: { page: 1, limit: 10000, player_id: playerId }
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
  const PlayerTypes = [
    { key: 'simple', value: 'Simple' },
    { key: 'template', value: 'Template' }
  ];
  let page =
    playerData && groups ? (
      <Page className={classes.root} title="Update Player">
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
              display_name: playerData.display_name,
              device_key: playerData.device_key,
              description: playerData.description ? playerData.description : '',
              group: playerData.group,
              valid_from: playerData.valid_from,
              sleep_time: playerData.sleep_time ? playerData.sleep_time : null,
              wakeup_time: playerData.wakeup_time
                ? playerData.wakeup_time
                : null
            }}
            validationSchema={Yup.object().shape({
              display_name: Yup.string().required('Display name required'),
              // device_key: Yup.string().required('Device key required'),
              description: Yup.string(),
              group: Yup.string().required('Group required'),
              valid_from: Yup.date()
                .min(new Date(), 'Valid from should be greater than now')
                .required('Valid from required')
            })}
            onSubmit={values => {
              let data = {};
              data.display_name = values.display_name;
              // data.device_key = values.device_key;
              if (!isEmpty(values.description))
                data.description = values.description;
              if (values.sleep_time) data.sleep_time = values.sleep_time;
              if (values.wakeup_time) data.wakeup_time = values.wakeup_time;
              data.group = values.group;
              data.valid_from = values.valid_from;

              axios
                .put(CONSTANTS.BASE_URL + 'api/player/' + playerData._id, data)
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
                        title="Update Player"
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
                          error={Boolean(
                            touched.device_key && errors.device_key
                          )}
                          helperText={touched.device_key && errors.device_key}
                          label="Device Key"
                          margin="normal"
                          disabled
                          name="device_key"
                          onChange={handleChange}
                          type="text"
                          value={values.device_key}
                          variant="outlined"
                        />
                        <TextField
                          fullWidth
                          error={Boolean(
                            touched.display_name && errors.display_name
                          )}
                          helperText={
                            touched.display_name && errors.display_name
                          }
                          label="Display Name"
                          margin="normal"
                          name="display_name"
                          onChange={handleChange}
                          type="text"
                          value={values.display_name}
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
                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <DateTimePicker
                                label="Valid From"
                                name="valid_from"
                                autoOk={true}
                                margin="normal"
                                // disableToolbar
                                error={Boolean(
                                  touched.valid_from && errors.valid_from
                                )}
                                helperText={
                                  touched.valid_from && errors.valid_from
                                }
                                variant="inline"
                                inputVariant="outlined"
                                fullWidth
                                value={values.valid_from}
                                onChange={date => {
                                  formProps.setFieldValue('valid_from', date);
                                }}
                              />
                            </MuiPickersUtilsProvider>
                          </Grid>
                          <Grid item xs={4}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <TimePicker
                                label="Sleep Time"
                                name="sleep_time"
                                autoOk={true}
                                margin="normal"
                                // disableToolbar
                                error={Boolean(
                                  touched.sleep_time && errors.sleep_time
                                )}
                                helperText={
                                  touched.sleep_time && errors.sleep_time
                                }
                                variant="inline"
                                inputVariant="outlined"
                                fullWidth
                                value={values.sleep_time}
                                onChange={date => {
                                  formProps.setFieldValue('sleep_time', date);
                                }}
                              />
                            </MuiPickersUtilsProvider>
                          </Grid>
                          <Grid item xs={4}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <TimePicker
                                label="Wake up time"
                                name="wakeup_time"
                                autoOk={true}
                                margin="normal"
                                // disableToolbar
                                error={Boolean(
                                  touched.wakeup_time && errors.wakeup_time
                                )}
                                helperText={
                                  touched.wakeup_time && errors.wakeup_time
                                }
                                variant="inline"
                                inputVariant="outlined"
                                fullWidth
                                value={values.wakeup_time}
                                onChange={date => {
                                  formProps.setFieldValue('wakeup_time', date);
                                }}
                              />
                            </MuiPickersUtilsProvider>
                          </Grid>
                        </Grid>
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
                            Update Player
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

export default EditPlayer;
