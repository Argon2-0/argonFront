// Spinner.js
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

const Spinner = ({ open }) => {
  return open ? (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fondo más oscuro (ajusta el valor para cambiar la opacidad)
        color: '#ffcf00', // Color de texto y spinner
      }}
    >
      <CircularProgress color="inherit" style={{ color: '#ffcf00' }} />
      <Typography variant="h6" style={{ marginTop: '10px', animation: 'reveal 1s infinite' }}>
        Cargando
      </Typography>
      <style>
        {`
          @keyframes reveal {
            0% {
              opacity: 0;
            }
            25% {
              opacity: 0.25;
            }
            50% {
              opacity: 0.5;
            }
            75% {
              opacity: 0.75;
            }
            100% {
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  ) : null;
};

export default Spinner;
