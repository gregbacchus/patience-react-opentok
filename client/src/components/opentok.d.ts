/// https://tokbox.com/developer/sdks/js/reference/Session.html

type Handler = (error: Error) => void;
type DataHandler<T> = (error: Error, data: T) => void;

export interface SignalObject {
  data: string,
  retryAfterReconnect?: boolean;
  to?: string;
  type?: string;
}

export interface Resolution {
  width: number;
  height: number;
}

export interface SubscribeProperties {
  audioVolume: number;
  fitMode: 'cover' | 'contain';
  height: number | string;
  insertDefaultUI: boolean;
  insertMode: 'replace' | 'after' | 'before' | 'append';
  preferredFrameRate: number;
  preferredResolution: Resolution;
  showControls?: boolean;
  style: {
    audioBlockedDisplayMode: string;
    audioLevelDisplayMode: string;
    backgroundImageURI: string;
    buttonDisplayMode: 'auto' | 'off' | 'on';
    nameDisplayMode: 'auto' | 'off' | 'on';
    videoDisabledDisplayMode: 'auto' | 'off' | 'on';
  };
  subscribeToAudio?: boolean;
  subscribeToVideo?: boolean;
  testNetwork?: boolean;
  width: number | string;
}

export interface Capabilities {
  forceDisconnect: number;
  forceUnpublish: number;
  publish: number;
  subscribe: number;
}

export interface Connection {
  connectionId: string;
  creationTime: number;
  data: string;
}

export interface Stream {
  connection: Connection;
  creationTime: number;
  frameRate: number;
  hasAudio: boolean;
  hasVideo: boolean;
  name: string;
  id: string;
  // streamId: string;
  videoDimensions: Resolution;
  videoType: 'camera' | 'screen' | 'custom';
}

export interface PublisherStyle {
  audioLevelDisplayMode: 'auto' | 'off' | 'on';
  archiveStatusDisplayMode: 'auto' | 'off' | 'on';
  backgroundImageURI: string;
  buttonDisplayMode: 'auto' | 'off' | 'on';
  nameDisplayMode: 'auto' | 'off' | 'on';
}

export interface SubscriberStyle {
  audioBlockedDisplayMode: 'auto' | 'off' | 'on';
  audioLevelDisplayMode: 'auto' | 'off' | 'on';
  backgroundImageURI: string;
  buttonDisplayMode: 'auto' | 'off' | 'on';
  nameDisplayMode: 'auto' | 'off' | 'on';
  videoDisabledDisplayMode: 'auto' | 'off' | 'on';
}

interface PublisherStats {
  audio: {
    bytesSent: number;
    packetsLost: number;
    packetsSent: number;
  };
  timestamp: number;
  video: {
    bytesSent: number;
    packetsLost: number;
    packetsSent: number;
    frameRate: number;
  }
}

interface SubscriberStats {
  audio: {
    bytesReceived: number;
    packetsLost: number;
    packetsReceived: number;
  };
  timestamp: number;
  video: {
    bytesReceived: number;
    packetsLost: number;
    packetsReceived: number;
    frameRate: number;
  }
}

export interface EventDispatcher<T> {
  off(type?: keyof SessionEvents, handler?: Function, context?: Object): void;
  off(events: SessionEvents): void;
  on(type: keyof SessionEvents, handler: Function, context?: Object): EventDispatcher<T>;
  on(events: SessionEvents): EventDispatcher<T>;
  once(type: keyof SessionEvents, handler: Function, context?: Object): Object;
}

export interface Publisher extends EventDispatcher<PublisherEvents> {
  accessAllowed: boolean;
  element: HTMLElement;
  id: string;
  stream: Stream;
  session: Session;
  cycleVideo(): Promise<{ deviceId: string }>
  destroy(): Publisher;
  getAudioSource(): MediaStreamTrack;
  getImgData(): string;
  getStats(completionHandler: DataHandler<PublisherStats[]>): void;
  getStyle(): PublisherStyle;
  // off(type?: string, handler?: Function, context?: Object): void;
  // on(type: string, handler: Function, context?: Object): EventDispatcher;
  // once(type: string, handler: Function, context?: Object): Object;
  publishAudio(value: boolean): void;
  publishVideo(value: boolean): void;
  setAudioSource(audioSource: string | MediaStreamTrack): Promise<void>;
  setStyle(style: PublisherStyle): Publisher;
  setStyle(style: string, value: string): Publisher;
  videoHeight(): number;
  videoWidth(): number;
}

export interface Subscriber extends EventDispatcher<SubscriberEvents> {
  element: HTMLElement;
  id: string;
  stream: Stream;
  getAudioVolume(): number;
  getImgData(): string;
  getStats(completionHandler: DataHandler<SubscriberStats>): void;
  getStyle(): SubscriberStyle;
  isAudioBlocked(): boolean;
  restrictFrameRate(value: boolean): Subscriber;
  setAudioVolume(value: number): Subscriber;
  setPreferredFrameRate(frameRate: number): void;
  setPreferredResolution(resolution: Resolution): void;
  setStyle(style: SubscriberStyle): Subscriber;
  setStyle(style: string, value: string): Subscriber;
  subscribeToAudio(value: boolean): Subscriber;
  subscribeToVideo(value: boolean): Subscriber;
  videoHeight(): number;
  videoWidth(): number;
}

type EventHandler<T> = (event: T) => void;

type ArchiveEvent = any;
type ConnectionEvent = any;
// type SessionConnectEvent = DefaultBehaviorEvent;
// type SessionDisconnectEvent = DefaultBehaviorEvent;
type StreamPropertyChangedEvent = any;

interface DefaultBehaviorEvent {
  isDefaultPrevented(): boolean;
  preventDefault(): void;
}

interface StreamEvent extends DefaultBehaviorEvent {
  stream: Stream;
}

interface SessionConnectEvent extends DefaultBehaviorEvent {
  type: 'sessionConnected';
  target: Session;
}

interface SessionDisconnectEvent extends DefaultBehaviorEvent {
  reason: 'clientDisconnected' | 'forceDisconnected' | 'networkDisconnected';
}

interface SignalEvent extends DefaultBehaviorEvent {
  type: string;
  data: string;
  from: Connection;
}

interface SessionEvents {
  archiveStated?: EventHandler<ArchiveEvent>;
  archiveStopped?: EventHandler<ArchiveEvent>;
  connectionCreated?: EventHandler<ConnectionEvent>;
  connectionDestroyed?: EventHandler<ConnectionEvent>;
  sessionConnected?: EventHandler<SessionConnectEvent>;
  sessionDisconnected?: EventHandler<SessionDisconnectEvent>;
  sessionReconnected?: EventHandler<Event>;
  sessionReconnecting?: EventHandler<Event>;
  signal?: EventHandler<SignalEvent>;
  streamCreated?: EventHandler<StreamEvent>;
  streamDestroyed?: EventHandler<StreamEvent>;
  streamPropertyChanged?: EventHandler<StreamPropertyChangedEvent>;
  //signal:type
}

type AudioLevelUpdatedEvent = any;
type VideoDimensionsChangedEvent = any;
type VideoDisabledChangedEvent = any;
type VideoElementCreatedEvent = any;

interface SubscriberEvents {
  audioBlocked?: EventHandler<any>;
  audioLevelUpdated?: EventHandler<AudioLevelUpdatedEvent>;
  audioUnblocked?: EventHandler<any>;
  connected?: EventHandler<Event>;
  destroyed?: EventHandler<Event>;
  disconnected?: EventHandler<Event>;
  videoDimensionsChanged?: EventHandler<VideoDimensionsChangedEvent>;
  videoDisabled?: EventHandler<VideoDisabledChangedEvent>;
  videoDisableWarning?: EventHandler<Event>;
  videoDisableWarningLifted?: EventHandler<Event>;
  videoElementCreated?: EventHandler<VideoElementCreatedEvent>;
  videoEnabled?: EventHandler<VideoDisabledChangedEvent>;
}

type MediaStoppedEvent = any;

interface PublisherEvents {
  accessAllowed?: EventHandler<Event>;
  accessDenied?: EventHandler<Event>;
  accessDialogClosed?: EventHandler<Event>;
  accessDialogOpened?: EventHandler<Event>;
  audioLevelUpdated?: EventHandler<AudioLevelUpdatedEvent>;
  destroyed?: Handler;
  mediaStopped?: EventHandler<MediaStoppedEvent>;
  streamCreated?: EventHandler<StreamEvent>;
  streamDestroyed?: EventHandler<StreamEvent>;
  videoDimensionsChanged?: EventHandler<VideoDimensionsChangedEvent>;
  videoElementCreated?: EventHandler<VideoElementCreatedEvent>;
}

export interface Session extends EventDispatcher<SessionEvents> {
  capabilities: Capabilities;
  connection: Connection;
  sessionId: string;
  connect(token: string, completionHandler?: Handler): void;
  disconnect(): void;
  forceDisconnect(connection: Connection, completionHandler?: Handler): void;
  forceUnpublish(stream: Stream, completionHandler?: Handler): void;
  getPublisherForStream(stream: Stream): Publisher;
  getSubscribersForStream(stream: Stream): Subscriber[];
  // off(type?: string, handler?: Function, context?: Object): void;
  // on(type: string, handler: Function, context?: Object): EventDispatcher;
  // once(type: string, handler: Function, context?: Object): Object;
  publish(publisher: Publisher, completionHandler?: Handler): void;
  signal(signal: SignalObject, completionHandler?: Handler): void;
  subscribe(stream: Stream, targetElement?: HTMLElement, properties?: SubscribeProperties, completionHandler?: Handler): Subscriber;
  unpublish(publisher: Publisher): void;
  unsubscribe(subscriber: Subscriber): void;
}
