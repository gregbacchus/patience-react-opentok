import React from 'react';
import { Session, SubscriberEvents, PublisherEvents, Handler } from '../components/opentok';
import { makeStyles } from '@material-ui/styles';

const { OTPublisher, OTStreams, OTSubscriber } = require('opentok-react');

const useStyles = makeStyles({
  root: {
    '& .OT_subscriber': {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    '& .OT_publisher': {
      position: 'absolute',
      right: '30px',
      top: '30px',
    },
  },
});

interface Props {
  onPublishError: Handler;
  onSubscribeError: Handler;
  publisherEventHandlers: PublisherEvents;
  session: Session;
  subscriberEventHandlers: SubscriberEvents;
  videoSource: MediaStreamTrack | undefined
}

function onSubscribe() {
  console.log('onSubscribe');
}

function onPublish() {
  console.log('onPublish');
}

export const CallView = ({
  onPublishError,
  onSubscribeError,
  publisherEventHandlers,
  session,
  subscriberEventHandlers,
  videoSource,
}: Props) => {
  const classes = useStyles();

  return (<div className={classes.root}>
    <OTStreams>
      <OTSubscriber
        properties={{ width: '100%', height: '100%', videoscale: 'fill', showControls: true }}
        onSubscribe={onSubscribe}
        onError={onSubscribeError}
        eventHandlers={subscriberEventHandlers}
      />
    </OTStreams>
    {/* <button id="videoButton" onClick={this.toggleVideo} style={{ position: 'absolute', top: 100 }}>
    {publishVideo ? 'Disable' : 'Enable'} Video
  </button> */}
    <OTPublisher
      properties={{
        publishVideo: true,
        resolution: '1280x720',
        width: 150, height: 150,
        showControls: true,
        videoSource: videoSource,
      }}
      onPublish={onPublish}
      onError={onPublishError}
      eventHandlers={publisherEventHandlers}
    />
  </div>);
};
