import React, { useEffect, useState } from "react";
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
  ActivityIndicator,
  Switch,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import FeaturesSheet from "@/components/Publish/FeaturesSheet";
import { useSelector, useDispatch } from "react-redux";
import { Calendar } from "react-native-calendars";

const HEIGHT = Dimensions.get("window").height;

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const daysOfWeekAr = [
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
  "الأحد",
];

const EditAd = () => {
  const data = useSelector((state) => state.publishData.value);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [priceBeforeNoon, setPriceBeforeNoon] = useState("");
  const [priceAfterNoon, setPriceAfterNoon] = useState("");

  const [photos, setPhotos] = useState([]);
  const [typeAd, setTypeAd] = useState("");
  const [variablePrices, setVariablePrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [myAd, setAd] = useState(null);
  const [times, setTimes] = useState([]);
  const [selectedDayPrice, setSelectedDayPrice] = useState(0);
  const [load, setLoad] = useState(false);
  const [tripDate, setTripDate] = useState();
  const [poolType, setPoolType] = useState();
  const [gymSubs, setGymSubs] = useState();

  const [isActive, setIsActive] = useState(false);

  const toggleSwitch = async () => {
    try {
      setIsActive((previousState) => !previousState);

      // Send the request to the backend to toggle the 'active' status
      const response = await axios.post(
        `https://backend.sakanijo.com/api/places/${id}/toggle-active`
      );

      // Toggle the local state if the request was successful
      if (response.status === 200) {
        console.log("active changed");
      }
    } catch (error) {
      console.error("Error toggling active status:", error);
      Alert.alert(
        "Error",
        "Failed to toggle active status. Please try again later."
      );
    }
  };

  useEffect(() => {
    const fetchAdDetails = async () => {
      try {
        const response = await axios.get(
          `https://backend.sakanijo.com/api/places/${id}`
        );
        const ad = response.data;

        setTitle(ad.title);
        setDescription(ad.description);
        setPrice(ad.price.toString());
        setPriceAfterNoon(ad.priceAfterNoon);
        setPriceBeforeNoon(ad.priceBeforeNoon);
        setPhotos(ad.photos ? ad.photos.split(",") : []);
        setTypeAd(ad.home_type);
        setIsActive(ad.active);
        setTripDate(ad.tripDate);
        setPoolType(ad.poolType);
        setGymSubs(ad.subscriptionTypeGym);
        let variablePricesParsed = JSON.parse(ad.variable_prices);
        variablePricesParsed = JSON.parse(variablePricesParsed);

        // Initialize variable prices with default values for all days of the week
        if (Object.keys(variablePricesParsed).length != 0) {
          let initialVariablePrices = {};

          daysOfWeekAr.forEach((day) => {
            initialVariablePrices[day] = variablePricesParsed[day] || "";
          });
          setVariablePrices(initialVariablePrices);
        }

        setAd(ad);
        setLoading(false);

        setSelectedDayPrice(ad?.calanderDaysPrice);
      } catch (err) {
        console.error("Error fetching ad details:", err.response.data);
        setError("Failed to fetch ad details");
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

  useEffect(() => {
    if (myAd?.calanderDaysPrice) {
      console.log("myAd?.specificDaysInCalendar :", myAd?.calanderDaysPrice);
      let data = JSON.parse(myAd?.calanderDaysPrice);

      setTimes(data);
      console.log("dates ,", data);
    }
  }, [myAd]);

  const handleSave = async () => {
    try {
      setLoad(true);
      const formData = new FormData();

      // Append the text fields
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("priceBeforeNoon", priceBeforeNoon);
      formData.append("priceAfterNoon", priceAfterNoon);
      formData.append("amenities", JSON.stringify(data.amenities));
      formData.append("variable_prices", JSON.stringify(variablePrices));
      formData.append("selected_day_price", JSON.stringify(times));
      formData.append("speceficDayInCalander", JSON.stringify(times));
      formData.append("folderName", myAd.folderName);
      formData.append("tripDate", tripDate);
      formData.append("poolType", poolType);
      formData.append("subsGym", gymSubs);
      // Append the photos (image files)
      photos.forEach((photo, index) => {
        if (/^\d+_/.test(photo)) {
          formData.append(`existingPhotos`, photo);
        } else {
          const fileType = photo.split(".").pop();
          formData.append(`newPhotos`, {
            uri: photo,
            name: `photo_${index}.${fileType}`,
            type: `image/${fileType}`,
          });
        }
      });

      // Send the FormData to the backend
      const response = await axios.post(
        `https://backend.sakanijo.com/ads/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log("Ad updated successfully");
        console.log(response.data);
        router.back();
        setLoad(false);
        // router.back();
      }
    } catch (err) {
      setLoad(false);

      console.error("Error updating ad:", err.response.data);
    }
  };

  if (loading) {
    return <Text>{t("loading")}</Text>;
  }

  if (error) {
    return <Text>{t("error")}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>{t("titleInput")}</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>{t("descriptionInput")}</Text>
        <TextInput
          style={styles.textArea}
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>{t("priceInput")}</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>{t("photos")}</Text>
        <View style={styles.photosContainer}>
          {photos.map((photo, index) => (
            <View key={index} style={styles.photoWrapper}>
              <Image
                source={{
                  uri: /^\d+_/.test(photo)
                    ? `https://backend.sakanijo.com/api/images/${encodeURIComponent(
                        myAd.folderName
                      )}/${encodeURIComponent(photo)}`
                    : photo,
                }}
                style={styles.photo}
              />
              <TouchableOpacity
                style={styles.deletePhotoButton}
                onPress={() => handleDeletePhoto(photo)}>
                <Ionicons name="close-circle" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={styles.addPhotoButton}
            onPress={handleImagePick}>
            <Ionicons name="add-circle" size={40} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {Object.keys(variablePrices).length != 0 ? (
        <View style={styles.variablePricesContainer}>
          <Text style={styles.label}>{t("variablePrices")}</Text>
          {daysOfWeekAr.map((day) => (
            <View key={day} style={styles.variablePriceField}>
              <Text style={styles.variablePriceLabel}>{day}</Text>
              <TextInput
                style={styles.input}
                value={variablePrices[day] !== "" ? variablePrices[day] : ""} // Display saved value or empty string
                onChangeText={(value) => {
                  handleVariablePriceChange(day, value);
                }}
                keyboardType="numeric"
              />
            </View>
          ))}
        </View>
      ) : null}

      {myAd.buy_or_rent === "الحجز" &&
      myAd.home_type !== "تنضيم رحلات" &&
      myAd.home_type !== "صالات رياضة" ? (
        priceBeforeNoon !== "null" ? (
          <View style={styles.fieldContainer}>
            {myAd.home_type == "فيلا / منزل" ||
            myAd.home_type == "شقة" ||
            myAd.home_type == "مزرعة" ||
            myAd.home_type == "مخيمات و اكواخ" ||
            myAd.home_type == "شليهات" ? (
              <Text style={styles.label}>{t("priceAtDay")}</Text>
            ) : (
              <Text style={styles.label}>{t("priceBeforeNoon")}</Text>
            )}
            <TextInput
              style={styles.input}
              defaultValue={priceBeforeNoon}
              onChangeText={setPriceBeforeNoon}
              keyboardType="numeric"
            />
          </View>
        ) : null
      ) : null}

      {myAd.buy_or_rent === "الحجز" &&
      myAd.home_type !== "تنضيم رحلات" &&
      myAd.home_type !== "صالات رياضة" ? (
        priceAfterNoon !== "null" ? (
          <View style={styles.fieldContainer}>
            {myAd.home_type == "فيلا / منزل" ||
            myAd.home_type == "شقة" ||
            myAd.home_type == "مزرعة" ||
            myAd.home_type == "مخيمات و اكواخ" ||
            myAd.home_type == "شليهات" ? (
              <Text style={styles.label}>{t("priceAtNight")}</Text>
            ) : (
              <Text style={styles.label}>{t("priceAfterNoon")}</Text>
            )}

            <TextInput
              style={styles.input}
              defaultValue={priceAfterNoon}
              onChangeText={setPriceAfterNoon}
              keyboardType="numeric"
            />
          </View>
        ) : null
      ) : null}

      {myAd.calanderDaysPrice !== `` &&
      myAd.buy_or_rent === "الحجز" &&
      myAd.home_type !== "تنضيم رحلات" &&
      myAd.home_type !== "صالات رياضة" ? (
        <View style={{ ...styles.box2 }}>
          <Text style={styles.sectionTitle}>{t("priceByDaysInCalander")}</Text>
          <View style={styles.variablePriceContainer}>
            <View style={styles.calendarContainer}>
              {/* Render the calendar with pre-selected days */}
              <Calendar
                markedDates={Object.keys(times).reduce((acc, date) => {
                  acc[date] = { selected: true, selectedDotColor: "orange" };
                  return acc;
                }, {})}
                style={styles.calendar}
                onDayPress={(day) => {
                  const selectedDate = day.dateString;
                  console.log("Selected Date:", selectedDate);
                  console.log("Dates:", times);

                  setTimes((prevTimes) => {
                    // If the date is already selected, remove it
                    if (prevTimes[selectedDate]) {
                      const { [selectedDate]: _, ...updatedTimes } = prevTimes; // Using destructuring to remove the key
                      return updatedTimes;
                    } else {
                      // If the date is newly selected, add it with an empty price
                      return { ...prevTimes, [selectedDate]: myAd.price };
                    }
                  });
                }}
              />
            </View>

            {/* Render the dynamic inputs for each selected day */}
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                flexWrap: "wrap",
                width: "100%",
              }}>
              {Object.keys(times).map((day) => (
                <View key={day} style={styles.variablePriceRow}>
                  <Text style={styles.text}>
                    {t("priceForSelectedDays")} {day}
                  </Text>
                  <TextInput
                    style={{ ...styles.input }}
                    placeholder="ادخل السعر الجديد"
                    defaultValue={times[day]} // Pre-fill with the existing price or empty if new
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      const updatedDayPrices = { ...times, [day]: text };
                      setTimes(updatedDayPrices); // Update the state with new prices
                    }}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>
      ) : null}

      {myAd.home_type === "تنضيم رحلات" ? (
        <View style={{ ...styles.box2 }}>
          <Text style={styles.sectionTitle}>{t("timeTrip")}</Text>

          <View style={styles.calendarContainer}>
            {/* Render the calendar with pre-selected days */}
            <Calendar
              markedDates={{
                [tripDate]: { selected: true, selectedDotColor: "orange" }, // Ensure myAd.tripDate is in 'YYYY-MM-DD' format
              }}
              style={styles.calendar}
              onDayPress={(day) => {
                const selectedDate = day.dateString;
                setTripDate(selectedDate);
              }}
            />
          </View>
        </View>
      ) : null}

      {myAd.home_type == "صالات رياضة" ? (
        <>
          <Text style={styles.sectionTitle}> {t("gymType")}</Text>
          <View style={styles.slectionBoxes}>
            <Pressable
              style={[
                styles.boxSelection,
                poolType === "رجالي" && styles.selectedBox,
              ]}
              onPress={() => setPoolType("رجالي")}>
              <Text style={styles.text}>{t("men")}</Text>
            </Pressable>

            <Pressable
              style={[
                styles.boxSelection,
                poolType === "نسائي" && styles.selectedBox,
              ]}
              onPress={() => setPoolType("نسائي")}>
              <Text style={styles.text}>{t("women")}</Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}> {t("abonmonet")}</Text>
          <View style={styles.slectionBoxes}>
            <Pressable
              style={[
                styles.boxSelection,
                gymSubs === "شهر" && styles.selectedBox,
              ]}
              onPress={() => setGymSubs("شهر")}>
              <Text style={styles.text}>{t("month")}</Text>
            </Pressable>

            <Pressable
              style={[
                styles.boxSelection,
                gymSubs === "ثلاثة أشهر" && styles.selectedBox,
              ]}
              onPress={() => setGymSubs("ثلاثة أشهر")}>
              <Text style={styles.text}>{t("3month")}</Text>
            </Pressable>
            <Pressable
              style={[
                styles.boxSelection,
                gymSubs === "سنة" && styles.selectedBox,
              ]}
              onPress={() => setGymSubs("سنة")}>
              <Text style={styles.text}>{t("year")}</Text>
            </Pressable>
          </View>
        </>
      ) : null}

      <FeaturesSheet type={typeAd} isEdit={true} />

      <View style={styles.containerFlex}>
        <Text
          style={[
            styles.statusText,
            isActive ? styles.activeText : styles.inactiveText,
          ]}>
          {isActive ? t("Active") : t("Inactive")}
        </Text>
        <Switch
          trackColor={{ false: "#767577", true: Colors.primary }}
          thumbColor={isActive ? "#7CF5FF" : "#C4DAD2"}
          onValueChange={toggleSwitch}
          value={isActive}
        />
      </View>

      <Pressable onPress={handleSave} style={styles.saveButton} disabled={load}>
        {load ? (
          <ActivityIndicator color={"white"} size={20} />
        ) : (
          <Text style={styles.saveButtonText}>{t("save")}</Text>
        )}
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    height: HEIGHT,
  },
  containerFlex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    width: "100%", // Adjust as needed
    backgroundColor: "#fff", // Background color of the switch container
    borderRadius: 5, // Rounds the corners
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "droidAr",
  },
  activeText: {
    color: "green", // Color for "Active" state
  },
  inactiveText: {
    color: "red", // Color for "Inactive" state
  },
  sectionTitle: {
    fontFamily: "droidAr",
    fontSize: 15,
    marginTop: 20,
    marginHorizontal: 20,
  },
  selectedBox: {
    borderColor: "black",
    borderWidth: 2,
  },
  boxesContainer: {
    width: "100%",
    padding: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
  },

  slectionBoxes: {
    width: "100%",
    height: 100,
    flexWrap: "wrap",
    gap: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  boxSelection: {
    paddingLeft: 20,
    paddingRight: 20,
    height: 50,
    borderWidth: 1,
    borderColor: "#dddddd",
    borderStyle: "solid",
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "droidAr",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: "droidAr",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    height: 100,
    textAlignVertical: "top",
    fontFamily: "droidAr",
  },
  photosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  photoWrapper: {
    position: "relative",
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  deletePhotoButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
  },
  addPhotoButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  variablePricesContainer: {
    marginTop: 20,
  },
  variablePriceField: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  variablePriceLabel: {
    flex: 1,
    fontSize: 16,
    fontFamily: "droidAr",
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 32,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "droidAr",
  },
  box: {
    padding: 16,
    display: "flex",
    width: "100%",
    height: 150,
    gap: 10,
    alignItems: "flex-end",
  },
  box2: {
    padding: 16,
    display: "flex",
    width: "100%",
    gap: 10,
    alignItems: "flex-end",
  },
  required: {
    color: "red",
  },
  calendarContainer: {
    borderWidth: 3,
    borderColor: Colors.primary,
    borderRadius: 20,
    overflow: "hidden",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
    // elevation: 9,
  },
  calendar: {
    borderRadius: 20,
  },

  text: {
    fontFamily: "droidAr",
  },
  sectionTitle: {
    fontFamily: "droidAr",
    fontSize: 15,
  },
  subTitle: {
    color: "grey",
    fontFamily: "droidAr",
    textAlign: "right",
    marginRight: 50,
  },
  variablePriceContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
    justifyContent: "center",
  },
  variablePriceRow: { alignItems: "center", marginVertical: 5, width: 100 },
});

export default EditAd;
