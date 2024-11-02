import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator  , ScrollView} from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import RenderHTML from 'react-native-render-html';

const Terms = () => {
  const route = useRoute();
  const language = route.params?.lang || 'en';
  const [termsText, setTermsText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await axios.get('https://backend.sakanijo.com/terms');
        const data = response.data;
        
        // Set the terms based on the selected language
        setTermsText(language === 'ar' ? data.terms_ar : data.terms_en);
      } catch (error) {
        console.error('Error fetching terms:', error);
        setTermsText('Failed to load terms and conditions.');
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
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
        {language === 'ar' ? 'الشروط والأحكام' : 'Terms and Conditions'}
      </Text>
      <RenderHTML
        contentWidth={300}  // Adjust as needed
        source={{ html: termsText }}
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
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  termsText: {
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

export default Terms;
