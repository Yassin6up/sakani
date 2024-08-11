import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect , useState ,useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Share , Linking } from 'react-native';
import listingsData from '@/assets/data/airbnb-listings.json';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Animated, {
  SlideInDown,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import { defaultStyles } from '@/constants/Styles';
import axios from "axios"
const { width } = Dimensions.get('window');
const IMG_HEIGHT = 300;
import * as SecureStore from 'expo-secure-store';
import CustomAlert from '@/components/Alert';
import ReservationModal from './../../components/ResirvationModal';
import Swiper from 'react-native-swiper';
import { useTranslation } from "react-i18next";

const DetailsPage = () => {
  const { t, i18n } = useTranslation();

  const { id } = useLocalSearchParams();
  // const listing = (listingsData as any[]).find((item) => item.id === id);
const [listing , setListing] = useState(null)
const [placeId , setPlaceId] = useState("")
const [pricesDays , setPricesDays] = useState({})
const [notAllowedDays , setNotAllowedDays] = useState([])

const [RoomsCounting  , setRoomCounting] = useState({})
const [liked , setLike] = useState(false) 
const [isAlertShown  ,setAlertShown] = useState(false)



useEffect(() => {
  const getPlaceById = async (id) => {
    const userId = await SecureStore.getItemAsync('userId');
    try {
      const response = await axios.get(`https://backend.sakanijo.com/api/places/${id}?user_id=${userId}`);
      setListing(response.data);
      console.log("listign data :",response.data)
      setPlaceId(response.data.id);
    } catch (error) {
      console.error('Error fetching place:', error);
    }
  };

  if (id) {
    getPlaceById(id);
  }
}, [id]);



  const navigation = useNavigation();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const shareListing = async () => {
    try {
      await Share.share({
        title: listing?.title,
        message :  "لقد شاركت معك اعلان من سكني جو  " +  `https://sakanijo.com/place/${id}`,
        url: `https://sakanijo.com/place/${id}`,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (listing?.number_of_rooms) {
      try {
        // Parsing notAllowedDays if it exists
        if (listing?.notAllowedDays) {
          let daysBlocked = JSON.parse(listing.notAllowedDays);
          daysBlocked = JSON.parse(daysBlocked)
          console.log('=============================================');
          console.log('daysBlocked : ', daysBlocked);
          console.log('=============================================');
          setNotAllowedDays(daysBlocked);
        } else {
          console.log('notAllowedDays is not available or is null/undefined.');
        }
  
        // Parsing number_of_rooms
        let numberOfRoomsObject = JSON.parse(listing.number_of_rooms);
        numberOfRoomsObject = JSON.parse(numberOfRoomsObject)
        setRoomCounting(numberOfRoomsObject);

        console.log("RoomsCounting:", numberOfRoomsObject);
  
        // Parsing variable_prices if it exists
        if (listing?.variable_prices) {
          let variablePrices = JSON.parse(listing.variable_prices);
          variablePrices = JSON.parse(variablePrices);
          setPricesDays(variablePrices);
        } else {
          console.log('variable_prices is not available or is null/undefined.');
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.log('number_of_rooms is not available or is null/undefined.');
    }
  
    setLike(listing?.liked === 1);
    console.log("state liked", listing?.liked);
  }, [listing]);
  



  const onsubmitRejester = async ({ totalPrice, dateSelected }) => {
    console.log('total price:', totalPrice);
  
    // Find the earliest and latest dates in the dateSelected array
    const sortedDates = dateSelected.sort((a, b) => new Date(a) - new Date(b));
    const checkIn = sortedDates[0];
    const checkOut = sortedDates[sortedDates.length - 1];
    let result = await SecureStore.getItemAsync('userId');


    console.log('checkIn:', checkIn);
    console.log('checkOut:', checkOut);
    console.log('listingId:', listing?.id);
    console.log('customer Id:', result);
    


  
  
    try {
      console.log("start sending data" , 
        {
          checkIn: checkIn,
          checkOut: checkOut,
          place: listing?.id,
          price: totalPrice,
          resirvedDays : JSON.stringify(dateSelected) ,
          costumerId: result,
        }
      )
      const response = await axios.post('https://backend.sakanijo.com/api/bookings/add', {
        checkIn: checkIn,
        checkOut: checkOut,
        place: listing?.id,
        price: totalPrice,
        resirvedDays : JSON.stringify(dateSelected) ,
        costumerId: result,
      });
  
      if (response.status === 200) {
        console.log('Data posted successfully:', response.data);

        setAlertShown(true)
        toggleModal()
      } else {
        console.log('Failed to post data:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };


  useEffect(() => {
    let timer;
    if (isAlertShown) {
      timer = setTimeout(() => {
        setAlertShown(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isAlertShown]);




  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerTransparent: true,

      headerBackground: () => (
        <Animated.View style={[headerAnimatedStyle, styles.header]}></Animated.View>
      ),
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
            <Ionicons name="share-outline" size={22} color={'#000'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundButton} onPress={()=>handleLike()}>

            {
              liked ? 
              <Ionicons name="heart" size={22} color={Colors.primary} />
              :
              <Ionicons name="heart-outline" size={22} color={'#000'} />
            }
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity style={styles.roundButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={'#000'} />
        </TouchableOpacity>
      ),
    });
  }, [liked]);

  const scrollOffset = useScrollViewOffset(scrollRef);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
    };
  }, []);

  const photos = listing?.photos?.split(',');

const [amenities , setAmenities] = useState([])


useEffect(() => {
  if (listing?.amenities) {
    try {
      // Assume listing.amenities is a JSON string
      let jsonString = listing.amenities;

      if (typeof jsonString === 'string' && jsonString.trim() !== '') {
        // Remove extra escaping, quotes, and brackets
        jsonString = jsonString
          .replace(/\\\"/g, '"') // Unescape quotes
          .replace(/\\u[\dA-Fa-f]{4}/g, '') // Remove Unicode escapes
          .replace(/[\[\]"]/g, '') // Remove all brackets and quotes
          .trim()  ;  

        // Split the string by comma
        const basicArray = jsonString.split(',')
          .map(item => item.trim()); // Trim each item

        setAmenities(basicArray);
        console.log("amenities:", basicArray);
      } else {
        console.error("Invalid JSON string");
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }
}, [listing]);






  // let feutureData = amenities?.split(",")






  const handleLike = async () => {
    let result = await SecureStore.getItemAsync("userId");

    console.log("listing id : ",placeId)


    if(id){
      console.log(listing)

      console.log("listing id  :" , id)

    try {
      const response = await axios.post('https://backend.sakanijo.com/like', {
        user_id: result,
        place_id: id
      });

      if (response.status === 200) {
        console.log(response.data)
        if(response.data.message == "Like removed successfully and heartSave updated"){
          setLike(false)
        }else{
          setLike(true)
        }
        
        // Alert.alert('Like added successfully!');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('You have already liked this place.');
      } else {
        console.log('An error occurred. Please try again later.');
      }
    }
  }
  };

  const [isModalVisible, setModalVisible] = useState(false);


  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };


  console.log("days",listing?.variable_prices)


  const makePhoneCall = (phoneNumber) => {
    let phoneUrl = `tel:${phoneNumber}`;
    Linking.openURL(phoneUrl)
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
  
    // Extract date and time components
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
  
    // Format as 'HH:mm dd-MM-yyyy'
    return `${hours}:${minutes} ${day}-${month}-${year}`;
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        ref={scrollRef}
        scrollEventThrottle={16}>
        {photos?.length > 0 ? (
              <Swiper
                style={{height : IMG_HEIGHT}}
                showsButtons={false}
                loop={false}
                // dotColor={Colors.primary}
                activeDotColor={Colors.primary}
              >
                {photos.map((photo, index) => (
                    <Image
                      source={{ uri: `https://backend.sakanijo.com/api/images/${encodeURIComponent(listing.folderName)}/${encodeURIComponent(photo)}` }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                ))}
              </Swiper>
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text>No Image</Text>
              </View>
            )}

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{listing?.title}</Text>
          <Text style={styles.location}>
            {listing?.buy_or_rent} {t("in")} {listing?.address}
          </Text>
          {listing?.home_type === "فيلا / منزل" ? (
        <Text style={styles.rooms}>
          {RoomsCounting?.stages} {t("stage")}· {RoomsCounting?.bathroom} {t("bathrooms")} · {RoomsCounting?.kitchen}  {t("kitchen")} · {RoomsCounting?.rooms} {t("rooms")}
        </Text>
      ) : null}
      {listing?.home_type === "شقة" ? (
        <Text style={styles.rooms}>
          {RoomsCounting?.bathroom} {t("bathrooms")} · {RoomsCounting?.kitchen}  {t("kitchen")} · {RoomsCounting?.rooms} {t("rooms")}
        </Text>
      ) : null}
          
          <View style={{ flexDirection: 'row', gap: 4  , alignItems : "center"}}>
            <Ionicons name="" size={16} />
            <Text style={styles.ratings}>
            {listing?.space_general }m²
            </Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 4  , alignItems : "center"}}>
            <Ionicons name="heart" size={16} />
            <Text style={styles.ratings}>
            الاعجابات {t("likes")} | {listing?.heartSave }
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.hostView}>
            <Image source={require("@/assets/images/publisherUsers/2.png")} style={styles.host} />

            <View>
              <Text style={{ fontWeight: 500, fontSize: 16 , fontFamily : "droidAr" }}>  {t("created_from")} {listing?.ownerName}</Text>
              <Text style={{fontFamily : "droidAr"}}>{t("inDate")}  {formatDate(listing?.date)} </Text>
            </View>
          </View>

          <View style={styles.divider} />

<View style={{display  : "flex" , flexDirection : "row" , flexWrap : "wrap" , width : "100%" , gap :10}}>

{
  amenities?.map((amenite)=>{
    return(
          <View  key={amenite} style={{backgroundColor : "#eee" , paddingHorizontal : 10  , paddingVertical:5,  borderRadius: 10 ,  justifyContent:"center" , alignItems : "center"}}>
            <Text  style={{fontFamily:"droidAr" , textAlign:'center' }}>  {amenite}</Text>
          </View>
    )
  })
}


          

          </View>
          <View style={styles.divider} />
          <Text style={styles.description}>{listing?.description}</Text>
        </View>
      </Animated.ScrollView>

      <Animated.View style={defaultStyles.footer} entering={SlideInDown.delay(200)}>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity style={[defaultStyles.btn, { paddingRight: 20, paddingLeft: 20 ,  backgroundColor : "green"
          }]}
          onPress={()=>{
            router.navigate("BookCar")
          }}
          >

            <Text style={{...defaultStyles.btnText , fontFamily : "droidAr"}} >  {t("bookCar")}  </Text>
            
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.footerText}>
                {
                  listing?.priceHide == 0 ?
                  <Text style={{ fontFamily: 'droidAr' }}>JOD {listing?.price}</Text>
                  :
                  <Text style={{ fontFamily: 'droidAr' }}> {t("hiddenPrice")} </Text>
                }
              
            {
              listing?.buy_or_rent == "الحجز" ?
              <Text>{t("night")}</Text>
              :
              null
            }
            
          </TouchableOpacity>

          <TouchableOpacity style={[defaultStyles.btn, { paddingRight: 20, paddingLeft: 20 }]} onPress={()=>{
            if(listing?.buy_or_rent == "الحجز"){
              setModalVisible(true)
            }else{
              makePhoneCall(listing?.ownerPhone)
            }

          }}>
            <Text style={{...defaultStyles.btnText , fontFamily : "droidAr"}} >
            {
              listing?.buy_or_rent == "الحجز" ?
              t("bookNow")
              :
              t("callNow")
            }
              </Text>
          </TouchableOpacity>
        </View>

        <ReservationModal
          visible={isModalVisible}
          onClose={toggleModal}
          specifiedDates={listing?.specificDaysInCalendar}
          weekDaysObject = {pricesDays}
          priceNormal = {listing?.price}
          ismultiSelect = { listing?.hajez_type === "24ساعة"  ? true : false}
          priceforSpecificDays  = {listing?.calanderDaysPrice}
          onSubmit={onsubmitRejester}
          notAllowedDays={notAllowedDays}
        />
      </Animated.View>


<CustomAlert
icon={"check"}
message={t("thnksMsg")}
visible={isAlertShown}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    height: IMG_HEIGHT,
    width: width,
  },
  infoContainer: {
    padding: 24,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'droidAr',     
  },
  location: {
    fontSize: 18,
    marginTop: 10,
    fontFamily: 'droidAr',
  },
  rooms: {
    fontSize: 16,
    color: Colors.grey,
    marginVertical: 4,
    fontFamily: 'droidAr',
  },
  ratings: {
    fontSize: 16,
    fontFamily: 'droidAr',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.grey,
    marginVertical: 16,
  },
  host: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: Colors.grey,
  },
  hostView: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent : "flex-start", 
    
    gap: 12,
  },
  footerText: {
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerPrice: {
    fontSize: 18,
    fontFamily: 'droidAr',
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.primary,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  header: {
    backgroundColor: '#fff',
    height: 100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
  },

  description: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: 'droidAr',
  },
});

export default DetailsPage;
