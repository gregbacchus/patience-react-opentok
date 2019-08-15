import React from 'react';
import { makeStyles } from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles({
  root: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

interface Props {
}

export const ConnectingView = (_: Props) => {
  const classes = useStyles();

  return (<Box className={classes.root} display="flex" alignItems="center" justifyContent="center" >
    <CircularProgress />
  </Box>);
};
