import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import React, { memo, useEffect, useRef, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import * as Location from 'expo-location';
import { defaultStyles } from '@/constants/Styles';
interface Props {
  listings: any;
}

const INITIAL_REGION = {
  latitude: 31.9454,  // Latitude for Amman, Jordan
  longitude: 35.9284, // Longitude for Amman, Jordan
  latitudeDelta: 0.1, // Adjust the delta for desired zoom level
  longitudeDelta: 0.1, // Adjust the delta for desired zoom level
};

const JORDAN_BOUNDS = {
  northEast: { latitude: 33.415, longitude: 40.951 },
  southWest: { latitude: 29.182, longitude: 35.651 },
};

const ListingsMap = memo(({ listings }: Props) => {
  const router = useRouter();
  const mapRef = useRef<any>(null);
  const [userLocation, setUserLocation] = useState<any>(null);

  useEffect(() => {
    onLocateMe();
  }, []);

  const onMarkerSelected = (event: any) => {
    console.log(event.id);
    router.push(`/listing/${event.id}`);
  };

  const onLocateMe = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setUserLocation(location.coords);

    const region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };

    mapRef.current?.animateToRegion(region);
  };

  const onRegionChange = (region: any) => {
    const { northEast, southWest } = JORDAN_BOUNDS;
    const { latitude, longitude, latitudeDelta, longitudeDelta } = region;

    if (
      latitude < southWest.latitude ||
      latitude > northEast.latitude ||
      longitude < southWest.longitude ||
      longitude > northEast.longitude
    ) {
      mapRef.current?.animateToRegion(INITIAL_REGION);
    }
  };

  return (
    <View style={defaultStyles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={INITIAL_REGION}
        onRegionChangeComplete={onRegionChange}
        zoomEnabled={true}
        pitchEnabled={false}
        rotateEnabled={false}
        // provider={PROVIDER_GOOGLE}
      >
       

        {listings?.map((item) => {
          if (!item?.lat || !item?.lng) {
            console.warn('Invalid listing coordinates:', item);
            return null;
          }

          return (
            <Marker
              coordinate={{
                latitude: item.lat,
                longitude: item.lng,
              }}
              key={item.id}
              onPress={() => onMarkerSelected(item)}
            >
              <View style={styles.marker}>
                <Text style={styles.markerText}>JOD {item.price}</Text>
              </View>
            </Marker>
          );
        })}

{userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            
            title="Your Location"
          >
            <View style={styles.userMarker} />
          </Marker>
        )}


      </MapView>

      <TouchableOpacity style={styles.locateBtn} onPress={onLocateMe}>
        <Ionicons name="navigate" size={24} color={Colors.dark} />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marker: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
  markerText: {
    fontSize: 14,
    fontFamily: 'droidAr',
  },
  locateBtn: {
    position: 'absolute',
    bottom: 110,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
  userMarker: {
    width: 10,
    height: 10,
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
});

export default ListingsMap;
