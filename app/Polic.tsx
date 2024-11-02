import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import RenderHTML from 'react-native-render-html';

const Policy = () => {
  const route = useRoute();
  const language = route.params?.lang || 'en';
  const [policyText, setPolicyText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await axios.get('https://backend.sakanijo.com/privacy');
        const data = response.data;

        // Set the policy text based on the selected language
        setPolicyText(language === 'ar' ? data.privacy_ar : data.privacy_en);
      } catch (error) {
        console.error('Error fetching privacy policy:', error);
        setPolicyText('Failed to load privacy policy.');
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, [language]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>
        {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
      </Text>
      <RenderHTML
        contentWidth={300}  // Adjust as needed
        source={{ html: policyText }}
        baseStyle={{
            fontFamily: 'droidAr', // Replace with your font family name
            fontSize: 20, // Adjust the default font size here
            color: '#333', // Set a default text color if needed
          }}
      />
      
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  policyText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'left',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Policy;
