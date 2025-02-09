import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Linking, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';

type LinkPreviewProps = {
  videoId: string;
};

const YOUTUBE_API_KEY = 'AIzaSyCoyexSyVzPYHarAAzhg4ibapetUYEmaOw'; // Replace with your API key

const LinkPreview: React.FC<LinkPreviewProps> = ({ videoId }) => {
  const [videoDetails, setVideoDetails] = useState<{ title: string; thumbnailUrl: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet`
        );
        const video = response.data.items[0]?.snippet;
        if (video) {
          setVideoDetails({
            title: video.title,
            thumbnailUrl: video.thumbnails.medium.url,
          });
        } else {
          setVideoDetails(null);
        }
      } catch (error) {
        console.error('Error fetching video details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideoDetails();
  }, [videoId]);

  if (loading) {
    return <ActivityIndicator size="small" color="#000" />;
  }

  if (!videoDetails) {
    return <Text style={styles.errorText}>Error loading video</Text>;
  }

  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`)}
      style={styles.tile}>
      <Image source={{ uri: videoDetails.thumbnailUrl }} style={styles.thumbnail} />
      <Text style={styles.tileTitle}>{videoDetails.title}</Text>
    </TouchableOpacity>
  );
};

const LinksList: React.FC<{ videoIds: string[] }> = ({ videoIds }) => (
  <FlatList
    data={videoIds}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item }) => <LinkPreview videoId={item} />}
    numColumns={2}
    columnWrapperStyle={styles.row}
    contentContainerStyle={styles.list}
  />
);

const WebLinksList: React.FC<{ links: { title: string; url: string }[] }> = ({ links }) => (
  <View style={styles.webLinksContainer}>
    {links.map((link, index) => (
      <TouchableOpacity key={index} style={styles.webLinkItem} onPress={() => Linking.openURL(link.url)}>
        <Text style={styles.webLinkText}>{link.title}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const BloodCompatibilityChart: React.FC = () => (
  <View style={styles.chartContainer}>
    <Text style={styles.chartHeading}>Blood Donation Compatibility</Text>
    <Image
      source={{ uri: 'https://www.blood.ca/sites/default/files/DonorRecipient-Chart_1.jpeg' }} // Placeholder for the base64 encoded image data
      style={styles.chartImage}
    />
  </View>
);

const OnlineInfo: React.FC = () => {
  const videoIds = ['jmhiHKsEUXU', 'aJrWP_cmNpw', 'Tfwq_vJHwT8','5nDk3PjtaEM','Q55LrC7vijM']; 
  const webLinks = [
    { title: 'Red Cross Blood Donation Camps Schedules', url: 'https://indianredcross.org/ircs/program/BloodBank/Camps' },
  ];

  return (
    <ScrollView style={styles.container}>
      <BloodCompatibilityChart />
      <Text style={styles.heading}>Informative Videos and Links</Text>
      <LinksList videoIds={videoIds} />
      <Text style={styles.subHeading}>Useful Links</Text>
      <WebLinksList links={webLinks} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#520203',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#FFF',
  },
  subHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#FFF',
  },
  list: {
    paddingBottom: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  tile: {
    flex: 1,
    margin: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  thumbnail: {
    width: '100%',
    height: 120,
  },
  tileTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    padding: 8,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 14,
    textAlign: 'center',
  },
  webLinksContainer: {
    paddingVertical: 10,
  },
  webLinkItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#FFF',
    borderRadius: 5,
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  webLinkText: {
    fontSize: 16,
    color: '#520203',
    fontWeight: '500',
  },
  chartContainer: {
    marginBottom: 20,
  },
  chartHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#FFF',
  },
  chartImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
});

export default OnlineInfo;
