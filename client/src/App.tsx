import React from 'react';
// import logo from './logo.svg';
import './App.css';
import MySession from './components/my-session';
import { Call } from './pages/call';
import CssBaseline from '@material-ui/core/CssBaseline';

const { OTPublisher, OTStreams, OTSubscriber } = require('opentok-react');

export interface Credentials {
  apiKey: string;
  sessionId: string;
  token: string;
}

export interface AppProps {
  credentials: Credentials;
}

export interface AppState {
  error: Error | null;
  connection: string;
  publishVideo: boolean;
}

const randomColour = () => {
  return Math.round(Math.random() * 255);
};

const canvas = document.createElement('canvas');
canvas.width = 640;
canvas.height = 480;
const ctx = canvas.getContext('2d');

// var path = new Path2D('M 100,100 h 50 v 50 h 50');

// Draw a random colour in the Canvas every 1 second
const interval = setInterval(() => {
  if (!ctx) return;

  var img = new Image();
  img.onload = function () {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = `rgb(${randomColour()}, ${randomColour()}, ${randomColour()})`;
    ctx.fillRect(0, 0, 100, 100);
    ctx.drawImage(img, 0, 0);
  }
  img.src = "./openmoji-svg-color/1F92A.svg";
}, 5000);

class App extends React.Component<AppProps, AppState> {
  sessionEventHandlers: { sessionConnected: ({ target: any }: any) => void; sessionDisconnected: () => void; sessionReconnected: () => void; sessionReconnecting: () => void; };
  publisherEventHandlers: { accessDenied: () => void; streamCreated: () => void; streamDestroyed: ({ reason }: { reason: any; }) => void; };
  subscriberEventHandlers: { videoEnabled: () => void; videoDisabled: () => void; };
  constructor(props: AppProps) {
    super(props);

    this.state = {
      error: null,
      connection: 'Connecting',
      publishVideo: true,
    };

    this.sessionEventHandlers = {
      sessionConnected: (event) => {
        console.log('sessionConnected', event);
        this.setState({ connection: 'Connected' });
        event.target.on('signal', console.log);
        event.target.signal({ data: 'asdfasdf' });
      },
      sessionDisconnected: () => {
        this.setState({ connection: 'Disconnected' });
      },
      sessionReconnected: () => {
        this.setState({ connection: 'Reconnected' });
      },
      sessionReconnecting: () => {
        this.setState({ connection: 'Reconnecting' });
      },
    };

    this.publisherEventHandlers = {
      accessDenied: () => {
        console.log('User denied access to media source');
      },
      streamCreated: () => {
        console.log('Publisher stream created');
      },
      streamDestroyed: ({ reason }) => {
        console.log(`Publisher stream destroyed because: ${reason}`);
      },
    };

    this.subscriberEventHandlers = {
      videoEnabled: () => {
        console.log('Subscriber video enabled');
      },
      videoDisabled: () => {
        console.log('Subscriber video disabled');
      },
    };
  }

  onSessionError = (error: Error) => {
    this.setState({ error });
  };

  onPublish = () => {
    console.log('Publish Success');
  };

  onPublishError = (error: Error) => {
    this.setState({ error });
  };

  onSubscribe = () => {
    console.log('Subscribe Success');
  };

  onSubscribeError = (error: Error) => {
    this.setState({ error });
  };

  onSignal = (error: Error) => {
    console.log('Signal received');
  }

  toggleVideo = () => {
    this.setState(state => ({
      publishVideo: !state.publishVideo,
    }));
  };

  render() {
    return (<React.Fragment>
      <CssBaseline />
      <Call credentials={this.props.credentials} />
    </React.Fragment>
    );
  }

  render1() {
    const { apiKey, sessionId, token } = this.props.credentials;
    const { error, connection, publishVideo } = this.state;

    return (
      <div>
        <div id="sessionStatus">Session Status: {connection}</div>
        {error ? (
          <div className="error">
            <strong>Error:</strong> {error}
          </div>
        ) : null}
        <MySession
          apiKey={apiKey}
          sessionId={sessionId}
          token={token}
          onError={this.onSessionError}
          eventHandlers={this.sessionEventHandlers}
        >
          <OTStreams>
            <OTSubscriber
              properties={{ width: '100%', height: '100%', videoscale: 'fill', showControls: true }}
              onSubscribe={this.onSubscribe}
              onSignal={this.onSignal}
              onError={this.onSubscribeError}
              eventHandlers={this.subscriberEventHandlers}
            />
          </OTStreams>
          <button id="videoButton" onClick={this.toggleVideo} style={{ position: 'absolute', top: 100 }}>
            {publishVideo ? 'Disable' : 'Enable'} Video
          </button>
          <OTPublisher
            properties={{ publishVideo: true, resolution: '1280x720', width: 150, height: 150, showControls: true, videoSource: !publishVideo ? (canvas as any).captureStream(1).getVideoTracks()[0] : undefined }}
            onPublish={this.onPublish}
            onError={this.onPublishError}
            eventHandlers={this.publisherEventHandlers}
          />
          <canvas style={{ position: 'absolute', left: 0, bottom: 0, width: 150, height: 150 }}></canvas>
        </MySession>
      </div>
    );
  }
}

export default App;
