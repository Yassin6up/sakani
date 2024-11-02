import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ActivityIndicator } from 'react-native';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useTranslation } from 'react-i18next';
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { router } from 'expo-router';
import ConfirmDeleteModal from './DeleteModal';

const MyAdsContent = ({ open }) => {
  const { t } = useTranslation();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [refrish, setRefrish] = useState(false);

  // Fetch posts from API
  const fetchPosts = async () => {
    const ownerId = await SecureStore.getItem("userId");

    try {
      const response = await axios.get(
        "https://backend.sakanijo.com/profile/places",
        { params: { ownerId } }
      );
      setPosts([...response.data.ads, ...response.data.booking]);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [refrish, open]);

  const snapPoints = useMemo(() => ['50%', '90%'], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  useEffect(() => {
    if (open) handlePresentModalPress();
  }, [open]);

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <BottomSheetModal ref={bottomSheetModalRef} index={1} snapPoints={snapPoints}>
          <BottomSheetScrollView style={styles.contentContainer}>
            <Text style={styles.headerText}>{t("myAds")} ({posts.length})</Text>
            {loading ? (
              <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
              posts.map((post) => (
                <View key={post.id} style={styles.postCard}>
                  <Image source={{
                    uri: `https://backend.sakanijo.com/api/images/${encodeURIComponent(post.folderName)}/${encodeURIComponent(post.photos?.split(",")[0])}`,
                  }} style={styles.postImage} />
                  <View style={styles.postDetails}>
                    <Text style={styles.postTitle} numberOfLines={1}>
                      {post.title}
                    </Text>
                    <Text style={styles.postDescription} numberOfLines={3}>
                      {post.description}
                    </Text>

                    {/* Status icon and text based on post approval and acceptance */}
                    <View style={styles.statusContainer}>
                      {post.approved === 0 ? (
                        <>
                          <MaterialIcons name="hourglass-empty" size={16} style={styles.inReviewIcon} />
                          <Text style={[styles.postStatus, styles.inReview]}>{t('inReview')}</Text>
                        </>
                      ) : post.active === 1 ? (
                        <>
                          <MaterialIcons name="check-circle" size={16} style={styles.publishedIcon} />
                          <Text style={[styles.postStatus, styles.published]}>{t('published')}</Text>
                        </>
                      ) : (
                        <>
                          <MaterialIcons name="block" size={16} style={styles.stoppedIcon} />
                          <Text style={[styles.postStatus, styles.stopped]}>{t('stopped')}</Text>
                        </>
                      )}
                    </View>

                    <View style={styles.buttonContainer}>
                      <Pressable onPress={() => router.navigate("/updateAds?id=" + post.id)} style={styles.iconButton}>
                        <FontAwesome name="edit" size={20} color={Colors.primary} />
                      </Pressable>
                      <Pressable onPress={() => setVisible(true)} style={styles.iconButton}>
                        <MaterialIcons name="delete" size={20} color="#dc2626" />
                      </Pressable>
                    </View>
                  </View>
                  <ConfirmDeleteModal
                    isVisible={visible}
                    onConfirm={async () => {
                      try {
                        const response = await axios.post(
                          `https://backend.sakanijo.com/delete/places/${post.id}`
                        );
                        if (response.status === 200) {
                          setRefrish(!refrish);
                          setVisible(false);
                        }
                      } catch (error) {
                        console.error("Error deleting place:", error);
                      }
                    }}
                    onClose={() => setVisible(false)}
                  />
                </View>
              ))
            )}
          </BottomSheetScrollView>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerText: {
    fontFamily: "droidAr",
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
  },
  postImage: {
    width: '100%',
    height: 150,
  },
  postDetails: {
    padding: 15,
  },
  postTitle: {
    fontFamily: 'droidAr',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 5,
    textAlign: "right",
  },
  postDescription: {
    fontFamily: 'droidAr',
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 10,
    textAlign: "right",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  iconButton: {
    padding: 8,
  },
  postStatus: {
    fontFamily: 'droidAr',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'flex-end',
  },
  inReview: {
    color: 'gold',
  },
  published: {
    color: 'green',
  },
  stopped: {
    color: 'red',
  },
  inReviewIcon: {
    color: 'gold',
    marginRight: 5,
  },
  publishedIcon: {
    color: 'green',
    marginRight: 5,
  },
  stoppedIcon: {
    color: 'red',
    marginRight: 5,
  },
});

export default MyAdsContent;
