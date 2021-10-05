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
  RadioSchedule,
  FormLabel,
  FormControlLabel,
  Grid
} from '@material-ui/core';
import Page from 'src/components/Page';
import Image from 'material-ui-image';
import axios from 'axios';
import getPrivileges from '../../utils/getPrivileges';
import TabPanel from 'src/components/TabPanel';
import DateFnsUtils from '@date-io/date-fns';
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';

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

const EditSchedule = props => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  let [scheduleData, setScheduleData] = useState(null);
  const [logoImageFile, setLogoImage] = useState(null);
  // const [iconImageFile, setIconImage] = useState(null);
  const [services, getServices] = useState([]);
  //   const [editorState, getEditorState] = useState(EditorState.createEmpty());
  const [translationModel, setTranslationModel] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [groups, setGroups] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [disabledSubmit, setDisabledSubmit] = useState(false);
  // const [roles, setRoles] = useState(null);
  // const { schedule } = useContext(AuthContext);

  //   const [schedules, getSchedules] = useState([]);

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
    getSingleSchedule();
    getAllGroups();
    getAllPlaylists();
    // getAllRoles();
    // getAllSchedules();
    // getAllSchedules();
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
  const getAllPlaylists = () => {
    axios
      .get(CONSTANTS.BASE_URL + 'api/playlist', {
        params: { page: 1, limit: 10000 }
      })
      .then(response => {
        const allPlaylists = response.data.playlists;
        if (!isEmpty(allPlaylists)) {
          console.log('assocaite', allPlaylists);
          setPlaylists(allPlaylists);
        } else {
          setPlaylists([]);
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

  const getSingleSchedule = () => {
    axios
      .get(CONSTANTS.BASE_URL + 'api/schedule/' + id)
      .then(response => {
        console.log('get resoposldsl', response.data);
        const scheduleData = response.data;
        // const html = scheduleData.description || '';
        // const contentBlock = htmlToDraft(html);
        // if (contentBlock) {
        //   const contentState = ContentState.createFromBlockArray(
        //     contentBlock.contentBlocks
        //   );
        //   let editorState = EditorState.createWithContent(contentState);
        //   getEditorState(editorState);
        // }
        setScheduleData(scheduleData);
        setProfileImageFile(CONSTANTS.BASE_URL + scheduleData.image_url);
        // setIconImage(CONSTANTS.BASE_URL + scheduleData.icon_url);
        // setImage(CONSTANTS.BASE_URL+scheduleData.imageUrl);
        //   getBills(allBills);
      })
      .catch(error => {
        console.log(error);
      });
  };

  // const getAllSchedules = () => {
  //   axios.get(CONSTANTS.BASE_URL+'api/schedule',{params:{limit:1000,page:1}})
  //   .then(response => {
  //   //   console.log("service data",response.data);
  //     const allSchedules = response.data.schedules;
  //     getSchedules(allSchedules);
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
  //     if (isEmpty(schedules)) setDisabledSubmit(true);
  //     return true;
  //   } else {
  //     setDisabledSubmit(false);
  //     return false;
  //   }
  // };

  // const getRolesWithScheduleId = scheduleId => {
  //   // setRoles([]);
  //   axios
  //     .get(CONSTANTS.BASE_URL + 'api/role', {
  //       params: { page: 1, limit: 10000, schedule_id: scheduleId }
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
  const RecurrencyTypes = [
    { key: 'daily', value: 'Daily' },
    { key: 'weekly', value: 'Weekly' }
  ];
  let page =
    scheduleData && groups && playlists ? (
      <Page className={classes.root} title="Update Schedule">
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
              recurrency_type: scheduleData.recurrency_type,
              startDate: scheduleData.startDate,
              endDate: scheduleData.endDate,
              playlist_id: scheduleData.playlist_id,
              group: scheduleData.group
            }}
            validationSchema={Yup.object().shape({
              recurrency_type: Yup.string().required(
                'Recurrency type required'
              ),
              startDate: Yup.date()
                .min(new Date(), 'Start date shoud be greater than now')
                .required('Start Date required'),
              endDate: Yup.date()
                .min(
                  Yup.ref('startDate'),
                  "End date can't be before Start date"
                )
                .required('End Date required'),
              playlist_id: Yup.string().required('Playlist required'),
              group: Yup.string().required('Group required')
            })}
            onSubmit={values => {
              let data = {};
              data.recurrency_type = values.recurrency_type;
              data.startDate = values.startDate;
              data.endDate = values.endDate;
              data.playlist_id = values.playlist_id;
              data.group = values.group;

              axios
                .put(
                  CONSTANTS.BASE_URL + 'api/schedule/' + scheduleData._id,
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
                        title="Update Schedule"
                      />
                      <Divider />
                      <CardContent>
                        <FormControl
                          fullWidth
                          variant="outlined"
                          margin="normal"
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
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <DateTimePicker
                                label="Start Date"
                                name="startDate"
                                autoOk={true}
                                margin="normal"
                                // disableToolbar
                                error={Boolean(
                                  touched.startDate && errors.startDate
                                )}
                                helperText={
                                  touched.startDate && errors.startDate
                                }
                                variant="inline"
                                inputVariant="outlined"
                                fullWidth
                                value={values.startDate}
                                onChange={date => {
                                  formProps.setFieldValue('startDate', date);
                                }}
                              />
                            </MuiPickersUtilsProvider>
                          </Grid>
                          <Grid item xs={6}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <DateTimePicker
                                label="End Date"
                                error={Boolean(
                                  touched.endDate && errors.endDate
                                )}
                                helperText={touched.endDate && errors.endDate}
                                // format="dd/MMM/yyyy"
                                name="endDate"
                                margin="normal"
                                autoOk={true}
                                // disableToolbar
                                variant="inline"
                                inputVariant="outlined"
                                fullWidth
                                value={values.endDate}
                                onChange={date => {
                                  formProps.setFieldValue('endDate', date);
                                }}
                              />
                            </MuiPickersUtilsProvider>
                          </Grid>
                        </Grid>
                        <FormControl
                          fullWidth
                          variant="outlined"
                          margin="normal"
                          className={classes.formControl}
                        >
                          <InputLabel id="playlist_id_label">
                            Playlist
                          </InputLabel>
                          <Select
                            fullWidth
                            error={Boolean(
                              touched.playlist_id && errors.playlist_id
                            )}
                            helperText={
                              touched.playlist_id && errors.playlist_id
                            }
                            margin="normal"
                            variant="outlined"
                            labelId="playlist_id_label"
                            id="playlist_id"
                            name="playlist_id"
                            value={values.playlist_id}
                            onChange={handleChange}
                            label="Playlist"
                          >
                            {/* <MenuItem value="">
                            <em>None</em>
                          </MenuItem> */}
                            {playlists.map(playlist => {
                              return (
                                <MenuItem
                                  key={playlist._id}
                                  value={playlist._id}
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
                          <InputLabel id="recurrency_type_label">
                            Layout Type
                          </InputLabel>
                          <Select
                            fullWidth
                            error={Boolean(
                              touched.recurrency_type && errors.recurrency_type
                            )}
                            helperText={
                              touched.recurrency_type && errors.recurrency_type
                            }
                            margin="normal"
                            variant="outlined"
                            labelId="recurrency_type_label"
                            id="recurrency_type"
                            name="recurrency_type"
                            value={values.recurrency_type}
                            onChange={handleChange}
                            label="Layout Type"
                          >
                            {/* <MenuItem value="">
                            <em>None</em>
                          </MenuItem> */}
                            {RecurrencyTypes.map(type => {
                              return (
                                <MenuItem key={type.key} value={type.key}>
                                  {type.value}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
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
                            Update Schedule
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

export default EditSchedule;
