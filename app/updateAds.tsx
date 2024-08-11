import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Button,
  StyleSheet,
  ScrollView,
  Dimensions,
  Pressable,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import FeaturesSheet from '@/components/Publish/FeaturesSheet';
import { useSelector, useDispatch } from 'react-redux';
import { setamenities } from '@/store/slices/publish';

const HEIGHT = Dimensions.get('window').height;

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const daysOfWeekAr = ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'];

const EditAd = () => {
  const data = useSelector((state) => state.publishData.value);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [photos, setPhotos] = useState([]);
  const [typeAd, setTypeAd] = useState('');
  const [variablePrices, setVariablePrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [myAd, setAd] = useState(null);

  useEffect(() => {
    const fetchAdDetails = async () => {
      try {
        const response = await axios.get(`https://backend.sakanijo.com/api/places/${id}`);
        const ad = response.data;

        setTitle(ad.title);
        setDescription(ad.description);
        setPrice(ad.price.toString());
        setPhotos(ad.photos ? ad.photos.split(',') : []);
        setTypeAd(ad.home_type);

        let variablePricesParsed = JSON.parse(ad.variable_prices);
        variablePricesParsed = JSON.parse(variablePricesParsed);

        // Initialize variable prices with default values for all days of the week
        const initialVariablePrices = {};
        daysOfWeekAr.forEach((day) => {
          initialVariablePrices[day] = variablePricesParsed[day] || '';
        });

        setVariablePrices(initialVariablePrices);
        setAd(ad);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching ad details:', err);
        setError('Failed to fetch ad details');
        setLoading(false);
      }
    };

    fetchAdDetails();
  }, [id]);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      base64: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      setPhotos((prevPhotos) => [...prevPhotos, ...selectedImages]);
    }
  };

  const handleDeletePhoto = (photoUri) => {
    setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo !== photoUri));
  };

  const handleVariablePriceChange = (day, value) => {
    setVariablePrices((prevPrices) => ({
      ...prevPrices,
      [day]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(`https://backend.sakanijo.com/ads/update/${id}`, {
        title,
        description,
        price,
        amenities: JSON.stringify(data.amenities),
        photos: photos.join(','),
        variable_prices: JSON.stringify(variablePrices),
      });

      if (response.status === 200) {
        console.log('Ad updated successfully');
        router.back();
      }
    } catch (err) {
      console.error('Error updating ad:', err);
    }
  };

  if (loading) {
    return <Text>{t('loading')}</Text>;
  }

  if (error) {
    return <Text>{t('error')}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>{t('titleInput')}</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>{t('descriptionInput')}</Text>
        <TextInput
          style={styles.textArea}
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>{t('priceInput')}</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>{t('photos')}</Text>
        <View style={styles.photosContainer}>
          {photos.map((photo, index) => (
            <View key={index} style={styles.photoWrapper}>
              <Image
                source={{
                  uri: /^\d+_/.test(photo)
                    ? `https://backend.sakanijo.com/api/images/${encodeURIComponent(myAd.folderName)}/${encodeURIComponent(photo)}`
                    : photo,
                }}
                style={styles.photo}
              />
              <TouchableOpacity
                style={styles.deletePhotoButton}
                onPress={() => handleDeletePhoto(photo)}
              >
                <Ionicons name="close-circle" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addPhotoButton} onPress={handleImagePick}>
            <Ionicons name="add-circle" size={40} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <FeaturesSheet type={typeAd} />

      <View style={styles.variablePricesContainer}>
        <Text style={styles.label}>{t('variablePrices')}</Text>
        {daysOfWeekAr.map((day) => (
          <View key={day} style={styles.variablePriceField}>
            <Text style={styles.variablePriceLabel}>{day}</Text>
            <TextInput
              style={styles.input}
              value={variablePrices[day] ? variablePrices[day]   : price }
              onChangeText={(value) => handleVariablePriceChange(day, value)}
              keyboardType="numeric"
            />
          </View>
        ))}
      </View>

      <Pressable
        onPress={handleSave}
        style={styles.saveButton}
      >
        <Text style={styles.saveButtonText}>{t('save')}</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    height: HEIGHT,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'droidAr',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: 'droidAr',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
    fontFamily: 'droidAr',
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoWrapper: {
    position: 'relative',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  deletePhotoButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
  },
  addPhotoButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  variablePricesContainer: {
    marginTop: 20,
  },
  variablePriceField: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  variablePriceLabel: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'droidAr',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'droidAr',
  },
});

export default EditAd;