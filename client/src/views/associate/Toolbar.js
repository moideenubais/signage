import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  makeStyles,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  FormControl
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import { NavLink as RouterLink } from 'react-router-dom';
import AuthContext from 'src/context/auth-context';

const useStyles = makeStyles(theme => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  }
}));

const Toolbar = ({ className, onSearchName, onAssociateTypeChange, ...rest }) => {
  const classes = useStyles();
  const { associate } = useContext(AuthContext);
  const [associateType, setAssociateType] = useState('all');

  // const associateTypesArray = [
  //   { key: 'all', value: 'All' , priority:7},
  //   { key: 'super_admin', value: 'Super Admin' , priority:1},
  //   { key: 'org_admin', value: 'Org Admin' , priority:2},
  //   { key: 'admin', value: 'Admin' , priority:3},
  //   { key: 'seller', value: 'Seller' , priority:4},
  //   { key: 'delivery_boy', value: 'Delivery Boy' , priority:5},
  //   { key: 'associate', value: 'Associate', priority:6 }
  // ];

  // const associatePrioriy = associateTypesArray.find(associateType=>associateType.key === associate.associate_type).priority;
  
  // const associateTypes = associateTypesArray.filter(associateType=>associateType.priority > associatePrioriy);


  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Box display="flex" justifyContent="flex-end">
        {/* <Button className={classes.importButton}>
          Import
        </Button>
        <Button className={classes.exportButton}>
          Export
        </Button> */}
        { (
          <Button
            color="primary"
            variant="contained"
            component={RouterLink}
            to="/corevine/admin/app/associates/addAssociate"
          >
            Add Associate
          </Button>
        )}
      </Box>
      <Box mt={3}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box>
                  <TextField
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SvgIcon fontSize="small" color="action">
                            <SearchIcon />
                          </SvgIcon>
                        </InputAdornment>
                      )
                    }}
                    placeholder="Search associate"
                    variant="outlined"
                    onChange={onSearchName}
                  />
                </Box>
              </Grid>
              
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
