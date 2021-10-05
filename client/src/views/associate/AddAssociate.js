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

const AddAssociate = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const theme = useTheme();
  const [logoImageFile, setLogoImage] = useState(null);
  const [iconImageFile, setIconImage] = useState(null);
  const [translationModel, setTranslationModel] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [associates, setAssociates] = useState(null);
  const [disabledSubmit, setDisabledSubmit] = useState(false);
  // const [roles, setRoles] = useState(null);
  const { associate } = useContext(AuthContext);

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
  //   getAllAssociates();
  // },[]);

  // const getLanguageLabel = key => {
  //   return privileges.filter(language => language.key === key)[0].label;
  // };

  // const getAllAssociates = () => {
  //   axios.get(CONSTANTS.BASE_URL+'api/associate',{params:{limit:1000,page:1}})
  //   .then(response => {
  //     // console.log("associate data",response.data.associates);
  //     const allAssociates = response.data.associates;
  //     getAssociates(allAssociates);
  //     // setLoading(false);
  //   //   menu = allAssociates.map((associate)=>{
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
    <Page className={classes.root} title="Add Associate">
      <Container maxWidth="md">
        <Formik
          initialValues={{
            name: '',
            description: '',
            number_of_players: 1,
            storage: 1,
            parentId: ''
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('Name required'),
            description: Yup.string(),
            number_of_players: Yup.number().required(
              'Number of players required'
            ),
            storage: Yup.number().required('Storage required'),
            parentId: Yup.string()
          })}
          onSubmit={values => {
            console.log('valsues', values);
            // return;
            let data = {};
            data.name = values.name;
            if (!isEmpty(values.description))
              data.description = values.description;
            if (!isEmpty(values.parentId)) data.parentId = values.parentId;
            data.number_of_players = values.number_of_players;
            data.storage = values.storage;

            axios
              .post(CONSTANTS.BASE_URL + 'api/associate', data)
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
                      title="Add Associate"
                    />
                    <Divider />
                    <CardContent>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        className={classes.formControl}
                      >
                        <InputLabel id="parentId_label">Associate</InputLabel>
                        <Select
                          fullWidth
                          error={Boolean(touched.parentId && errors.parentId)}
                          helperText={touched.parentId && errors.parentId}
                          margin="normal"
                          variant="outlined"
                          labelId="parentId_label"
                          id="parentId"
                          name="parentId"
                          value={values.parentId}
                          onChange={handleChange}
                          label="Associate"
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
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
                        error={Boolean(touched.description && errors.description)}
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
                        error={Boolean(touched.number_of_players && errors.number_of_players)}
                        helperText={touched.number_of_players && errors.number_of_players}
                        label="Number of Players"
                        margin="normal"
                        name="number_of_players"
                        onChange={handleChange}
                        type="number"
                        value={values.number_of_players}
                        variant="outlined"
                      />
                      <TextField
                        fullWidth
                        error={Boolean(touched.storage && errors.storage)}
                        helperText={touched.storage && errors.storage}
                        label="Storage Limit in GB"
                        margin="normal"
                        name="storage"
                        onChange={handleChange}
                        type="number"
                        value={values.storage}
                        variant="outlined"
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
                          Add Associate
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

export default AddAssociate;
