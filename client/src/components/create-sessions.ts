import { Handler, Stream, StreamEvent, SessionEvents, Session } from './opentok';

export interface Args {
  apiKey?: string;
  sessionId?: string;
  token?: string;
  onStreamsUpdated?: (streams: Stream[]) => void;
  onConnect?: Function;
  onError?: Handler;
}

declare const OT: any;

export interface SessionHelper {
  session: Session;
  streams: Stream[];
  disconnect: () => void;
}

export default function createSession({
  apiKey,
  sessionId,
  token,
  onStreamsUpdated,
  onConnect,
  onError,
}: Args = {}) {
  if (!apiKey) {
    throw new Error('Missing apiKey');
  }

  if (!sessionId) {
    throw new Error('Missing sessionId');
  }

  if (!token) {
    throw new Error('Missing token');
  }

  const streams: Stream[] = [];

  const onStreamCreated = (event: StreamEvent) => {
    const index = streams.findIndex(stream => stream.id === event.stream.id);
    if (index < 0) {
      streams.push(event.stream);
      onStreamsUpdated && onStreamsUpdated(streams);
    }
  };

  const onStreamDestroyed = (event: StreamEvent) => {
    const index = streams.findIndex(stream => stream.id === event.stream.id);
    if (index >= 0) {
      streams.splice(index, 1);
      onStreamsUpdated && onStreamsUpdated(streams);
    }
  };

  const eventHandlers: SessionEvents = {
    streamCreated: onStreamCreated,
    streamDestroyed: onStreamDestroyed,
  };

  const session: Session = OT.initSession(apiKey, sessionId);
  session.on(eventHandlers);
  session.connect(token, (err: Error) => {
    if (!session) {
      // Either this session has been disconnected or OTSession
      // has been unmounted so don't invoke any callbacks
      return;
    }
    if (err && typeof onError === 'function') {
      onError(err);
    } else if (!err && typeof onConnect === 'function') {
      onConnect();
    }
  });

  return {
    session,
    streams,
    disconnect() {
      if (session) {
        session.off(eventHandlers);
        session.disconnect();
      }

      // streams = null;
      // onStreamCreated = null;
      // onStreamDestroyed = null;
      // eventHandlers = null;
      // session = null;

      // this.session = null;
      // this.streams = null;
    },
  };
}
