import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { esES } from '@mui/x-data-grid';
import { ReactSession } from 'react-client-session';
const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  esES,
);
const root = ReactDOM.createRoot(document.getElementById('root'));
ReactSession.setStoreType("localStorage");
ReactSession.set("basicUri", "http://20.122.71.45:8990/accessbiosecurity/")
root.render(
  <ThemeProvider theme={theme}>

    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ProSidebarProvider>
        <BrowserRouter>
          
          <App/>

        </BrowserRouter>
      </ProSidebarProvider>
    </LocalizationProvider>
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
