import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';

import MainLayout from 'src/layouts/MainLayout';
import AccountView from 'src/views/account/AccountView';
import AssociateView from './views/associate';
import UserView from './views/user';
import GroupView from './views/group';
import ContentView from './views/content';
import PlaylistView from './views/playlist';
import ScheduleView from './views/schedule';
import PlayerView from './views/player';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';

import AddAssociate from './views/associate/AddAssociate';
import AddUser from './views/user/AddUser';
import AddGroup from './views/group/AddGroup';
import AddContent from './views/content/AddContent';
import AddPlaylist from './views/playlist/AddPlaylist';
import AddSchedule from './views/schedule/AddSchedule';
import AddPlayer from './views/player/AddPlayer';
import AddMedia from './views/content/AddMedia';

import EditAssociate from './views/associate/EditAssociate';
import EditUser from './views/user/EditUser';
import EditGroup from './views/group/EditGroup';
import EditContent from './views/content/EditContent';
import EditPlaylist from './views/playlist/EditPlaylist';
import EditSchedule from './views/schedule/EditSchedule';
import EditPlayer from './views/player/EditPlayer';
import EditMedia from './views/content/EditMedia';

// const DashboardLayout = React.lazy(() => import('src/layouts/DashboardLayout'));
// const MainLayout = React.lazy(() => import('src/layouts/MainLayout'));

// const UserView = React.lazy(() => import('./views/user'));
// const GroupView = React.lazy(() => import('./views/group'));
// const ContentView = React.lazy(() => import('./views/content'));
// const PlaylistView = React.lazy(() => import('./views/playlist'));
// const ScheduleView = React.lazy(() => import('./views/schedule'));
// const PlayerView = React.lazy(() => import('./views/player'));
// const LoginView = React.lazy(() => import('src/views/auth/LoginView'));
// const NotFoundView = React.lazy(() => import('src/views/errors/NotFoundView'));

// const AddUser = React.lazy(() => import('./views/user/AddUser'));
// const AddGroup = React.lazy(() => import('./views/group/AddGroup'));
// const AddContent = React.lazy(() => import('./views/content/AddContent'));
// const AddPlaylist = React.lazy(() => import('./views/playlist/AddPlaylist'));
// const AddSchedule = React.lazy(() => import('./views/schedule/AddSchedule'));
// const AddPlayer = React.lazy(() => import('./views/player/AddPlayer'));
// const AddMedia = React.lazy(() => import('./views/content/AddMedia'));

// const EditUser = React.lazy(() => import('./views/user/EditUser'));
// const EditGroup = React.lazy(() => import('./views/group/EditGroup'));
// const EditContent = React.lazy(() => import('./views/content/EditContent'));
// const EditPlaylist = React.lazy(() => import('./views/playlist/EditPlaylist'));
// const EditSchedule = React.lazy(() => import('./views/schedule/EditSchedule'));
// const EditPlayer = React.lazy(() => import('./views/player/EditPlayer'));
// const EditMedia = React.lazy(() => import('./views/content/EditMedia'));

const routes = autenticated => {
  return autenticated
    ? [
        {
          path: 'corevine/admin/app',
          element: <DashboardLayout />,
          children: [
            { path: 'account', element: <AccountView /> },

            { path: 'users', element: <UserView /> },
            { path: 'users/addUser', element: <AddUser /> },
            { path: 'users/editUser/:id', element: <EditUser /> },

            { path: 'associates', element: <AssociateView /> },
            { path: 'associates/addAssociate', element: <AddAssociate /> },
            {
              path: 'associates/editAssociate/:id',
              element: <EditAssociate />
            },

            { path: 'groups', element: <GroupView /> },
            { path: 'groups/addGroup', element: <AddGroup /> },
            { path: 'groups/editGroup/:id', element: <EditGroup /> },

            { path: 'playlists', element: <PlaylistView /> },
            { path: 'playlists/addPlaylist', element: <AddPlaylist /> },
            { path: 'playlists/editPlaylist/:id', element: <EditPlaylist /> },

            { path: 'schedules', element: <ScheduleView /> },
            { path: 'schedules/addSchedule', element: <AddSchedule /> },
            { path: 'schedules/editSchedule/:id', element: <EditSchedule /> },

            { path: 'players', element: <PlayerView /> },
            { path: 'players/addPlayer', element: <AddPlayer /> },
            { path: 'players/editPlayer/:id', element: <EditPlayer /> },

            { path: 'contents', element: <ContentView /> },
            { path: 'contents/addContent', element: <AddContent /> },
            { path: 'contents/editContent/:id', element: <EditContent /> },
            { path: 'contents/addMedia/:id', element: <AddMedia /> },
            { path: 'contents/editMedia/:id', element: <EditMedia /> },

            { path: '*', element: <Navigate to="/404" /> }
          ]
        },
        {
          path: '/',
          element: <MainLayout />,
          children: [
            {
              path: 'login',
              element: <Navigate to="/corevine/admin/app/associates" />
            },
            {
              path: 'register',
              element: <Navigate to="/corevine/admin/app/associates" />
            },
            { path: '404', element: <NotFoundView /> },
            {
              path: '/',
              element: <Navigate to="/corevine/admin/app/associates" />
            },
            {
              path: '*',
              element: <Navigate to="/corevine/admin/app/associates" />
            }
          ]
        }
      ]
    : [
        {
          path: 'corevine/admin/app',
          element: <DashboardLayout />,
          children: [
            { path: '*', element: <Navigate to="/corevine/admin/login" /> }
          ]
        },
        {
          path: '/corevine/admin/',
          element: <MainLayout />,
          children: [
            { path: 'login', element: <LoginView /> },
            // { path: 'register', element: <RegisterView /> },
            { path: '404', element: <NotFoundView /> },
            { path: '/', element: <Navigate to="/corevine/admin/login" /> },
            { path: '*', element: <Navigate to="/corevine/admin/login" /> }
          ]
        }
      ];
};

export default routes;
