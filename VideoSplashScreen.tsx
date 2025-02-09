import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import Video from 'react-native-video';

interface VideoSplashScreenProps {
  onFinish: () => void; // Callback to notify when video finishes
}

const VideoSplashScreen: React.FC<VideoSplashScreenProps> = ({ onFinish }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoFinished, setIsVideoFinished] = useState(false);

  useEffect(() => {
    if (isVideoFinished) {
      onFinish();
    }
  }, [isVideoFinished, onFinish]);

  return (
    <View style={styles.container}>
      {!isVideoLoaded && (
        <ActivityIndicator
          style={styles.loader}
          size="large"
          color="#FFF"
        />
      )}
      <Video
        source={require('./assets/App.mp4')} // Ensure the correct path to the video file
        style={styles.video}
        resizeMode="contain" // Options: 'contain', 'cover', 'stretch', etc.
        onLoad={() => setIsVideoLoaded(true)} // Set loading to false when video is ready
        onEnd={() => setIsVideoFinished(true)}
        repeat={false}
        controls={false} // Disable controls
        muted={true} // Optional: Mute video
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF', // Background color for a seamless fallback
  },
  video: {
    flex: 1,
    width: Dimensions.get('window').width, // Match the screen width
    height: Dimensions.get('window').height, // Match the screen height
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }], // Center the loader
  },
});

export default VideoSplashScreen;
