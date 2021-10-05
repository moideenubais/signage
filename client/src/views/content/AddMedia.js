import React, { useEffect, useState, useContext } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik, FieldArray } from 'formik';
import CONSTANTS from '../../constants';
import axios from 'axios';
// import Image from 'material-ui-image';
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
  RadioGroup,
  RadioContent,
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

const AddMedia = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const [file, setFile] = useState(null);
  const [iconImageFile, setIconImage] = useState(null);
  const [translationModel, setTranslationModel] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [associates, setAssociates] = useState(null);
  const [disabledSubmit, setDisabledSubmit] = useState(false);
  // const [roles, setRoles] = useState(null);
  // const { associate } = useContext(AuthContext);

  const getImages = images => {
    return images.map((image, index) => (
      <img className={classes.uploadBigImage} src={image} key={index + image} />
    ));
  };

  useEffect(() => {
    // getAllAssociates();
    // getAllRoles();
  }, []);

  const getAllAssociates = () => {
    axios
      .get(CONSTANTS.BASE_URL + 'api/associate', {
        params: { page: 1, limit: 10000 }
      })
      .then(response => {
        const allAssociates = response.data.associates;
        if (!isEmpty(allAssociates)) {
          console.log('assocaite', allAssociates);
          setAssociates(allAssociates);
        } else {
          setAssociates([]);
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

  //   let logoImageRender = file ? (
  //     <Image src={file} aspectRatio={9 / 3} alt="uploaded logo image" />
  //   ) : null;

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
  //   getAllMedias();
  // },[]);

  // const getLanguageLabel = key => {
  //   return privileges.filter(language => language.key === key)[0].label;
  // };

  // const getAllMedias = () => {
  //   axios.get(CONSTANTS.BASE_URL+'api/associate',{params:{limit:1000,page:1}})
  //   .then(response => {
  //     // console.log("associate data",response.data.associates);
  //     const allMedias = response.data.associates;
  //     getMedias(allMedias);
  //     // setLoading(false);
  //   //   menu = allMedias.map((associate)=>{
  //   //       console.log("sdlksl",associate)
  //   //       return(<MenuItem value={associate._id}>{associate.name}</MenuItem>)
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
  //     if (isEmpty(associates)) setDisabledSubmit(true);
  //     return true;
  //   } else {
  //     setDisabledSubmit(false);
  //     return false;
  //   }
  // };
  // const getRolesWithMediaId = associateId => {
  //   // setRoles([]);
  //   axios
  //     .get(CONSTANTS.BASE_URL + 'api/role', {
  //       params: { page: 1, limit: 10000, associate_id: associateId }
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
  const transitionTypes = [
    { key: 'fade', value: 'Fade' },
    { key: 'bandedSwirl', value: 'BandedSwirl' },
    { key: 'blinds', value: 'Blinds' },
    { key: 'blood', value: 'Blood' },
    { key: 'circleReveal', value: 'CircleReveal' },
    { key: 'circleStretch', value: 'CircleStretch' },
    { key: 'circularBlur', value: 'CircularBlur' },
    { key: 'cloudReveral', value: 'CloudReveral' },
    { key: 'crumble', value: 'Crumble' },
    { key: 'dissolve', value: 'Dissolve' },
    { key: 'dropFade', value: 'DropFade' },
    { key: 'leastBright', value: 'LeastBright' },
    { key: 'lineReveal', value: 'LineReveal' },
    { key: 'mostBright', value: 'MostBright' },
    { key: 'pixelateIn', value: 'PixelateIn' },
    { key: 'pixelateOut', value: 'PixelateOut' },
    { key: 'pixelate', value: 'Pixelate' },
    { key: 'rotateRadialBlur', value: 'RotateRadialBlur' },
    { key: 'radialWiggle', value: 'RadialWiggle' },
    { key: 'randomCircleReveal', value: 'RandomCircleReveal' },
    { key: 'ripple', value: 'Ripple' },
    { key: 'rotate', value: 'Rotate' },
    { key: 'saturate', value: 'Saturate' },
    { key: 'shrink', value: 'Shrink' },
    { key: 'slideIn', value: 'SlideIn' },
    { key: 'smoothSwirl', value: 'SmoothSwirl' },
    { key: 'swirl', value: 'Swirl' },
    { key: 'water', value: 'Water' },
    { key: 'wave', value: 'Wave' }
  ];

  const page = (
    <Page className={classes.root} title="Add Media">
      <Container maxWidth="md">
        <Formik
          initialValues={{
            media_type: 'url',
            name: '',
            duration: '',
            type: '',
            resolution: '',
            active: false,
            transition: transitionTypes[0].key,
            active_date: null,
            expire_date: null,
            url: '',
            height: '',
            width: '',
            media_url: ''
          }}
          validationSchema={Yup.object().shape({
            media_type: Yup.string(),
            media_url: Yup.string().when('media_type', {
              is: 'url',
              then: Yup.string().required('URL required')
            }),
            height: Yup.number().when('media_type', {
              is: 'url',
              then: Yup.number().required('Height required')
            }),
            width: Yup.number().when('media_type', {
              is: 'url',
              then: Yup.number().required('Width required')
            }),

            name: Yup.string().required('Name required'),
            duration: Yup.string().required('Duration required'),
            type: Yup.string().when('media_type', {
              is: 'file_upload',
              then: Yup.string().required('Type required')
            }),
            resolution: Yup.string().when('media_type', {
              is: 'file_upload',
              then: Yup.string().required('Type required')
            }),
            transition: Yup.string().required('Transition required'),
            
          })}
          onSubmit={values => {
            console.log('valsues', values);
            // return;
            let data = new FormData();
            data.append('name', values.name);
            data.append('duration', values.duration);
            if (values.media_type !== 'url') data.append('type', values.type);
            else data.append('type', 'url');
            data.append('active', values.active);
            if (values.media_type !== 'url')
              data.append('resolution', values.resolution);
            else {
              data.append('resolution', `${values.width}x${values.height}`);
            }
            data.append('transition', values.transition);
            if (values.active_date)
              data.append('active_date', values.active_date);
            if (values.expire_date)
              data.append('expire_date', values.expire_date);
            if (values.media_type !== 'url' && !isEmpty(values.url.name)) {
              data.append('media_file', values.url);
            }
            if (values.media_type === 'url')
              data.append('url', values.media_url);
            axios
              .post(CONSTANTS.BASE_URL + 'api/media/' + id, data)
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
                      title="Add Media"
                    />
                    <Divider />
                    <CardContent>
                      <RadioGroup
                        row
                        aria-label="media_type"
                        name="media_type"
                        value={values.media_type}
                        onChange={event => {
                          formProps.setFieldValue(
                            'media_type',
                            event.target.value
                          );
                          setFile(null);
                        }}
                        // defaultValue="top"
                      >
                        <FormControlLabel
                          value="url"
                          control={<Radio color="primary" />}
                          label="URL"
                          labelPlacement="end"
                        />
                        <FormControlLabel
                          value="file_upload"
                          control={<Radio color="primary" />}
                          label="File Upload"
                          labelPlacement="end"
                        />
                      </RadioGroup>
                      {values.media_type !== 'url' && (
                        <Box mt={2}>
                          <input
                            accept="image/*,video/*"
                            style={{ display: 'none' }}
                            id="url"
                            type="file"
                            name="url"
                            onChange={event => {
                              if (event.target.files) {
                                let fileArray = Array.from(
                                  event.target.files
                                ).map(file => URL.createObjectURL(file));
                                setFile(fileArray[0]);
                                formProps.setFieldValue(
                                  'url',
                                  event.target.files[0]
                                );
                                //video start
                                if (
                                  event.target.files[0].type.includes('video')
                                ) {
                                  const video = document.createElement('video');
                                  video.addEventListener(
                                    'loadedmetadata',
                                    event => {
                                      formProps.setFieldValue(
                                        'resolution',
                                        `${video.videoWidth}x${video.videoHeight}`
                                      );
                                      formProps.setFieldValue(
                                        'duration',
                                        Math.trunc(video.duration)
                                      );
                                      console.log(
                                        'hello here video width heiht is',
                                        video.videoWidth,
                                        video.videoHeight
                                      );
                                    }
                                  );
                                  video.src = URL.createObjectURL(
                                    event.target.files[0]
                                  );
                                }
                                //video end
                                //start
                                if (
                                  event.target.files[0].type.includes('image')
                                ) {
                                  var reader = new FileReader();
                                  reader.onload = function(e) {
                                    var img = new Image();
                                    img.onload = function() {
                                      formProps.setFieldValue(
                                        'resolution',
                                        `${img.width}x${img.height}`
                                      );
                                    };
                                    img.src = reader.result;
                                  };
                                  reader.readAsDataURL(event.target.files[0]);
                                }
                                //end
                                console.log(
                                  'j++++++++++++++++++',
                                  event.target.files[0]
                                );
                                formProps.setFieldValue(
                                  'name',
                                  event.target.files[0].name
                                );
                                formProps.setFieldValue(
                                  'type',
                                  event.target.files[0].type
                                );
                              }
                            }}
                          />
                          <label htmlFor="url">
                            <Button
                              variant="contained"
                              color="primary"
                              component="span"
                            >
                              Upload File
                            </Button>
                          </label>
                        </Box>
                      )}
                      {file &&
                        values.url.type &&
                        values.url.type.includes('image') && (
                          <div> {getImages([file])}</div>
                        )}
                      {file &&
                        values.url.type &&
                        values.url.type.includes('video') && (
                          <div style={{ marginTop: '10px' }}>
                            <video width="150" height="100" controls>
                              <source src={file} type={values.url.type} />
                            </video>
                          </div>
                        )}
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
                      {values.media_type === 'url' && (
                        <TextField
                          fullWidth
                          error={Boolean(touched.media_url && errors.media_url)}
                          helperText={touched.media_url && errors.media_url}
                          label="URL"
                          margin="normal"
                          name="media_url"
                          onChange={handleChange}
                          type="text"
                          value={values.media_url}
                          variant="outlined"
                        />
                      )}
                      <TextField
                        fullWidth
                        error={Boolean(touched.duration && errors.duration)}
                        helperText={touched.duration && errors.duration}
                        label="Duration"
                        disabled={
                          values.url['type'] &&
                          values.url['type'].includes('video')
                            ? true
                            : false
                        }
                        margin="normal"
                        name="duration"
                        onChange={handleChange}
                        type="number"
                        value={values.duration}
                        variant="outlined"
                      />
                      {values.media_type !== 'url' && (
                        <TextField
                          fullWidth
                          error={Boolean(touched.type && errors.type)}
                          helperText={touched.type && errors.type}
                          label="Type"
                          margin="normal"
                          name="type"
                          onChange={handleChange}
                          type="text"
                          disabled
                          value={values.type}
                          variant="outlined"
                        />
                      )}
                      {values.media_type === 'url' && (
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
                      )}
                      {values.media_type === 'url' && (
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
                      )}
                      {values.media_type !== 'url' && (
                        <TextField
                          fullWidth
                          error={Boolean(
                            touched.resolution && errors.resolution
                          )}
                          helperText={touched.resolution && errors.resolution}
                          label="Size"
                          margin="normal"
                          name="resolution"
                          disabled
                          onChange={handleChange}
                          type="text"
                          value={values.resolution}
                          variant="outlined"
                        />
                      )}
                      <FormControl
                        fullWidth
                        variant="outlined"
                        // className={classes.formControl}
                        margin="normal"
                      >
                        <InputLabel id="transition_label">
                          Transition
                        </InputLabel>
                        <Select
                          fullWidth
                          error={Boolean(
                            touched.transition && errors.transition
                          )}
                          helperText={touched.transition && errors.transition}
                          margin="normal"
                          variant="outlined"
                          labelId="transition_label"
                          id="transition"
                          name="transition"
                          value={values.transition}
                          onChange={handleChange}
                          label="Transition"
                        >
                          {/* <MenuItem value="">
                            <em>None</em>
                          </MenuItem> */}
                          {transitionTypes.map(transition => {
                            return (
                              <MenuItem
                                key={transition.key}
                                value={transition.key}
                              >
                                {transition.value}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DateTimePicker
                              label="Active Date"
                              name="active_date"
                              autoOk={true}
                              margin="normal"
                              // disableToolbar
                              error={Boolean(
                                touched.active_date && errors.active_date
                              )}
                              helperText={
                                touched.active_date && errors.active_date
                              }
                              variant="inline"
                              inputVariant="outlined"
                              fullWidth
                              value={values.active_date}
                              onChange={date => {
                                formProps.setFieldValue('active_date', date);
                              }}
                            />
                          </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={6}>
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DateTimePicker
                              label="Expire Date"
                              error={Boolean(
                                touched.expire_date && errors.expire_date
                              )}
                              helperText={
                                touched.expire_date && errors.expire_date
                              }
                              // format="dd/MMM/yyyy"
                              name="expire_date"
                              margin="normal"
                              autoOk={true}
                              // disableToolbar
                              variant="inline"
                              inputVariant="outlined"
                              fullWidth
                              value={values.expire_date}
                              onChange={date => {
                                formProps.setFieldValue('expire_date', date);
                              }}
                            />
                          </MuiPickersUtilsProvider>
                        </Grid>
                      </Grid>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={values.active}
                            color="primary"
                            name="active"
                            onChange={event => {
                              formProps.setFieldValue(
                                'active',
                                event.target.checked
                              );
                            }}
                          />
                        }
                        label="Mark as active"
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
                          Add Media
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

export default AddMedia;
