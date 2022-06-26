import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './Routes'
import { SnackbarProvider} from 'notistack';

ReactDOM.render(
  <React.StrictMode>
    <SnackbarProvider maxSnack={5}>
      <Routes />
    </SnackbarProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

