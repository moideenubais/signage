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
  RadioGroup,
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

const AddUser = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const theme = useTheme();
  const [logoImageFile, setLogoImage] = useState(null);
  const [iconImageFile, setIconImage] = useState(null);
  const [users, getUsers] = useState([]);
  const [translationModel, setTranslationModel] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [associates, setAssociates] = useState(null);
  const [disabledSubmit, setDisabledSubmit] = useState(false);
  // const [roles, setRoles] = useState(null);
  const { user } = useContext(AuthContext);
  const privileges = getPrivileges(user.privileges);

  const getImages = images => {
    return images.map((image, index) => (
      <img className={classes.uploadBigImage} src={image} key={index + image} />
    ));
  };

  useEffect(() => {
    getAllAssociates();
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
  //   getAllUsers();
  // },[]);

  const getLanguageLabel = key => {
    return privileges.filter(language => language.key === key)[0].label;
  };

  // const getAllUsers = () => {
  //   axios.get(CONSTANTS.BASE_URL+'api/user',{params:{limit:1000,page:1}})
  //   .then(response => {
  //     // console.log("user data",response.data.users);
  //     const allUsers = response.data.users;
  //     getUsers(allUsers);
  //     // setLoading(false);
  //   //   menu = allUsers.map((user)=>{
  //   //       console.log("sdlksl",user)
  //   //       return(<MenuItem value={user._id}>{user.name}</MenuItem>)
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
  const isDeliveryBoy = privileges => {
    if (privileges.includes('delivery_boy')) return true;
    return false;
  };
  // const isSeller = privileges => {
  //   if (privileges.includes('seller')) {
  //     if (isEmpty(associates)) setDisabledSubmit(true);
  //     return true;
  //   } else {
  //     setDisabledSubmit(false);
  //     return false;
  //   }
  // };
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

  const page = associates && (
    <Page className={classes.root} title="Add User">
      <Container maxWidth="md">
        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            confirm_password: '',
            address: '',
            associate: '',
            mobile: '',
            privileges: []
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('Name required'),
            email: Yup.string().required('Email required'),
            associate: Yup.string().required('Associate required'),
            password: Yup.string()
              .required('Password required')
              .matches(
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
            console.log('valsues', values);
            // return;
            let data = {};
            data.name = values.name;
            data.email = values.email;
            data.password = values.password;
            data.confirm_password = values.confirm_password;
            data.associate = values.associate;
            data.mobile = values.mobile;
            if (!isEmpty(values.address)) data.address = values.address;
            if (!isEmpty(values.privileges))
              data.privileges = values.privileges;

            axios
              .post(CONSTANTS.BASE_URL + 'api/user', data)
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
            console.log('errrrrrrrrrrrrrrrrrrrrrrrrrrrrr', errors);
            return (
              <React.Fragment>
                <form onSubmit={handleSubmit}>
                  <Card>
                    <CardHeader
                      // subheader="Add Bill"
                      title="Add User"
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
                          {/* <MenuItem value="">
                            <em>None</em>
                          </MenuItem> */}
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
                          Add User
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

export default AddUser;
