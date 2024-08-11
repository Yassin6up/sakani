import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';
import Colors from '@/constants/Colors';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { places } from '@/assets/data/places';
import { setCoordinateData, setAdress } from '@/store/slices/publish';

const Step2 = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading , setLoading] = useState(false)
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const data = useSelector((state) => state.publishData.value);

  const INITIAL_REGION = {
    latitude: 33.582,
    longitude: -7.6,
    latitudeDelta: 9,
    longitudeDelta: 9,
  };

  useEffect(() => {
    if (searchText === '') {
      setFilteredPlaces([]);
    } else {
      const filtered = places.filter((place) =>
        place.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredPlaces(filtered);
    }
  }, [searchText]);


  const onLocateMe = async () => {
    setLoading(true)
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return;
    }
  
    let location = await Location.getCurrentPositionAsync({});
    const region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  
    mapRef.current?.animateToRegion(region);
    setSelectedLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    dispatch(setCoordinateData({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    }));

    // Reverse geocoding to get the address
    let reverseGeocode = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  
    if (reverseGeocode.length > 0) {
      const address = reverseGeocode[0];
      const placeName = `${address.city}`;
      dispatch(setAdress(placeName));
      setLoading(false)
    }
  };



  const selectCity = (city) => {
    const selectedCity = places.find((place) => place.title === city);
    if (selectedCity) {
      const { latitude, longitude } = selectedCity.coordinates;
      mapRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      setSelectedLocation({
        latitude,
        longitude,
      });
      dispatch(setCoordinateData({
        latitude,
        longitude
      }));
      dispatch(setAdress(selectedCity.title));
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('step2Title')}</Text>
      <Text style={styles.subTitle}>{t('stepSubTitle')} - {data.homeType}</Text>
      <Text style={{fontSize : 16 , fontFamily : "droidAr"  , textAlign  :"center" , marginTop : 40}}> يمكنك تحريك الايقونة للحصول على المكان بدقة</Text>
      <View style={styles.boxesContainer}>
        <MapView
          ref={mapRef}
          animationEnabled={false}
          style={{ ...StyleSheet.absoluteFillObject, borderRadius: 10 }}
          initialRegion={INITIAL_REGION}
          clusterColor="#fff"
          clusterTextColor="#000"
          clusterFontFamily="droidAr"
        >

          {selectedLocation && (
            <Marker
              coordinate={selectedLocation}
              draggable
              onDragEnd={(e) => {
                setSelectedLocation(e.nativeEvent.coordinate);
              }}
              image={require("@/assets/images/navigator.png")}
            />
          )}
        </MapView>

        
      </View>
      <View style={styles.buttonsContainer}>
          <Pressable
            style={styles.button}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>اختيار المدينة</Text>
          </Pressable>
          
          <Pressable
            style={styles.button}
            onPress={onLocateMe}
          >
            {loading ?  
                  <ActivityIndicator  color={"white"} size={50}/>
          :
                  <Text style={styles.buttonText}>اخد موقعي الحالي</Text>
          }

            <FontAwesome name="location-arrow" size={20} color="white" />
          </Pressable>
        </View>

        

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>اختر المحافضة</Text>
            <FlatList
              data={places}
              keyExtractor={(item) => item.title}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => selectCity(item.title)}
                >
                  <Text style={styles.text}>{item.title}</Text>
                </TouchableOpacity>
              )}
            />
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>اغلاق</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: 'droidAr',
    marginHorizontal: 50,
  },
  boxesContainer: {
    width: '100%',
    marginTop: 10,
    padding: 15,
    display: 'flex',
    height: 450,
    borderRadius: 10,
    overflow: 'hidden',
  },
  subTitle: {
    color: 'grey',
    fontFamily: 'droidAr',
    textAlign: 'right',
    marginRight: 50,
  },
  text: {
    fontFamily: 'droidAr',
  },
  buttonsContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  button: {
    width: '90%',
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'droidAr',
    fontSize: 16,
    marginRight: 10,
  },
  separator: {
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width : "100% "
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'droidAr',
    marginBottom: 20,
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  closeButton: {
    marginTop: 20,
    width: '90%',
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Step2;
