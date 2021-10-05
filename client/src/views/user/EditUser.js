import React, { useEffect, useState, useContext } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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
  RadioGroup,
  FormLabel,
  FormControlLabel,
  Grid
} from '@material-ui/core';
import Page from 'src/components/Page';
import Image from 'material-ui-image';
import axios from 'axios';
import getPrivileges from '../../utils/getPrivileges';
import TabPanel from 'src/components/TabPanel';
import Notification from 'src/components/Notification';

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

const EditUser = props => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  let [userData, setUserData] = useState(null);
  const [logoImageFile, setLogoImage] = useState(null);
  // const [iconImageFile, setIconImage] = useState(null);
  const [services, getServices] = useState([]);
  //   const [editorState, getEditorState] = useState(EditorState.createEmpty());
  const [users, getUsers] = useState([]);
  const [translationModel, setTranslationModel] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [associates, setAssociates] = useState(null);
  const [disabledSubmit, setDisabledSubmit] = useState(false);
  // const [roles, setRoles] = useState(null);
  const { user } = useContext(AuthContext);
  const privileges = getPrivileges(user.privileges);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    type: ''
  });

  //   const [users, getUsers] = useState([]);

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
    getSingleUser();
    getAllAssociates();
    // getAllRoles();
    // getAllUsers();
    // getAllUsers();
  }, []);

  const getAllAssociates = () => {
    axios
      .get(CONSTANTS.BASE_URL + 'api/associate', {
        params: { page: 1, limit: 10000 }
      })
      .then(response => {
        // console.log("+++++++++++++++++++",response.data.associates);
        const allAssociates = response.data.associates;
        if (!isEmpty(allAssociates)) {
          // const totalRows = response.data.info.totalNumber;
          // setTotalRows(totalRows);
          // console.log("totol",totalRows)
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

  const getSingleUser = () => {
    axios
      .get(CONSTANTS.BASE_URL + 'api/user/' + id)
      .then(response => {
        console.log('get resoposldsl', response.data);
        const userData = response.data;
        // const html = userData.description || '';
        // const contentBlock = htmlToDraft(html);
        // if (contentBlock) {
        //   const contentState = ContentState.createFromBlockArray(
        //     contentBlock.contentBlocks
        //   );
        //   let editorState = EditorState.createWithContent(contentState);
        //   getEditorState(editorState);
        // }
        setUserData(userData);
        setProfileImageFile(CONSTANTS.BASE_URL + userData.image_url);
        // setIconImage(CONSTANTS.BASE_URL + userData.icon_url);
        // setImage(CONSTANTS.BASE_URL+userData.imageUrl);
        //   getBills(allBills);
      })
      .catch(error => {
        console.log(error);
      });
  };

  // const getAllUsers = () => {
  //   axios.get(CONSTANTS.BASE_URL+'api/user',{params:{limit:1000,page:1}})
  //   .then(response => {
  //   //   console.log("service data",response.data);
  //     const allUsers = response.data.users;
  //     getUsers(allUsers);
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

  const isDeliveryBoy = privileges => {
    if (privileges.includes('delivery_boy')) return true;
    return false;
  };
  const isSeller = privileges => {
    if (privileges.includes('seller')) {
      if (isEmpty(associates)) setDisabledSubmit(true);
      return true;
    } else {
      setDisabledSubmit(false);
      return false;
    }
  };

  // const getRolesWithAssociateId = associateId => {
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

  // const [values,setValues] = useState({
  //   billId: '',
  //   customerName: '',
  //   mobile: '',
  //   details: ''
  // })

  let page =
    userData && associates ? (
      <Page className={classes.root} title="Update User">
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
              associate: userData.associate,
              mobile: userData.mobile,
              privileges: userData.privileges,
              name: userData.name,
              email: userData.email,
              password: '',
              address: userData.address ? userData.address : '',
              confirm_password: ''
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string().required('Name required'),
              email: Yup.string().required('Email required'),
              associate: Yup.string().required('Associate required'),
              password: Yup.string().matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
              ),
              confirm_password: Yup.string().oneOf(
                [Yup.ref('password'), null],
                'Passwords must match'
              ),
              mobile: Yup.string()
                .required('Mobile number required')
                .matches(
                  /^(\+\d{1,3}[- ]?)?\d{10}$/,
                  'Mobile number has to be of form county code - 10 digit mobile number, county code is optional'
                )
            })}
            onSubmit={values => {
              let data = {};
              data.name = values.name;
              data.associate = values.associate;
              data.mobile = values.mobile;
              if (!isEmpty(values.address)) data.address = values.address;
              if (!isEmpty(values.privileges))
                data.privileges = values.privileges;
              axios
                .put(CONSTANTS.BASE_URL + 'api/user/' + userData._id, data)
                .then(response => {
                  // console.log(response.data);
                  const bill = response.data;
                  // getBills(allBills);
                  // navigate('/bills', { replace: true });
                  // props.history.goBack();
                  dispatch({
                    type: 'OPEN',
                    payload: {
                      type: 'success',
                      message: 'User updated successfully'
                    }
                  });
                  // setNotify({
                  //   isOpen: true,
                  //   type: 'success',
                  //   message: 'User updated successfully'
                  // });
                  navigate(-1);
                })
                .catch(error => {
                  // setNotify({
                  //   isOpen: true,
                  //   type: 'error',
                  //   message: 'User updation failed'
                  // });
                  dispatch({
                    type: 'OPEN',
                    payload: {
                      type: 'error',
                      message: 'User updation failed'
                    }
                  });
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
            }) => (
              <React.Fragment>
                <form onSubmit={handleSubmit}>
                  <Card>
                    <CardHeader
                      // subheader="Update Bill"
                      title="Update User"
                    />
                    <Divider />
                    <CardContent>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        className={classes.formControl}
                      >
                        <InputLabel id="associate_label">Associate</InputLabel>
                        <Select
                          fullWidth
                          error={Boolean(touched.associate && errors.associate)}
                          helperText={touched.associate && errors.associate}
                          margin="normal"
                          variant="outlined"
                          labelId="associate_label"
                          id="associate"
                          name="associate"
                          value={values.associate}
                          onChange={handleChange}
                          label="Associate"
                        >
                          {associates.map(associate => {
                            return (
                              <MenuItem
                                key={associate._id}
                                value={associate._id}
                              >
                                {associate.name}
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
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email && errors.email}
                        label="Email"
                        margin="normal"
                        disabled
                        name="email"
                        onChange={handleChange}
                        type="email"
                        value={values.email}
                        variant="outlined"
                      />

                      <TextField
                        fullWidth
                        error={Boolean(touched.password && errors.password)}
                        helperText={touched.password && errors.password}
                        label="Password"
                        margin="normal"
                        name="password"
                        disabled
                        onChange={handleChange}
                        type="password"
                        value={values.password}
                        variant="outlined"
                      />
                      <TextField
                        fullWidth
                        error={Boolean(
                          touched.confirm_password && errors.confirm_password
                        )}
                        helperText={
                          touched.confirm_password && errors.confirm_password
                        }
                        disabled
                        label="Confirm Password"
                        margin="normal"
                        name="confirm_password"
                        onChange={handleChange}
                        type="confirm_password"
                        value={values.confirm_password}
                        variant="outlined"
                      />
                      <TextField
                        fullWidth
                        error={Boolean(touched.address && errors.address)}
                        helperText={touched.address && errors.address}
                        label="Address"
                        margin="normal"
                        multiline
                        name="address"
                        onChange={handleChange}
                        type="address"
                        value={values.address}
                        variant="outlined"
                      />
                      <TextField
                        fullWidth
                        error={Boolean(touched.mobile && errors.mobile)}
                        helperText={touched.mobile && errors.mobile}
                        label="Mobile"
                        margin="normal"
                        name="mobile"
                        onChange={handleChange}
                        type="mobile"
                        value={values.mobile}
                        variant="outlined"
                      />
                      <FormControl
                        fullWidth
                        variant="outlined"
                        className={classes.formControl}
                        margin="normal"
                      >
                        <InputLabel id="privileges_label">
                          Privileges
                        </InputLabel>
                        <Select
                          fullWidth
                          error={Boolean(
                            touched.privileges && errors.privileges
                          )}
                          helperText={touched.privileges && errors.privileges}
                          margin="normal"
                          variant="outlined"
                          labelId="privileges_label"
                          id="privileges"
                          name="privileges"
                          value={values.privileges}
                          onChange={handleChange}
                          label="Privileges"
                          multiple
                        >
                          {privileges.map(privilege => {
                            return (
                              <MenuItem
                                key={privilege.key}
                                value={privilege.key}
                              >
                                {privilege.label}
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
                          Update User
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                </form>
              </React.Fragment>
            )}
          </Formik>
        </Container>
        {/* </Box>
    </div> */}
      </Page>
    ) : null;
  return page;
};

export default EditUser;
