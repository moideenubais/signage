import 'react-perfect-scrollbar/dist/css/styles.css';
import React, { useContext, Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import AuthContext from './context/auth-context';
import Spinner from 'src/components/Spinner';

const App = () => {
  const authCtx = useContext(AuthContext);
  const routing = useRoutes(routes(authCtx.isLoggedIn));

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {/* <Suspense
        fallback={
          <div
            style={{
              margin: '0px',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <Spinner />
          </div>
        }
      > */}
      {routing}
      {/* </Suspense> */}
    </ThemeProvider>
  );
};

export default App;
