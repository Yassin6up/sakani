import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useState } from 'react';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { TextInput } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
// import DatePicker from 'react-native-modern-datepicker';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import axios from 'axios'; // Make sure you have axios installed
import { useDispatch } from 'react-redux';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { places } from '@/assets/data/places';
import { setPlaces } from '@/store/slices/posts';
import { useTranslation } from 'react-i18next';
import { Calendar } from 'react-native-calendars';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const Page = () => {
  const { t } = useTranslation();
  const [priceRange, setPriceRange] = useState([100, 9999]);
  const [openCard, setOpenCard] = useState(0);
  const [selectedPlace, setSelectedPlace] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0, 10));
  const dispatch = useDispatch();
  const router = useRouter();
  const today = new Date().toISOString().substring(0, 10);

  const onClearAll = () => {
    setSelectedPlace(0);
    setOpenCard(0);
  };


  const handleDayPress = (day) => {
    // Log the raw date value received from Calendar
    console.log("Raw date from Calendar:", day.dateString);

    // Function to convert Arabic numerals to English numerals if necessary
    const convertToEnglishNumerals = (dateString) => {
      return dateString.replace(/[\u0660-\u0669]/g, (c) => c.charCodeAt(0) - 0x0660)
                       .replace(/[\u06f0-\u06f9]/g, (c) => c.charCodeAt(0) - 0x06f0);
    };

    // Apply conversion if needed
    const englishDate = convertToEnglishNumerals(day.dateString);
    console.log("Converted date:", englishDate);

    // Update the selected date
    setSelectedDate(englishDate);
  };


  const applyFilters = async () => {
    console.log("start fetching");
    console.log({
      city: places[selectedPlace]?.title,
      date: selectedDate,
      priceRange: priceRange,
    });
    try {
      const response = await axios.post('https://backend.sakanijo.com/filter', {
        city: places[selectedPlace]?.title,
        date: selectedDate,
        priceRange: priceRange,
      });

      // Handle response data here
      dispatch(setPlaces(response.data));
      router.back();
      
      console.log('Filtered data:', response.data);
      
    } catch (error) {
      console.error('Error applying filters:', error.response.data.message);
    }
  };

  return (
    <BlurView intensity={90} style={styles.container} tint="light">
      {/* Where */}
      <View style={styles.card}>
        {openCard !== 0 && (
          <AnimatedTouchableOpacity
            onPress={() => setOpenCard(0)}
            style={styles.cardPreview}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}>
            <Text style={styles.previewText}>{t('where')}</Text>
            <Text style={styles.previewdData}>{t('cityOrArea')}</Text>
          </AnimatedTouchableOpacity>
        )}

        {openCard === 0 && <Text style={styles.cardHeader}>{t('selectArea')}</Text>}
        {openCard === 0 && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.cardBody}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.placesContainer}>
              {places.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedPlace(index)}
                  style={selectedPlace === index ? styles.placeSelected : styles.place}>
                  <Text style={{ fontFamily: "droidAr" }}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}
      </View>

      {/* When */}
      <View style={styles.card}>
        {openCard !== 1 && (
          <AnimatedTouchableOpacity
            onPress={() => setOpenCard(1)}
            style={styles.cardPreview}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}>
            <Text style={styles.previewText}>{t('recentAds')}</Text>
            <Text style={styles.previewdData}>{t('selectDate')}</Text>
          </AnimatedTouchableOpacity>
        )}

        {openCard === 1 && <Text style={styles.cardHeader}>{t('selectDate')}</Text>}
        {openCard === 1 && (
         <Animated.View style={styles.cardBody}>
         <Calendar
           // Initial date to display
           current={today}
           // Date selected
           markedDates={{
             [selectedDate]: { selected: true, marked: true, selectedColor: Colors.primary },
           }}
           // Handle day press
           onDayPress={handleDayPress}
           // Optional styling
           theme={{
             todayTextColor: Colors.primary,
             arrowColor: Colors.primary,
             monthTextColor: Colors.primary,
             textDayFontWeight: 'bold',
             textMonthFontWeight: 'bold',
             textDayHeaderFontWeight: 'bold',
             textDayFontSize: 16,
             textMonthFontSize: 16,
             textDayHeaderFontSize: 14,
           }}
         />
         {/* <Text>Selected Date: {selectedDate}</Text> */}
       </Animated.View>
        )}
      </View>

      {/* Guests */}
      <View style={styles.card}>
        {openCard !== 2 && (
          <AnimatedTouchableOpacity
            onPress={() => setOpenCard(2)}
            style={styles.cardPreview}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}>
            <Text style={styles.previewText}>{t('priceRange')}</Text>
            <Text style={styles.previewdData}>{t('setPriceRange')}</Text>
          </AnimatedTouchableOpacity>
        )}

        {openCard === 2 && <Text style={styles.cardHeader}>{t('priceRange')}</Text>}
        {openCard === 2 && (
          <Animated.View style={styles.cardBody}>
            <View style={styles.sliderContainer}>
              <View style={styles.priceLabels}>
                <Text style={styles.label}>{t('minPrice', { price: priceRange[0] })}</Text>
                <Text style={styles.label}>{t('maxPrice', { price: priceRange[1] })}</Text>
              </View>
              <MultiSlider
                values={[priceRange[0], priceRange[1]]}
                sliderLength={280}
                onValuesChange={values => setPriceRange(values)}
                min={100}
                max={9999}
                step={1}
                allowOverlap={false}
                snapped
                selectedStyle={styles.selectedTrack}
                unselectedStyle={styles.unselectedTrack}
                markerStyle={styles.marker}
                containerStyle={styles.sliderContainerStyle}
                trackStyle={styles.track}
              />
            </View>
          </Animated.View>
        )}
      </View>

      {/* Footer */}
      <Animated.View style={defaultStyles.footer} entering={SlideInDown.delay(200)}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity onPress={onClearAll} style={styles.clearAllButton}>
            <Text style={styles.clearAllText}>{t('clearAll')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={applyFilters} style={styles.searchButton}>
            <Text style={styles.searchButtonText}>{t('applyFilters')}</Text>
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    margin: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    gap: 20,
  },
  cardHeader: {
    fontFamily: 'droidAr',
    fontSize: 24,
    padding: 20,
  },
  cardBody: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  placesContainer: {
    flexDirection: 'row',
    gap: 25,
  },
  place: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: "center"
  },
  placeSelected: {
    borderColor: Colors.grey,
    borderWidth: 3,
    borderRadius: 10,

    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: "center"
  },
  previewText: {
    fontFamily: 'droidAr',
    fontSize: 14,
    color: Colors.grey,
  },
  previewdData: {
    fontFamily: 'droidAr',
    fontSize: 14,
    color: Colors.dark,
  },
  sliderContainer: {
    alignItems: 'center',
  },
  priceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 500,
    color: '#333',
  },
  selectedTrack: {
    backgroundColor: '#ff5a5f',
  },
  unselectedTrack: {
    backgroundColor: '#d3d3d3',
  },
  marker: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#ff5a5f',
  },
  sliderContainerStyle: {
    marginVertical: 10,
  },
  track: {
    height: 2,
  },
  clearAllButton: {
    padding: 10,
    backgroundColor: Colors.lightGrey,
    borderRadius: 8,
  },
  clearAllText: {
    fontFamily: 'droidAr',
    fontSize: 16,
    color: Colors.dark,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  searchButtonText: {
    fontFamily: 'droidAr',
    fontSize: 16,
    color: 'white',
    marginRight: 10,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
  },
});

export default Page;
