

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { router, useLocalSearchParams } from 'expo-router';
import Colors from '@/constants/Colors'; // Assuming you have defined Colors
import axios from 'axios';
import { useDispatch , useSelector} from 'react-redux';
import { setPlaces } from '@/store/slices/posts';
const featureData = {
  منزل: [
    "مفروشة", "مصعد", "شقة طابقية", "بلكونة", "حديقة", "مطبخ راكب", "صالون", "غرفة غسيل", "غرفة تخزين", "تكيف",
    "حماية نوافذ", "نظام شمسي", "حارس", "خزانة حائط", "أجهزة كهربائية", "ديكور", "نوافذ زجاجية مزدوجة", "نظام حماية"
  ],
  مزرعة: [
    "المياه واصلة", "الكهرباء واصلة", "المجاري واصلة", "حارس مزرعة", "منطقة شواء", "منطقة لعب أطفال", "غرفة الحارس",
    "إنترنت واي فاي", "الطاقة الشمسية", "منظر بانورامي", "منعزلة عن السكان", "نظام صوتي"
  ],
  ارض: [
    "المياه واصلة", "الكهرباء واصلة", "المجاري واصلة", "مسيجة", "تقع داخل مجمع فيلات", "منظر بانورامي", "مطلّة على الشارع"
  ],
  شقة: [
    "مصعد", "مفروشة", "بلكونة", "مطبخ راكب", "حماية نوافذ", "شقة طابقية", "نوافذ زجاجية مزدوجة", "ديكور", "خزانة حائط"
  ]
};

const Filter = () => {
  const { type } = useLocalSearchParams();
  const dispatch = useDispatch()
  const [location, setLocation] = useState('');
  const [street, setStreet] = useState('');
  const [title, setTitle] = useState('');
  const [minPrice, setMinPrice] = useState('0');
  const [maxPrice, setMaxPrice] = useState('999');
  const [minSpace, setMinSpace] = useState('');
  const [maxSpace, setMaxSpace] = useState('');
  const [homeType, setHomeType] = useState('');
  const [features, setFeatures] = useState({});
  const [negotiation, setNegotiation] = useState('');

  const handleFeatureChange = (feature) => {
    setFeatures({ ...features, [feature]: !features[feature] });
  };

  const handleNegotiationChange = (option) => {
    setNegotiation(option);
  };

  const places  = useSelector(state => state.places.value.places)

  const onSubmit = async (dataForFilter) => {
    // Remove empty fields from the dataForFilter object
    const filteredData = Object.fromEntries(
      Object.entries(dataForFilter).filter(([_, value]) => value !== undefined && value !== '')
    );
    
    // Parse amenities field if it exists
    const parseAmenities = (str) => {
      try {
        // Remove extra escape characters before parsing
        let parseData = JSON.parse(str);
        console.log("parsed data",  parseData)
        return parseData 
      } catch (error) {
        console.error('Error parsing amenities:', error);
        return [];
      }
    };
  
    try {
      let filteredPlaces = places;
  
      // Extract features from filteredData
      let features = [];
      if (filteredData.features) {
        features = Object.keys(filteredData.features).filter(key => filteredData.features[key] === true);
      }
  
      // Apply filters
      filteredPlaces = filteredPlaces.filter(place => {
        // Filter by location, street, and title
        const matchesLocation = filteredData.location ? place.address.includes(filteredData.location) : true;
        const matchesStreet = filteredData.street ? place.address.includes(filteredData.street) : true;
        const matchesTitle = filteredData.title ? place.title.includes(filteredData.title) : true;
  
        // Filter by price
        const price = parseFloat(place.price);
        const matchesPrice = (!filteredData.minPrice || price >= parseFloat(filteredData.minPrice)) &&
                             (!filteredData.maxPrice || price <= parseFloat(filteredData.maxPrice));
  
        // Filter by space
        const space = parseFloat(place.space_general);
        const matchesSpace = (!filteredData.minSpace || space >= parseFloat(filteredData.minSpace)) &&
                             (!filteredData.maxSpace || space <= parseFloat(filteredData.maxSpace));
  
        // Filter by homeType
        const matchesHomeType = filteredData.homeType ? place.home_type === filteredData.homeType : true;
  
        // Filter by features
        let amenities = [];
        if (place.amenities) {
          amenities = parseAmenities(place.amenities);
        }
        const matchesFeatures = features.length === 0 || features.every(feature => amenities.includes(feature));
  
        // Filter by negotiation
        const matchesNegotiation = filteredData.negotiation ? place.ads_accept === filteredData.negotiation : true;
  
        return matchesLocation && matchesStreet && matchesTitle && matchesPrice && matchesSpace && matchesHomeType && matchesFeatures && matchesNegotiation;
      });
  
      dispatch(setPlaces(filteredPlaces));
      router.navigate("/(tabs)");
  
    } catch (error) {
      console.error('Error filtering places:', error);
    }
  };
  


  const handleSubmit = () => {
    const filters = {
      location,
      street,
      title,
      minPrice,
      maxPrice,
      minSpace,
      maxSpace,
      homeType,
      features,
      negotiation,
    };
    onSubmit(filters);
  };

  const handleReset = () => {
    setLocation('');
    setStreet('');
    setTitle('');
    setMinPrice('');
    setMaxPrice('');
    setMinSpace('');
    setMaxSpace('');
    setHomeType('');
    setFeatures({});
    setNegotiation('');
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>العنوان</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="أدخل العنوان"
      />
      <Text style={styles.label}>أقل سعر</Text>
      <TextInput
        style={styles.input}
        value={minPrice}
        onChangeText={setMinPrice}
        placeholder="أدخل أقل سعر"
        keyboardType="numeric"
      />
      <Text style={styles.label}>أعلى سعر</Text>
      <TextInput
        style={styles.input}
        value={maxPrice}
        onChangeText={setMaxPrice}
        placeholder="أدخل أعلى سعر"
        keyboardType="numeric"
      />
      <Text style={styles.label}>مساحة العقار (م²)</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.spaceInput]}
          value={minSpace}
          onChangeText={setMinSpace}
          placeholder="أقل مساحة"
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.spaceInput]}
          value={maxSpace}
          onChangeText={setMaxSpace}
          placeholder="أعلى مساحة"
          keyboardType="numeric"
        />
      </View>
      {type === 'شقة' && (
        <>
          <Text style={styles.label}>عدد الغرف في المنزل</Text>
          <TextInput
            style={styles.input}
            value={homeType}
            onChangeText={setHomeType}
            placeholder="أدخل عدد الغرف"
            keyboardType="numeric"
          />
          <Text style={styles.label}>رقم الطابق</Text>
          <TextInput
            style={styles.input}
            value={homeType}
            onChangeText={setHomeType}
            placeholder="أدخل رقم الطابق"
            keyboardType="numeric"
          />
        </>
      )}
      {type === 'مزرعة' && (
        <>
          <Text style={styles.label}>المزرعة تحتوي على منزل؟</Text>
          <CheckBox
            title="نعم"
            checked={features['مزرعة تحتوي على منزل']}
            onPress={() => handleFeatureChange('مزرعة تحتوي على منزل')}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
          />
          <Text style={styles.label}>المزرعة بها بئر مياه؟</Text>
          <CheckBox
            title="نعم"
            checked={features['مزرعة بها بئر مياه']}
            onPress={() => handleFeatureChange('مزرعة بها بئر مياه')}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
          />
          <Text style={styles.label}>هل هي مزروعة؟</Text>
          <CheckBox
            title="نعم"
            checked={features['هل هي مزروعة']}
            onPress={() => handleFeatureChange('هل هي مزروعة')}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
          />
        </>
      )}
      {type === 'ارض' && (
        <>
          <Text style={styles.label}>الأرض تطل على الشارع؟</Text>
          <CheckBox
            title="نعم"
            checked={features['الأرض تطل على الشارع']}
            onPress={() => handleFeatureChange('الأرض تطل على الشارع')}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
          />
          <Text style={styles.label}>تحتوي على حماية؟</Text>
          <CheckBox
            title="نعم"
            checked={features['تحتوي على حماية']}
            onPress={() => handleFeatureChange('تحتوي على حماية')}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
          />
        </>
      )}
      {/* {type === 'شقة' && ( */}
        <>
          <Text style={styles.label}>مميزات العقار</Text>
          {featureData[type].map((feature) => (
            <CheckBox
              key={feature}
              title={feature}
              checked={features[feature]}
              onPress={() => handleFeatureChange(feature)}
              containerStyle={styles.checkboxContainer}
              textStyle={styles.checkboxText}
            />
          ))}
        </>
      {/* )} */}
      <Text style={styles.label}>هل السعر قابل للتفاوض؟</Text>
      {['قابل لتفاوض', 'تقبل التقسيط', 'لا يقبل اي شيئ'].map((option) => (
        <CheckBox
          key={option}
          title={option}
          checked={negotiation === option}
          onPress={() => handleNegotiationChange(option)}
          containerStyle={styles.checkboxContainer}
          textStyle={styles.checkboxText}
        />
      ))}
      <View style={styles.buttonContainer}>
        <Button title="الرجوع" onPress={() => setLocation('')} color={Colors.secondary} />
                 <View>
         <Pressable onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>تطبيق الفلاتر</Text>
         </Pressable>
         <Pressable style={{marginTop : 10}} onPress={handleReset} >
             <Text  style={{fontFamily : "droidAr"}}> إعادة تعيين الكل </Text>
            </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F8F8F8',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Droid Arabic Kufi',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: 'Droid Arabic Kufi',
    marginBottom: 16,
    backgroundColor: '#FFF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  spaceInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#FFF',
    fontFamily: 'Droid Arabic Kufi',
  },
  buttonSelected: {
    backgroundColor: Colors.primary,
  },
  checkboxContainer: {
    backgroundColor: '#FFF',
    borderWidth: 0,
    padding: 0,
    margin: 0,
  },
  checkboxText: {
    fontFamily: 'Droid Arabic Kufi',
    color: '#333',
  },
  item: {
    fontSize: 16,
    fontFamily: 'Droid Arabic Kufi',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
    submitButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  submitButtonText: {
    fontFamily: 'DroidArabicKufi',
    color: 'white',
  },
});

export default Filter;
