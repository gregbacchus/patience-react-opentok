import React from 'react';
import MySession from '../components/my-session';
import { SessionEvents, SignalEvent, SessionConnectEvent, SessionDisconnectEvent, Session, PublisherEvents, SubscriberEvents } from '../components/opentok';
import { CallView } from './call.view';
import ToolbarView, { Emoji } from '../components/toolbar';
import { ConnectingView } from './connecting';

export interface Credentials {
  apiKey: string;
  sessionId: string;
  token: string;
}

interface Props {
  credentials: Credentials;
  disconnected?: () => void;
}

interface State {
  connection: 'connecting' | 'connected' | 'disconnected';
  session: Session | null;
  videoSource: MediaStreamTrack | undefined;
}

class CallController extends React.Component<Props, State> {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;

  constructor(props: Props) {
    super(props);

    this.state = {
      connection: 'connecting',
      session: null,
      videoSource: undefined,
    }

    this.canvas = document.createElement('canvas');
    this.canvas.width = 640;
    this.canvas.height = 640;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('Unable to get canvas context');
    this.ctx = ctx;
  }

  readonly sessionEventHandlers: SessionEvents = {
    signal: (event: SignalEvent) => {
      console.log('SIGNAL DATA:', event.data);
    },

    sessionConnected: ({ target }: SessionConnectEvent) => {
      this.setState({ connection: 'connected', session: target });
    },

    sessionDisconnected: (event: SessionDisconnectEvent) => {
      this.setState({ connection: 'disconnected', session: null });

      const { disconnected } = this.props;
      disconnected && disconnected();
    },

    sessionReconnected: (event: Event) => {
      this.setState({ connection: 'connecting' });
    },

    sessionReconnecting: (event: Event) => {
      this.setState({ connection: 'connected' });
    },
  }

  readonly publisherEventHandlers: PublisherEvents = {}

  readonly subscriberEventHandlers: SubscriberEvents = {}

  readonly onSessionError = (error: Error) => {
    console.error('onSessionError', error);
  };

  readonly onPublishError = (error: Error) => {
    console.error('onPublishError', error);
  };

  readonly onSubscribeError = (error: Error) => {
    console.error('onSubscribeError', error);
  };

  readonly onSourceChanged = (source: Emoji | 'camera') => () => {
    if (source === 'camera') {
      this.setState({ videoSource: undefined })
      return;
    }

    var img = new Image();
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = `rgb(192, 192, 192)`;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0);
    }
    img.src = source.url;
    this.setState({ videoSource: (this.canvas as any).captureStream(1).getVideoTracks()[0] })
  };

  render() {
    const {
      credentials: { apiKey, sessionId, token }
    } = this.props;

    return (
      <MySession
        apiKey={apiKey}
        sessionId={sessionId}
        token={token}
        onError={this.onSessionError}
        eventHandlers={this.sessionEventHandlers}
      >
        {this.state.connection === 'connected' && this.state.session
          ? <React.Fragment>
            <ToolbarView onSourceChanged={this.onSourceChanged} />
            <CallView
              onPublishError={this.onPublishError}
              onSubscribeError={this.onSubscribeError}
              publisherEventHandlers={this.publisherEventHandlers}
              session={this.state.session}
              subscriberEventHandlers={this.subscriberEventHandlers}
              videoSource={this.state.videoSource}
            />
          </React.Fragment>
          : <ConnectingView />
        }
      </MySession>
    );
  }
}

export const Call = CallController;
