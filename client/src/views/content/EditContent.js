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
  RadioContent,
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

const EditContent = props => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  let [contentData, setContentData] = useState(null);
  const [logoImageFile, setLogoImage] = useState(null);
  // const [iconImageFile, setIconImage] = useState(null);
  const [services, getServices] = useState([]);
  //   const [editorState, getEditorState] = useState(EditorState.createEmpty());
  const [translationModel, setTranslationModel] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [associates, setAssociates] = useState(null);
  const [disabledSubmit, setDisabledSubmit] = useState(false);
  // const [roles, setRoles] = useState(null);
  // const { content } = useContext(AuthContext);

  //   const [contents, getContents] = useState([]);

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
    getSingleContent();
    getAllAssociates();
    // getAllRoles();
    // getAllContents();
    // getAllContents();
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

  const getSingleContent = () => {
    axios
      .get(CONSTANTS.BASE_URL + 'api/content/' + id)
      .then(response => {
        console.log('get resoposldsl', response.data);
        const contentData = response.data;
        // const html = contentData.description || '';
        // const contentBlock = htmlToDraft(html);
        // if (contentBlock) {
        //   const contentState = ContentState.createFromBlockArray(
        //     contentBlock.contentBlocks
        //   );
        //   let editorState = EditorState.createWithContent(contentState);
        //   getEditorState(editorState);
        // }
        setContentData(contentData);
        setProfileImageFile(CONSTANTS.BASE_URL + contentData.image_url);
        // setIconImage(CONSTANTS.BASE_URL + contentData.icon_url);
        // setImage(CONSTANTS.BASE_URL+contentData.imageUrl);
        //   getBills(allBills);
      })
      .catch(error => {
        console.log(error);
      });
  };

  // const getAllContents = () => {
  //   axios.get(CONSTANTS.BASE_URL+'api/content',{params:{limit:1000,page:1}})
  //   .then(response => {
  //   //   console.log("service data",response.data);
  //     const allContents = response.data.contents;
  //     getContents(allContents);
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
  //     if (isEmpty(contents)) setDisabledSubmit(true);
  //     return true;
  //   } else {
  //     setDisabledSubmit(false);
  //     return false;
  //   }
  // };

  // const getRolesWithContentId = contentId => {
  //   // setRoles([]);
  //   axios
  //     .get(CONSTANTS.BASE_URL + 'api/role', {
  //       params: { page: 1, limit: 10000, content_id: contentId }
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
    contentData && associates ? (
      <Page className={classes.root} title="Update Content">
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
              label: contentData.label,
              associate: contentData.associate
            }}
            validationSchema={Yup.object().shape({
              label: Yup.string().required('Name required'),
              associate: Yup.string().required('Associate required')
            })}
            onSubmit={values => {
              let data = {};
              data.label = values.label;
              data.associate = values.associate;

              axios
                .put(
                  CONSTANTS.BASE_URL + 'api/content/' + contentData._id,
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
                        title="Update Content"
                      />
                      <Divider />
                      <CardContent>
                        <FormControl
                          fullWidth
                          variant="outlined"
                          className={classes.formControl}
                        >
                          <InputLabel id="associate_label">
                            Associate
                          </InputLabel>
                          <Select
                            fullWidth
                            error={Boolean(
                              touched.associate && errors.associate
                            )}
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
                            {/* <MenuItem value="">
                              <em>None</em>
                            </MenuItem> */}
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
                          error={Boolean(touched.label && errors.label)}
                          helperText={touched.label && errors.label}
                          label="Name"
                          margin="normal"
                          name="label"
                          onChange={handleChange}
                          type="text"
                          value={values.label}
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
                            Update Content
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

export default EditContent;
