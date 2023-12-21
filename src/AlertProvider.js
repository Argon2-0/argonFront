// AlertProvider.js
import React, { createContext, useContext } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

export const AlertContext = createContext();

class AlertProvider extends React.Component {
  state = {
    open: false,
    severity: 'success',
    message: '',
  };

  showAlert = (newSeverity, newMessage) => {
    this.setState({
      open: true,
      severity: newSeverity,
      message: newMessage,
    });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false });
  };

  render() {
    return (
      <AlertContext.Provider
        value={{
          showAlert: this.showAlert,
        }}
      >
        {this.props.children}
        <Snackbar
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <MuiAlert
            onClose={this.handleClose}
            severity={this.state.severity}
            elevation={6}
            variant="filled"
            sx={{
              width: '100%',
              fontSize: '1.2rem',
              '& .MuiAlert-icon': {
                fontSize: '2rem',
              },
            }}
          >
            {this.state.message}
          </MuiAlert>
        </Snackbar>
      </AlertContext.Provider>
    );
  }
}

function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}

export { AlertProvider, useAlert };
