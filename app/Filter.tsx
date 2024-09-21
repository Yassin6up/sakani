import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Pressable } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { router, useLocalSearchParams } from 'expo-router';
import Colors from '@/constants/Colors'; // Assuming you have defined Colors
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import { setPlaces, setFilter } from '@/store/slices/posts';
import { useTranslation } from 'react-i18next';



const Filter = () => {
  const { t, i18n } = useTranslation();

  // Check if the current language is Arabic
  const isArabic = i18n.language === 'ar';


  const featureData = isArabic ? {
    'فيلا / منزل': ["مفروشة", "مصعد", "شقة طابقية", "بلكونة", "حديقة", "مطبخ راكب", "صالون", "غرفة غسيل", "غرفة تخزين", "تكيف", "حماية نوافذ", "نظام شمسي", "حارس", "خزانة حائط", "أجهزة كهربائية", "ديكور", "نوافذ زجاجية مزدوجة", "نظام حماية", "فيها مسبح"],
    مزرعة: ["المياه واصلة", "الكهرباء واصلة", "المجاري واصلة", "حارس مزرعة", "منطقة شواء", "منطقة لعب أطفال", "غرفة الحارس", "إنترنت واي فاي", "الطاقة الشمسية", "منظر بانورامي", "منعزلة عن السكان", "نظام صوتي", "فيها مسبح"],
    ارض: ["المياه واصلة", "الكهرباء واصلة", "المجاري واصلة", "مسيجة", "تقع داخل مجمع فيلات", "منظر بانورامي", "مطلّة على الشارع"],
    شقة: ["مصعد", "مفروشة", "بلكونة", "مطبخ راكب", "حماية نوافذ", "شقة طابقية", "نوافذ زجاجية مزدوجة", "ديكور", "خزانة حائط"],
    'مكاتب وعيادات': ["مصعد", "مفروشة", "بلكونة", "حماية نوافذ", "نوافذ زجاجية مزدوجة", "ديكور", "خزانة حائط", "موقف سيارة"],
    شليهات: ["مفروشة", "مصعد", "شقة طابقية", "بلكونة", "حديقة", "مطبخ راكب", "صالون", "غرفة غسيل", "غرفة تخزين", "تكيف", "حماية نوافذ", "نظام شمسي", "حارس", "خزانة حائط", "أجهزة كهربائية", "ديكور", "نوافذ زجاجية مزدوجة", "نظام حماية", "فيها مسبح"],
    'محلات ومخازن': ["امام شارع", "مجهز", "فيه حمام", "باب اوتوماتيكي"],
    استوديو: ["مفروش", "مجهز", "فيه حمام", "مطبخ صغير", "موقع مركزي"],
    مسابح: ["مياه دافئة", "محيط مغطى", "إضاءة ليلية", "مناطق استراحة", "مرافق شاملة", "منزلقات مائية", "حراسة أمنية", "مساحة واسعة", "خدمات تنظيف دورية", "مظلات شمسية"],
    'صالات رياضة': ["أجهزة حديثة", "مدربين معتمدين", "دروس لياقة جماعية", "مرافق نظيفة", "مساحة واسعة", "أوقات عمل مرنة", "غرف تبديل ملابس", "مواقف سيارات", "منطقة استرخاء", "مناشف متاحة"],
    'مخيمات و اكواخ': ["موقع هادئ", "إطلالة طبيعية", "مرافق شواء", "منطقة جلوس خارجية", "إضاءة ليلية", "خدمات تنظيف", "حمامات مشتركة", "أماكن مخصصة للنار", "مرافق رياضية", "مساحة واسعة"],
    "قاعات اجتماعات": ["أجهزة عرض", "اتصال واي فاي سريع", "أنظمة صوت", "مقاعد مريحة", "إضاءة قابلة للتعديل", "تجهيزات تقديم الطعام", "سبورات بيضاء", "أجهزة تحكم عن بعد", "تصميم عصري", "مرافق لتبديل الملابس"],
    'تنضيم رحلات': ["خطط سفر مخصصة", "إرشادات سياحية", "حجوزات فنادق", "تنظيم جولات", "خدمات نقل", "إرشادات محلية", "تأمين سفر", "أنشطة ترفيهية", "توجيهات طعام", "دعم فوري"],
    "ملاعب": ["أرضية ملائمة", "إضاءة قوية", "مرافق للشرب", "خدمات صيانة", "مدرجات للمتفرجين", "مساحات تغيير الملابس", "مرافق صحية", "أمن مستمر", "مناطق استراحة", "تجهيزات رياضية"]
  } : {
    'فيلا / منزل': ["Furnished", "Elevator", "Floor Apartment", "Balcony", "Garden", "Fitted Kitchen", "Living Room", "Laundry Room", "Storage Room", "AC", "Window Protection", "Solar System", "Guard", "Wall Closet", "Electric Appliances", "Decoration", "Double Glazed Windows", "Security System", "Pool"],
    مزرعة: ["Water Connected", "Electricity Connected", "Sewage Connected", "Farm Guard", "BBQ Area", "Kids Play Area", "Guard Room", "WiFi Internet", "Solar Power", "Panoramic View", "Isolated from Neighbors", "Sound System", "Pool"],
    ارض: ["Water Connected", "Electricity Connected", "Sewage Connected", "Fenced", "Located in Villa Complex", "Panoramic View", "Street Facing"],
    شقة: ["Elevator", "Furnished", "Balcony", "Fitted Kitchen", "Window Protection", "Floor Apartment", "Double Glazed Windows", "Decoration", "Wall Closet"],
    'مكاتب وعيادات': ["Elevator", "Furnished", "Balcony", "Window Protection", "Double Glazed Windows", "Decoration", "Wall Closet", "Car Parking"],
    شليهات: ["Furnished", "Elevator", "Floor Apartment", "Balcony", "Garden", "Fitted Kitchen", "Living Room", "Laundry Room", "Storage Room", "AC", "Window Protection", "Solar System", "Guard", "Wall Closet", "Electric Appliances", "Decoration", "Double Glazed Windows", "Security System", "Pool"],
    'محلات ومخازن': ["Street Facing", "Fitted", "Bathroom", "Automatic Door"],
    استوديو: ["Furnished", "Fitted", "Bathroom", "Small Kitchen", "Central Location"],
    مسابح: ["Heated Water", "Covered Surroundings", "Night Lighting", "Rest Areas", "Comprehensive Facilities", "Water Slides", "Security Guards", "Spacious", "Regular Cleaning", "Sun Umbrellas"],
    'صالات رياضة': ["Modern Equipment", "Certified Trainers", "Group Fitness Classes", "Clean Facilities", "Spacious", "Flexible Hours", "Changing Rooms", "Parking", "Relaxation Area", "Towels Available"],
    'مخيمات و اكواخ': ["Quiet Location", "Natural View", "BBQ Facilities", "Outdoor Seating", "Night Lighting", "Cleaning Services", "Shared Bathrooms", "Fire Pits", "Sports Facilities", "Spacious"],
    "قاعات اجتماعات": ["Projectors", "Fast WiFi", "Sound Systems", "Comfortable Seats", "Adjustable Lighting", "Catering Equipment", "Whiteboards", "Remote Controllers", "Modern Design", "Changing Facilities"],
    'تنضيم رحلات': ["Custom Travel Plans", "Tourist Guidance", "Hotel Reservations", "Tour Organization", "Transport Services", "Local Guidance", "Travel Insurance", "Recreational Activities", "Food Recommendations", "Immediate Support"],
    "ملاعب": ["Suitable Flooring", "Bright Lighting", "Drinking Facilities", "Maintenance Services", "Spectator Stands", "Changing Rooms", "Restrooms", "Continuous Security", "Rest Areas", "Sports Equipment"]
  };
  
  

  const { type } = useLocalSearchParams();
  const dispatch = useDispatch();
  const places = useSelector(state => state.places.value.places);
  const isFilter = useSelector(state => state.places.value.isFilter);

  const [location, setLocation] = useState('');
  const [street, setStreet] = useState('');
  const [title, setTitle] = useState('');
  const [minPrice, setMinPrice] = useState('0');
  const [maxPrice, setMaxPrice] = useState('999');
  const [minSpace, setMinSpace] = useState('');
  const [maxSpace, setMaxSpace] = useState('');
  const [homeType, setHomeRoom] = useState('');
  const [stage, setHomeStage] = useState('');

  const [features, setFeatures] = useState({});
  const [negotiation, setNegotiation] = useState('');
  const [roomMettingType, setRoomMeetingType] = useState('');
  const [membersCount, setMemebrsCount] = useState('');
  const [gymType, setGymType] = useState('');


  useEffect(() => {
    // Load saved filter data from SecureStore when component mounts
    const loadSavedFilters = async () => {
      try {
        const savedFilters = await SecureStore.getItemAsync('filterData');
        if (savedFilters) {
          const parsedFilters = JSON.parse(savedFilters);
          setLocation(parsedFilters.location || '');
          setStreet(parsedFilters.street || '');
          setTitle(parsedFilters.title || '');
          setMinPrice(parsedFilters.minPrice || '0');
          setMaxPrice(parsedFilters.maxPrice || '999');
          setMinSpace(parsedFilters.minSpace || '');
          setMaxSpace(parsedFilters.maxSpace || '');
          setHomeStage(parsedFilters.stage || '');
          setHomeRoom(parsedFilters.homeType || '');
          setFeatures(parsedFilters.features || {});
          setNegotiation(parsedFilters.negotiation || '');
          setRoomMeetingType(parsedFilters.roomMettingType || '');
          setMemebrsCount(parsedFilters.membersCount || '');
          setGymType(parsedFilters.gymType || '')

        }
      } catch (error) {
        console.error('Error loading filters:', error);
      }
    };

   
    // loadSavedFilters();
         
    const deleteSaveData = async()=>{
      await SecureStore.deleteItemAsync("filterData")

    }

    if(isFilter){
      loadSavedFilters();
    }else{
      deleteSaveData() ;
    }
  }, []);

  const handleFeatureChange = (feature) => {
    setFeatures({ ...features, [feature]: !features[feature] });
  };

  const handleNegotiationChange = (option) => {
    setNegotiation(option);
  };

  const onSubmit = async (dataForFilter) => {
    const filteredData = Object.fromEntries(
      Object.entries(dataForFilter).filter(([_, value]) => value !== undefined && value !== '')
    );
    console.log(filteredData)

    const parseAmenities = (str) => {
      try {
        let parseData = JSON.parse(str);
        return parseData;
      } catch (error) {
        console.error('Error parsing amenities:', error);
        return [];
      }
    };

    try {
      let filteredPlaces = places;
      let features = [];
      if (filteredData.features) {
        features = Object.keys(filteredData.features).filter(key => filteredData.features[key] === true);
      }
      filteredPlaces = filteredPlaces.filter(place => {
        const matchesLocation = filteredData.location ? place.address.includes(filteredData.location) : true;
        const matchesStreet = filteredData.street ? place.address.includes(filteredData.street) : true;
        const matchesTitle = filteredData.title ? place.title.includes(filteredData.title) : true;
        const price = parseFloat(place.price);
        const matchesPrice = (!filteredData.minPrice || price >= parseFloat(filteredData.minPrice)) &&
                            (!filteredData.maxPrice || price <= parseFloat(filteredData.maxPrice));
        const space = parseFloat(place.space_general);
        const matchesSpace = (!filteredData.minSpace || space >= parseFloat(filteredData.minSpace)) &&
                            (!filteredData.maxSpace || space <= parseFloat(filteredData.maxSpace));
        const matchesHomeType = filteredData.homeType ? place.home_type === filteredData.homeType : true;
        let amenities = [];
        if (place.amenities) {
          amenities = parseAmenities(place.amenities);
        }
        const matchesFeatures = features.length === 0 || features.every(feature => amenities.includes(feature));
        const matchesNegotiation = filteredData.negotiation ? place.ads_accept === filteredData.negotiation : true;
        const matchesRoomType =  filteredData.roomMettingType ?  place.meetingRoomType ===  filteredData.roomMettingType : true ;
        const matchesMemberCount = filteredData.membersCount ? place.countPeople ===  filteredData.membersCount : true ;
        
        const gymType = filteredData.gymType ? place.poolType === filteredData.gymType : true
        return matchesLocation && matchesStreet && matchesTitle && matchesPrice && matchesSpace && matchesHomeType && matchesFeatures && matchesNegotiation && matchesRoomType && matchesMemberCount && gymType    ;
      });


      
      dispatch(setPlaces(filteredPlaces));
      router.navigate("/(tabs)");
      SecureStore.setItem('filterData', JSON.stringify(filteredData));  // Save filter data
      SecureStore.setItem("places" , JSON.stringify(filteredPlaces))
      dispatch(setFilter(true))
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
      roomMettingType ,
      membersCount , 
      gymType
    };
    onSubmit(filters);
  };

  const handleReset = async () => {
    setLocation('');
    setStreet('');
    setTitle('');
    setMinPrice('0');
    setMaxPrice('999');
    setMinSpace('');
    setMaxSpace('');
    setHomeRoom('');
    setHomeStage("");
    setFeatures({});
    setNegotiation('');
    setRoomMeetingType("");
    setMemebrsCount("")
    setGymType("")
    
    await SecureStore.deleteItemAsync("filterData")
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>{t("title")}</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="أدخل العنوان"
      />
      <Text style={styles.label}>{t("minPrice")}</Text>
      <TextInput
        style={styles.input}
        value={minPrice}
        onChangeText={setMinPrice}
        placeholder="أدخل أقل سعر"
        keyboardType="numeric"
      />
      <Text style={styles.label}>{t("maxPrice")}</Text>
      <TextInput
        style={styles.input}
        value={maxPrice}
        onChangeText={setMaxPrice}
        placeholder="أدخل أعلى سعر"
        keyboardType="numeric"
      />
      <Text style={styles.label}>{t(type)}</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.spaceInput]}
          value={minSpace}
          onChangeText={setMinSpace}
          placeholder={t("minSpace")}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.spaceInput]}
          value={maxSpace}
          onChangeText={setMaxSpace}
          placeholder={t("maxSpace")}
          keyboardType="numeric"
        />
      </View>
      {type === 'شقة' && (
        <>
          <Text style={styles.label}> {t("roomsCount")}</Text>
          <TextInput
            style={styles.input}
            value={homeType}
            onChangeText={setHomeRoom}
            keyboardType="numeric"
          />
          <Text style={styles.label}> {t("numberOfStages")}</Text>
          <TextInput
            style={styles.input}
            value={stage}
            onChangeText={setHomeStage}
            keyboardType="numeric"
          />
        </>
      )}
      <Text style={styles.label}>{t("Features")}</Text>
      {featureData[type]?.map((feature, index) => (
        <CheckBox
          key={index}
          title={feature}
          checked={features[feature] || false}
          onPress={() => handleFeatureChange(feature)}
        />
      ))}

      {
        type ==  "قاعات اجتماعات"? 
        <>
        <Text style={styles.label}>{t("meetingRoomType")}</Text>
        <View style={{...styles.row , flexWrap : "wrap" , justifyContent : "flex-start"}}>
          <CheckBox
            title="غرفة على شكل U"
            checked={roomMettingType === "غرفة على شكل U"}
            onPress={() => setRoomMeetingType("غرفة على شكل U")}
          />
          <CheckBox
            title="مسرح"
            checked={roomMettingType === 'مسرح'}
            onPress={() => setRoomMeetingType('مسرح')}
          />
          <CheckBox
            title="قاعة درس"
            checked={roomMettingType === "قاعة درس"}
            onPress={() => setRoomMeetingType("قاعة درس")}
          />
          <CheckBox
            title="مكان للعمل الجماعي"
            checked={roomMettingType === "مكان للعمل الجماعي"}
            onPress={() => setRoomMeetingType("مكان للعمل الجماعي")}
          />
          <CheckBox
            title="بيانات"
            checked={roomMettingType === 'بيانات'}
            onPress={() => setRoomMeetingType('بيانات')}
          />
        </View>
        </>
        :
        null
      }


{
   type ==  'صالات رياضة' ? 
  <>
      <Text style={styles.label}>  {t("gymType")} </Text>
      <View style={styles.row}>
        <CheckBox
          title={t("women")}
          checked={gymType === 'نسائي'}
          onPress={() => setGymType('نسائي')}
        />
        <CheckBox
          title={t("men")}
          checked={gymType === 'رجالي'}
          onPress={() => setGymType('رجالي')}
        />
      </View>
      </>
    :
   null
}
{
        type == "قاعات اجتماعات" ?

<>
        <Text style={styles.label}>{t("countPeople")}</Text>
        <TextInput
          style={styles.input}
          value={membersCount}
          keyboardType='numeric'
          onChangeText={setMemebrsCount}
        />
</>
        :
      <>
      <Text style={styles.label}>  {t("accetedAds")} </Text>
      <View style={styles.row}>
        <CheckBox
          title={t("yes")}
          checked={negotiation === 'نعم'}
          onPress={() => handleNegotiationChange('نعم')}
        />
        <CheckBox
          title={t("no")}
          checked={negotiation === 'لا'}
          onPress={() => handleNegotiationChange('لا')}
        />
      </View>
      </>
      }
      

      
      <View style={styles.buttonContainer}>
        <Button title={t('back')} onPress={() => router.back()} color={Colors.secondary} />
                 <View>
         <Pressable onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>{t("filterSubmit")}</Text>
         </Pressable>
         <Pressable style={{marginTop : 10}} onPress={handleReset} >
             <Text  style={{fontFamily : "droidAr"}}> {t("resetFilter")}</Text>
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
