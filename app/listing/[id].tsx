import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Share,
  Platform,
  Linking,
  Pressable,
} from "react-native";
import listingsData from "@/assets/data/airbnb-listings.json";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Animated, {
  SlideInDown,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import DraggableView from "@/components/WtsButton";
import { defaultStyles } from "@/constants/Styles";
const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import CustomAlert from "@/components/Alert";
import ReservationModal from "./../../components/ResirvationModal";
import Swiper from "react-native-swiper";
import { useTranslation } from "react-i18next";
import moment from "moment";
import "moment/locale/ar"; // Import the Arabic locale
import ResirvationTime from "@/components/ResirvationModalTime";
import GymBookingModal from "@/components/BookingGymModal";
import TripBookingModal from "@/components/TripBookingModal";
const DetailsPage = () => {
  const { t, i18n } = useTranslation();

  const { id } = useLocalSearchParams();
  // const listing = (listingsData as any[]).find((item) => item.id === id);
  const [listing, setListing] = useState(null);
  const [placeId, setPlaceId] = useState("");
  const [pricesDays, setPricesDays] = useState({});
  const [notAllowedDays, setNotAllowedDays] = useState([]);

  const [RoomsCounting, setRoomCounting] = useState({});
  const [liked, setLike] = useState(false);
  const [isAlertShown, setAlertShown] = useState(false);
  const token = SecureStore.getItem("token")

  useEffect(() => {
    const getPlaceById = async (id) => {
      const userId = await SecureStore.getItemAsync("userId");
      try {
        const response = await axios.get(
          `https://backend.sakanijo.com/api/places/${id}?user_id=${userId}`
        );
        setListing(response.data);
        console.log("listign data :", response.data);
        setPlaceId(response.data.id);
      } catch (error) {
        console.error("Error fetching place:", error);
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
        message:
          "لقد شاركت معك اعلان من سكني جو  " +
          `https://place.sakanijo.com/place?id=${id}`,
        url: `https://place.sakanijo.com/place?id=${id}`,
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
          daysBlocked = JSON.parse(daysBlocked);
          console.log("=============================================");
          console.log("daysBlocked : ", daysBlocked);
          console.log("=============================================");
          setNotAllowedDays(daysBlocked);
        } else {
          console.log("notAllowedDays is not available or is null/undefined.");
        }

        // Parsing number_of_rooms
        let numberOfRoomsObject = JSON.parse(listing.number_of_rooms);
        numberOfRoomsObject = JSON.parse(numberOfRoomsObject);
        setRoomCounting(numberOfRoomsObject);

        console.log("RoomsCounting:", numberOfRoomsObject);

        // Parsing variable_prices if it exists
        if (listing?.variable_prices) {
          let variablePrices = JSON.parse(listing.variable_prices);
          variablePrices = JSON.parse(variablePrices);
          setPricesDays(variablePrices);
        } else {
          console.log("variable_prices is not available or is null/undefined.");
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.log("number_of_rooms is not available or is null/undefined.");
    }

    setLike(listing?.liked === 1);
    console.log("state liked", listing?.liked);
  }, [listing]);

  const onsubmitRejester = async ({ totalPrice, dateSelected, period }) => {



    if(!token){
      return router.navigate("/login") ;
    }
    console.log("total price:", totalPrice);

    // Find the earliest and latest dates in the dateSelected array
    const sortedDates = dateSelected.sort((a, b) => new Date(a) - new Date(b));
    const checkIn = sortedDates[0];
    const checkOut = sortedDates[sortedDates.length - 1];
    let result = await SecureStore.getItemAsync("userId");

    console.log("checkIn:", checkIn);
    console.log("checkOut:", checkOut);
    console.log("listingId:", listing?.id);
    console.log("customer Id:", result);

    try {
      console.log("start sending data", {
        checkIn: checkIn,
        checkOut: checkOut,
        place: listing?.id,
        price: totalPrice,
        resirvedDays: JSON.stringify(dateSelected),
        costumerId: result,
      });
      const response = await axios.post(
        "https://backend.sakanijo.com/api/bookings/add",
        {
          checkIn: checkIn,
          checkOut: checkOut,
          place: listing?.id,
          price: totalPrice,
          resirvedDays: JSON.stringify(dateSelected),
          costumerId: result,
        }
      );

      if (response.status === 200) {
        console.log("Data posted successfully:", response.data);

        let text;

        if (period === "Night Only") {
          text = `اريد حجز هدا الاعلان :  ${listing?.title} 
          
          حجز ليلة واحدة

          تاريخ الحجز : 
          ${checkIn}
          
          رابط الاعلان : 
          https://place.sakanijo.com/place?id=${listing?.id}
          `;
        } else if (period === "Day Only") {
          text = `اريد حجز هدا الاعلان :  ${listing?.title} 
          
          حجز يوم واحد 

          تاريخ الحجز : 
          ${checkIn}
          
          رابط الاعلان : 
          https://place.sakanijo.com/place?id=${listing?.id}
          `;
        } else {
          text = `اريد حجز هدا الاعلان :  ${listing?.title} 
          
          فترة الحجز : 

          من : ${checkIn}
          الي: ${checkOut}
          
          رابط الاعلان : 
          https://place.sakanijo.com/place?id=${listing?.id}
          `;
        }

        if (listing?.gettingCalls === "whatsapp") {
          sendWhatsApp(listing?.ownerPhone, text);
        } else {
          sendSMS(listing?.ownerPhone, text);
        }

        setAlertShown(true);
        toggleModal();
      } else {
        console.log(
          "Failed to post data:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const onsubmitGYM = async ({ price, subscription }) => {
    // Find the earliest and latest dates in the dateSelected array
    if(!token){
      return router.navigate("/login") ;
    }

    const date = new Date();
    const checkIn = date.getFullYear();
    const checkOut = date.getFullYear();
    let result = await SecureStore.getItemAsync("userId");

    console.log("checkIn:", checkIn);
    console.log("checkOut:", checkOut);
    console.log("listingId:", listing?.id);
    console.log("customer Id:", result);
    console.log("subscription:", subscription);
    console.log("price:", price);

    try {
      const response = await axios.post(
        "https://backend.sakanijo.com/api/bookings/add",
        {
          checkIn: checkIn,
          checkOut: checkOut,
          place: listing?.id,
          price: price,
          resirvedDays: subscription,
          costumerId: result,
        }
      );

      if (response.status === 200) {
        console.log("Data posted successfully:", response.data);

        let text = `اريد حجز هدا الاعلان :  ${listing?.title} 
          
          فترة الحجز : 
          ${subscription}
          
          
          رابط الاعلان : 
          https://place.sakanijo.com/place?id=${listing?.id}
          `;

        if (listing?.gettingCalls === "whatsapp") {
          sendWhatsApp(listing?.ownerPhone, text);
        } else {
          sendSMS(listing?.ownerPhone, text);
        }

        setAlertShown(true);
        modalInVisible();
      } else {
        console.log(
          "Failed to post data:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const onsubmitTrip = async () => {
    if(!token){
      return router.navigate("/login") ;
    }

    let result = await SecureStore.getItemAsync("userId");

    try {
      const response = await axios.post(
        "https://backend.sakanijo.com/api/bookings/add",
        {
          checkIn: listing?.tripDate,
          checkOut: listing?.tripDate,
          place: listing?.id,
          price: listing?.price,
          resirvedDays: listing?.tripLong,
          costumerId: result,
        }
      );

      if (response.status === 200) {
        console.log("Data posted successfully:", response.data);

        let text = `اريد حجز هدا الاعلان :  ${listing?.title} 
          
          مدة الرحلة : 
          ${t(listing?.tripLong)}

          بتاريخ :
          ${listing?.tripDate}
          
          رابط الاعلان : 
          https://place.sakanijo.com/place?id=${listing?.id}
          `;

        if (listing?.gettingCalls === "whatsapp") {
          sendWhatsApp(listing?.ownerPhone, text);
        } else {
          sendSMS(listing?.ownerPhone, text);
        }

        setAlertShown(true);
        modalTripInvisibleVisible();
      } else {
        console.log(
          "Failed to post data:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error posting data:", error);
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
      headerTitle: "",
      headerTransparent: true,

      headerBackground: () => (
        <Animated.View
          style={[headerAnimatedStyle, styles.header]}></Animated.View>
      ),
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
            <Ionicons name="share-outline" size={22} color={"#000"} />
          </TouchableOpacity>
          {!token ?  null : 
          <TouchableOpacity
          style={styles.roundButton}
          onPress={() => handleLike()}>
          {liked ? (
            <Ionicons name="heart" size={22} color={Colors.heart} />
          ) : (
            <Ionicons name="heart-outline" size={22} color={"#000"} />
          )}
        </TouchableOpacity>
          }
          
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={styles.roundButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={"#000"} />
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
          scale: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
    };
  }, []);

  const photos = listing?.photos?.split(",");

  const [amenities, setAmenities] = useState([]);

  useEffect(() => {
    if (listing?.amenities) {
      try {
        // Assume listing.amenities is a JSON string
        let jsonString = listing.amenities;

        if (typeof jsonString === "string" && jsonString.trim() !== "") {
          // Remove extra escaping, quotes, and brackets
          jsonString = jsonString
            .replace(/\\\"/g, '"') // Unescape quotes
            .replace(/\\u[\dA-Fa-f]{4}/g, "") // Remove Unicode escapes
            .replace(/[\[\]"]/g, "") // Remove all brackets and quotes
            .trim();

          // Split the string by comma
          const basicArray = jsonString.split(",").map((item) => item.trim()); // Trim each item

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

    console.log("listing id : ", placeId);

    if (id) {
      console.log(listing);

      console.log("listing id  :", id);

      try {
        const response = await axios.post("https://backend.sakanijo.com/like", {
          user_id: result,
          place_id: id,
        });

        if (response.status === 200) {
          console.log(response.data);
          if (
            response.data.message ==
            "Like removed successfully and heartSave updated"
          ) {
            setLike(false);
          } else {
            setLike(true);
          }

          // Alert.alert('Like added successfully!');
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.log("You have already liked this place.");
        } else {
          console.log("An error occurred. Please try again later.");
        }
      }
    }
  };

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  console.log("days", listing?.variable_prices);

  const makePhoneCall = (phoneNumber) => {
    if(!token){
      return router.navigate("/login") ;
    }

    let phoneUrl = `tel:${phoneNumber}`;
    Linking.openURL(phoneUrl);
  };

  const sendSMS = (phoneNumber, text = "") => {
    if(!token){
      return router.navigate("/login") ;
    }

    console.log("start sending sms");
    let smsUrl = `sms:${phoneNumber}`;
    if (Platform.OS === "ios") {
      smsUrl += `&body=${encodeURIComponent(text)}`;
    } else {
      smsUrl += `?body=${encodeURIComponent(text)}`;
    }
    Linking.openURL(smsUrl);
  };

  const sendWhatsApp = (phoneNumber, text = "") => {

    if(!token){
      return router.navigate("/login") ;
    }

    let whatsappUrl = `whatsapp://send?phone=${phoneNumber}`;
    if (text) {
      whatsappUrl += `&text=${encodeURIComponent(text)}`;
    }
    Linking.openURL(whatsappUrl).catch(() => {
      // Handle error (e.g., WhatsApp not installed)
      alert("الرجاء تاكد من ان الواتساب محمل على جهازك");
    });
  };

  
  const [modalVisible, setModal2Visible] = useState(false);

  const modalAVisible = () => {
    setModal2Visible(true);
  };

  // Function to close the modal
  const modalInVisible = () => {
    setModal2Visible(false);
  };

  const [modalTripVisibleState, setModalTripVisilbe] = useState(false);

  const modalTripVisible = () => {
    setModalTripVisilbe(true);
  };
  // Function to close the modal
  const modalTripInvisibleVisible = () => {
    setModalTripVisilbe(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Extract date and time components
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    // Format as 'HH:mm dd-MM-yyyy'
    return `${hours}:${minutes} ${day}-${month}-${year}`;
  };
  moment.locale("ar");

  console.log("home type :", listing?.homeType);
  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        ref={scrollRef}
        scrollEventThrottle={16}>
        {photos?.length > 0 ? (
          <Swiper
            style={{ height: IMG_HEIGHT }}
            showsButtons={false}
            loop={false}
            // dotColor={Colors.primary}
            activeDotColor={Colors.primary}>
            {photos.map((photo, index) => (
              <Image
                source={{
                  uri: `https://backend.sakanijo.com/api/images/${encodeURIComponent(
                    listing.folderName
                  )}/${encodeURIComponent(photo)}`,
                }}
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
            {t("in")} {listing?.address}
          </Text>
          {listing?.home_type === "فيلا / منزل" ? (
            <Text style={styles.rooms}>
              {RoomsCounting?.stages} {t("stage")}· {RoomsCounting?.bathroom}{" "}
              {t("bathrooms")} · {RoomsCounting?.kitchen} {t("kitchen")} ·{" "}
              {RoomsCounting?.rooms} {t("rooms")}
            </Text>
          ) : null}
          {listing?.home_type === "شقة" ? (
            <Text style={styles.rooms}>
              {RoomsCounting?.bathroom} {t("bathrooms")} ·{" "}
              {RoomsCounting?.kitchen} {t("kitchen")} · {RoomsCounting?.rooms}{" "}
              {t("rooms")}
            </Text>
          ) : null}

          <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
            <Ionicons name="" size={16} />
            <Text style={styles.ratings}>
              {listing?.home_type === "تنضيم رحلات"
                ? "مدة رحلة " + t(listing?.tripLong)
                : listing?.space_general + " m²"}
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
            <Ionicons name="heart" size={16} />
            <Text style={styles.ratings}>
              {t("likes")} | {listing?.heartSave}
            </Text>
            {listing?.priceHide == 0 ? (
              <Text
                style={{
                  fontFamily: "droidAr",
                  paddingHorizontal: 10,
                  fontSize: 20,
                }}>
                JOD {listing?.price}
              </Text>
            ) : (
              <Text
                style={{
                  fontFamily: "droidAr",
                  paddingHorizontal: 10,
                  fontSize: 20,
                }}>
                {" "}
                {t("hiddenPrice")}{" "}
              </Text>
            )}

            <TouchableOpacity style={styles.footerText}>
              {listing?.home_type === "مسابح" ||
              listing?.home_type === "ملاعب" ||
              listing?.home_type === "قاعات اجتماعات" ? (
                <Text style={{ fontFamily: "droidAr" }}>{t("hour")}</Text>
              ) : listing?.home_type === "تنضيم رحلات" ? (
                <Text style={{ fontFamily: "droidAr" }}>
                  {t(listing?.tripLong)}
                </Text>
              ) : listing?.home_type === "صالات رياضة" ? (
                <Text style={{ fontFamily: "droidAr" }}>
                  {listing?.subscriptionTypeGym}
                </Text>
              ) : listing?.buy_or_rent === "الحجز" ? (
                <Text style={{ fontFamily: "droidAr" }}>{t("night")}</Text>
              ) : null}
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.hostView}>
            <Image
              source={require("@/assets/images/publisherUsers/2.png")}
              style={styles.host}
            />

            <View style={{ alignItems: "flex-end", flexDirection: "row" }}>
              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontWeight: 500,
                    fontSize: 16,
                    fontFamily: "droidAr",
                  }}>
                  {" "}
                  {t("created_from")} {listing?.ownerName}
                </Text>
                <Text style={{ fontFamily: "droidAr" }}>
                  {" "}
                  {moment(listing?.date).fromNow()}{" "}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              width: "100%",
              gap: 10,
            }}>
            {amenities?.map((amenite) => {
              return (
                <View
                  key={amenite}
                  style={{
                    backgroundColor: "#eee",
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <Text style={{ fontFamily: "droidAr", textAlign: "center" }}>
                    {" "}
                    {amenite}
                  </Text>
                </View>
              );
            })}
          </View>
          <View style={styles.divider} />
          <Text style={styles.description}>{listing?.description}</Text>
        </View>
      </Animated.ScrollView>

      <Animated.View
        style={defaultStyles.footer}
        entering={SlideInDown.delay(200)}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
          }}>
          {listing?.buy_or_rent === "الحجز" ? (
            <TouchableOpacity
              style={[
                defaultStyles.btn,
                {
                  paddingRight: 20,
                  paddingLeft: 20,
                  backgroundColor: "#25D366",
                  borderColor: "#25D366",
                  borderWidth: 2,
                  width: "40%",
                },
              ]}
              onPress={() => {
                makePhoneCall(listing?.ownerPhone);
              }}>
              <Text
                style={{
                  ...defaultStyles.btnText,
                  fontFamily: "droidAr",
                  color: "white",
                }}>
                {t("callNow")}
              </Text>
            </TouchableOpacity>
          ) : (
            <Pressable
              style={{
                ...defaultStyles.btn,
                backgroundColor: "#25D366",
                width: "50%",
                height: 50,
              }}
              onPress={() => {
                if (listing?.gettingCalls === "whatsapp") {
                  sendWhatsApp(
                    listing?.ownerPhone,
                    `اريد الاستفسار عن هدا الاعلان https://place.sakanijo.com/place?id=${listing?.id}`
                  );
                } else {
                  sendSMS(
                    listing?.ownerPhone,
                    `اريد الاستفسار عن هدا الاعلان https://place.sakanijo.com/place?id=${listing?.id}`
                  );
                }
              }}>
              <Text
                style={{
                  fontFamily: "droidAr",
                  fontSize: 16,
                  color: "#fff",
                }}>
                {listing?.gettingCalls === "whatsapp"
                  ? t("msgWts")
                  : t("msgSms")}
              </Text>
            </Pressable>
          )}

          {listing?.home_type === "ملاعب" ||
          listing?.home_type === "قاعات اجتماعات" ||
          listing?.home_type === "مسابح" ? (
            <ResirvationTime listingData={listing} />
          ) : listing?.home_type === "صالات رياضة" ? (
            <TouchableOpacity
              style={[
                defaultStyles.btn,
                {
                  paddingRight: 20,
                  paddingLeft: 20,
                  backgroundColor: "transparent",
                  borderColor: Colors.primary,
                  borderWidth: 2,
                  width: "40%",
                },
              ]}
              onPress={() => {
                modalAVisible();
              }}>
              <Text
                style={{
                  ...defaultStyles.btnText,
                  fontFamily: "droidAr",
                  color: Colors.primary,
                }}>
                {t("bookNow")}
              </Text>
            </TouchableOpacity>
          ) : listing?.home_type === "تنضيم رحلات" ? (
            <TouchableOpacity
              style={[
                defaultStyles.btn,
                {
                  paddingRight: 20,
                  paddingLeft: 20,
                  backgroundColor: "transparent",
                  borderColor: Colors.primary,
                  borderWidth: 2,
                  width: "40%",
                },
              ]}
              onPress={() => {
                modalTripVisible();
              }}>
              <Text
                style={{
                  ...defaultStyles.btnText,
                  fontFamily: "droidAr",
                  color: Colors.primary,
                }}>
                {t("bookNow")}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                defaultStyles.btn,
                {
                  paddingRight: 20,
                  paddingLeft: 20,
                  backgroundColor: "transparent",
                  borderColor: Colors.primary,
                  borderWidth: 2,
                  width: "40%",
                },
              ]}
              onPress={() => {
                if (listing?.buy_or_rent == "الحجز") {
                  setModalVisible(true);
                } else {
                  makePhoneCall(listing?.ownerPhone);
                }
              }}>
              <Text
                style={{
                  ...defaultStyles.btnText,
                  fontFamily: "droidAr",
                  color: Colors.primary,
                }}>
                {listing?.buy_or_rent === "الحجز" ? t("bookNow") : t("callNow")}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            defaultStyles.btn,
            { paddingRight: 20, paddingLeft: 20, backgroundColor: "green" },
          ]}
          onPress={() => {
            router.navigate("BookCar");
          }}>
          <Text style={{ ...defaultStyles.btnText, fontFamily: "droidAr" }}>
            {" "}
            {t("bookCar")}{" "}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <GymBookingModal
        visible={modalVisible}
        onClose={modalInVisible}
        listingData={listing}
        onSubmit={onsubmitGYM}
      />

      <TripBookingModal
        visible={modalTripVisibleState}
        onClose={modalTripInvisibleVisible}
        tripDate={listing?.tripDate}
        tripDuration={listing?.tripLong}
        tripPrice={listing?.price}
        onSubmit={onsubmitTrip}
      />

      <ReservationModal
        visible={isModalVisible}
        onClose={toggleModal}
        specifiedDates={listing?.calanderDaysPrice}
        weekDaysObject={pricesDays}
        priceNormal={listing?.price}
        ismultiSelect={listing?.hajez_type === "24ساعة" ? true : false}
        onSubmit={onsubmitRejester}
        notAllowedDays={notAllowedDays}
        myAd={listing}
      />

      <CustomAlert
        icon={"check"}
        message={t("thnksMsg")}
        visible={isAlertShown}
      />
      {/* 
<Pressable style={{
  width : 80 , 
  height : 80 , 
  borderRadius : "50%" , 
  backgroundColor : "#25D366" ,
  position: "absolute" , 
  right : 5 , 
  bottom : 100 ,
  alignItems : "center",
  justifyContent : "center"
}}>
<MaterialCommunityIcons  name='whatsapp' size={40}  color={"white"}/>

<View
style={{
  width : 90 , 
  height : 20 ,
  backgroundColor : "#25D366" ,
  borderRadius : 10 , 
  position : "absolute" , 
  bottom : -5 ,
  alignItems : "center",
  justifyContent : "center"
}}>
  <Text style={{
    fontFamily : "droidAr" , 
    fontSize : 12 ,
    color : "white"
  }}>الاستفسارات</Text>
</View>


</Pressable> */}

      {/* <DraggableView /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  image: {
    height: IMG_HEIGHT,
    width: width,
  },
  infoContainer: {
    padding: 24,
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    fontFamily: "droidAr",
  },
  location: {
    fontSize: 18,
    marginTop: 10,
    fontFamily: "droidAr",
  },
  rooms: {
    fontSize: 16,
    color: Colors.grey,
    marginVertical: 4,
    fontFamily: "droidAr",
  },
  ratings: {
    fontSize: 16,
    fontFamily: "droidAr",
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
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "flex-start",

    gap: 12,
  },
  footerText: {
    height: "100%",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footerPrice: {
    fontSize: 18,
    fontFamily: "droidAr",
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    color: Colors.primary,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  header: {
    backgroundColor: "#fff",
    height: 100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
  },

  description: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 100,
    fontFamily: "droidAr",
  },
});

export default DetailsPage;
