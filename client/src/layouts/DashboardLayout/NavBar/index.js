import React, { useEffect, useContext, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles
} from '@material-ui/core';
import AuthContext from 'src/context/auth-context';
import {
  AlertCircle as AlertCircleIcon,
  BarChart as BarChartIcon,
  Lock as LockIcon,
  Settings as SettingsIcon,
  ShoppingBag as ShoppingBagIcon,
  User as UserIcon,
  UserPlus as UserPlusIcon,
  Users as UsersIcon
} from 'react-feather';
import NavItem from './NavItem';
import CONSTANTS from 'src/constants';
import { isEmpty } from 'lodash';
import BusinessIcon from '@material-ui/icons/Business';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import TocIcon from '@material-ui/icons/Toc';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import ScheduleIcon from '@material-ui/icons/Schedule';
import EjectOutlinedIcon from '@material-ui/icons/EjectOutlined';

// const user = {
//   avatar: './static/images/avatars/avatar_6.png',
//   jobTitle: 'Senior Developer',
//   name: 'Katarina Smith'
// };

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const itemsInitial = [
    // { href: '/corevine/admin/app/dashboard', icon: BarChartIcon, title: 'Dashboard' },
    // {
    //   href: '/corevine/admin/app/dashboard/deliveryBoy',
    //   icon: BarChartIcon,
    //   title: 'Dashboard (Delivery Boy)'
    // },
    // {
    //   href: '/corevine/admin/app/dashboard/seller',
    //   icon: BarChartIcon,
    //   title: 'Dashboard (Seller)'
    // },
    // {
    //   href: '/corevine/admin/app/orders/assignedDelivery',
    //   icon: BarChartIcon,
    //   title: 'Assinged Delivery'
    // },
    // {
    //   href: '/corevine/admin/app/orders/completedDelivery',
    //   icon: BarChartIcon,
    //   title: 'Completed Delivery'
    // },
    // { href: '/corevine/admin/app/shops', icon: UserIcon, title: 'Shops' },
    {
      href: '/corevine/admin/app/associates',
      icon: BusinessIcon,
      title: 'Associates'
    },
    {
      href: '/corevine/admin/app/users',
      icon: PersonOutlineOutlinedIcon,
      title: 'Users'
    },
    {
      href: '/corevine/admin/app/groups',
      icon: UsersIcon,
      title: 'Groups'
    },
    {
      href: '/corevine/admin/app/contents',
      icon: TocIcon,
      title: 'Contents'
    },
    {
      href: '/corevine/admin/app/playlists',
      icon: PlaylistAddIcon,
      title: 'Playlists'
    },
    {
      href: '/corevine/admin/app/schedules',
      icon: ScheduleIcon,
      title: 'Schedules'
    },
    {
      href: '/corevine/admin/app/players',
      icon: EjectOutlinedIcon,
      title: 'Players'
    }
    // {
    //   href: '/corevine/admin/app/roles',
    //   icon: ShoppingBagIcon,
    //   title: 'Roles & Routes',
    //   childItems: [
    //     {
    //       href: '/corevine/admin/app/roles/routes',
    //       // icon: BarChartIcon,
    //       title: 'Routes'
    //     },
    //     {
    //       href: '/corevine/admin/app/roles/all',
    //       // icon: BarChartIcon,
    //       title: 'Roles'
    //     },
    //     {
    //       href: '/corevine/admin/app/roles/userRoleMap',
    //       // icon: BarChartIcon,
    //       title: 'Roles Map'
    //     }
    //   ]
    // },
    // {
    //   href: '/corevine/admin/app/products',
    //   icon: ShoppingBagIcon,
    //   title: 'Products',
    //   childItems: [
    //     {
    //       href: '/corevine/admin/app/products/all',
    //       // icon: BarChartIcon,
    //       title: 'All Products'
    //     },
    //     {
    //       href: '/corevine/admin/app/products/addProduct',
    //       // icon: BarChartIcon,
    //       title: 'Add Product'
    //     },
    //     {
    //       href: '/corevine/admin/app/products/categories',
    //       // icon: BarChartIcon,
    //       title: 'Category'
    //     },
    //     {
    //       href: '/corevine/admin/app/products/bulkImport',
    //       // icon: BarChartIcon,
    //       title: 'Bulk Import'
    //     },
    //     {
    //       href: '/corevine/admin/app/products/brands',
    //       // icon: BarChartIcon,
    //       title: 'Brands'
    //     },
    //     {
    //       href: '/corevine/admin/app/products/colors',
    //       // icon: BarChartIcon,
    //       title: 'Colors'
    //     },
    //     {
    //       href: '/corevine/admin/app/products/attributes',
    //       // icon: BarChartIcon,
    //       title: 'Attributes'
    //     },
    //     {
    //       href: '/corevine/admin/app/products/reviews',
    //       // icon: BarChartIcon,
    //       title: 'Reviews'
    //     }
    //   ]
    // },
    // {
    //   href: '/corevine/admin/app/marketing',
    //   icon: ShoppingBagIcon,
    //   title: 'Marketing',
    //   childItems: [
    //     {
    //       href: '/corevine/admin/app/marketing/flashDeals',
    //       // icon: BarChartIcon,
    //       title: 'Flash Deals'
    //     },
    //     {
    //       href: '/corevine/admin/app/marketing/subscribers',
    //       // icon: BarChartIcon,
    //       title: 'Subscribers'
    //     },
    //     {
    //       href: '/corevine/admin/app/marketing/ads',
    //       // icon: BarChartIcon,
    //       title: 'Adds'
    //     }
    //   ]
    // },
    // {
    //   href: '/corevine/admin/app/account',
    //   icon: UserIcon,
    //   title: 'Account'
    // },
    // {
    //   href: '/corevine/admin/app/orders',
    //   icon: UserIcon,
    //   title: 'Orders'
    // },
    // {
    //   href: '/corevine/admin/app/settings',
    //   icon: SettingsIcon,
    //   title: 'Settings'
    // },
    // {
    //   href: '/corevine/admin/login',
    //   icon: LockIcon,
    //   title: 'Login'
    // },
    // {
    //   href: '/register',
    //   icon: UserPlusIcon,
    //   title: 'Register'
    // },
    // {
    //   href: '/404',
    //   icon: AlertCircleIcon,
    //   title: 'Error'
    // }
  ];

  user.role = user.user_type;

  let items = itemsInitial.map(item => {
    if (!isEmpty(item.childItems)) {
      let childArray = [];
      item.childItems.map(child => {
        if (!isEmpty(child)) childArray.push(child);
      });
      if (!isEmpty(childArray)) {
        item.childItems = childArray;
        return item;
      }
    } else {
      if (item != false) return item;
    }
  });
  items = items.filter(item => !isEmpty(item));

  // console.log("itesm++++++++++++++",items, "role",user.role)

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Box alignItems="center" display="flex" flexDirection="column" p={2}>
        {user.image_url && (
          <Avatar
            className={classes.avatar}
            component={RouterLink}
            src={CONSTANTS.BASE_URL + user.image_url}
            to="/corevine/admin/app/account"
          />
        )}
        <Typography className={classes.name} color="textPrimary" variant="h5">
          {user.name}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {user.role}
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {items.map(item => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
              // open = {open}
              childItems={item.childItems}
              // handleCollapse = {handleCollapseOpen}
            />
          ))}
        </List>
      </Box>
      <Box flexGrow={1} />
      {/* <Box p={2} m={2} bgcolor="background.dark">
        <Typography align="center" gutterBottom variant="h4">
          Need more?
        </Typography>
        <Typography align="center" variant="body2">
          Upgrade to PRO version and access 20 more screens
        </Typography>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            color="primary"
            component="a"
            href="https://react-material-kit.devias.io"
            variant="contained"
          >
            See PRO version
          </Button>
        </Box>
      </Box> */}
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default NavBar;
