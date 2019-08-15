import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Videocam from '@material-ui/icons/Videocam';
import Icon from '@material-ui/core/Icon';
import MoreIcon from '@material-ui/icons/MoreVert';

const useStyles = makeStyles({
  appBar: {
    top: 'auto',
    bottom: 20,
    left: '20%',
    right: '20%',
    width: '60%',
    borderRadius: '4px',
  },
  grow: {
    flexGrow: 1,
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    // margin: '0 auto',
  },
  emojiButton: {
    padding: 0,
  },
  svgEmoji: {
    fontSize: 48,
  },
});

const emojis: Emoji[] = [
  {
    name: 'Raise Hand',
    url: './openmoji-svg-color/1F64B.svg',
  }, {
    name: 'Thumbs up',
    url: './openmoji-svg-color/1F44D.svg',
  }, {
    name: 'Thumbs down',
    url: './openmoji-svg-color/1F44E.svg',
  }, {
    name: 'Thinkink',
    url: './openmoji-svg-color/1F914.svg',
  }, {
    name: 'Roling Eyes',
    url: './openmoji-svg-color/1F644.svg',
  }, {
    name: 'Zany Face',
    url: './openmoji-svg-color/1F92A.svg',
  }, {
    name: 'Nauseated',
    url: './openmoji-svg-color/1F922.svg',
  }, {
    name: 'Halo',
    url: './openmoji-svg-color/1F607.svg',
  }, {
    name: 'ROTFL',
    url: './openmoji-svg-color/1F923.svg',
  }, {
    name: 'Cool',
    url: './openmoji-svg-color/1F60E.svg',
  }, {
    name: 'Nerd',
    url: './openmoji-svg-color/1F913.svg',
  }
];

export interface Emoji {
  name: string;
  url: string;
}

interface Props {
  onSourceChanged: (source: Emoji | 'camera') => (event: any) => void;
}

export default function ToolbarView({ onSourceChanged }: Props) {
  const classes = useStyles();

  return (
    <AppBar position="fixed" color="default" className={classes.appBar}>
      <Toolbar>
        <IconButton edge="start" onClick={onSourceChanged('camera')}>
          <Videocam />
        </IconButton>
        <div className={classes.grow} />
        <div style={{ overflowX: 'scroll', height: '50px' }}>
          {emojis.map((emoji) => (
            <IconButton key={emoji.url} className={classes.emojiButton} onClick={onSourceChanged(emoji)}>
              <Icon className={classes.svgEmoji}>
                <img src={emoji.url} alt={emoji.name} />
              </Icon>
            </IconButton>
          ))}
        </div>
        <div className={classes.grow} />
        <IconButton edge="end" color="inherit">
          <MoreIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
