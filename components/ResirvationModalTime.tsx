import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Platform,
  FlatList,
  Modal,
  StyleSheet,
  Image,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/FontAwesome";
import { useTranslation } from "react-i18next";
import Colors from "@/constants/Colors";
import beforNoon from "@/assets/images/sunrise.png";
import afterNoon from "@/assets/images/sunsets.png";
import dayImage from "@/assets/images/day.png";
import axios from "axios";
import CustomAlert from "@/components/Alert";
import moment from "moment";

import * as SecureStore from "expo-secure-store";
const timeSlotsBeforeNoon = [
  "07:00 - 08:00",
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
];

const timeSlotsAfterNoon = [
  "01:00 - 02:00",
  "02:00 - 03:00",
  "03:00 - 04:00",
  "04:00 - 05:00",
  "05:00 - 06:00",
  "06:00 - 07:00",
  "07:00 - 08:00",
];

const ResirvationTime = ({ listingData }) => {
  const { t } = useTranslation();
  moment.locale("en");

  const today = moment().format("YYYY-MM-DD"); // Get today's date in Western numerals

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [step, setStep] = useState(1);
  const [price, setPrice] = useState(0);
  const [isAlertShown, setAlertShown] = useState(false);

  function checkTimePeriod(timeObj) {
    const start = new Date(timeObj.start);
    const end = new Date(timeObj.end);

    // Extract the hours from the start and end times
    const startHour = start.getUTCHours();
    const endHour = end.getUTCHours();

    // Check if the time is between 07:00 and 12:00 (before noon)
    const isBeforeNoon = startHour >= 7 && endHour <= 12;

    // Check if the time is between 13:00 and 20:00 (after noon)
    const isAfterNoon = startHour >= 13 && endHour <= 20;

    if (isBeforeNoon) {
      return "beforeNoon";
    } else if (isAfterNoon) {
      return "afterNoon";
    } else {
      return "12h";
    }
  }

  const sendSMS = (phoneNumber, text = "") => {
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
    let whatsappUrl = `whatsapp://send?phone=${phoneNumber}`;
    if (text) {
      whatsappUrl += `&text=${encodeURIComponent(text)}`;
    }
    Linking.openURL(whatsappUrl).catch(() => {
      // Handle error (e.g., WhatsApp not installed)
      alert("الرجاء تاكد من ان الواتساب محمل على جهازك");
    });
  };

  const sendBookToBackend = async () => {
    let result = await SecureStore.getItemAsync("userId");
    try {
      console.log("user id :", result);

      const response = await axios.post(
        "https://backend.sakanijo.com/api/bookings/add",
        {
          checkIn: selectedDate,
          checkOut: selectedDate,
          place: listingData?.id,
          price: price,
          resirvedDays: JSON.stringify(selectedTime),
          costumerId: result,
        }
      );

      if (response.status === 200) {
        console.log("Data posted successfully:", response.data);

        setSelectedPeriod("");
        setSelectedDate("");
        setSelectedTime("");
        setPrice(0);

        //

        let text;

        if (selectedPeriod === "beforeNoon") {
          text = `اريد حجز هدا الاعلان :  ${listingData?.title} 
          الساعات التي اريد حجزها : 
          ${selectedTime.join(" و ")}
          
          الفترة ما قبل الضهر

          تاريخ الحجز : 
          ${selectedDate}
          
          رابط الاعلان : 
          https://place.sakanijo.com/place?id=${listingData?.id}
          `;
        } else if (selectedPeriod === "afterNoon") {
          text = `اريد حجز هدا الاعلان :  ${listingData?.title} 
          الساعات التي اريد حجزها : 
          ${selectedTime.join(" و ")}
          
          الفترة ما بعد الضهر

          تاريخ الحجز : 
          ${selectedDate}
          
          رابط الاعلان : 
          https://place.sakanijo.com/place?id=${listingData?.id}
          `;
        } else {
          text = `اريد حجز هدا الاعلان :  ${listingData?.title} 
          
          حجز النهار بكامله

          تاريخ الحجز : 
          ${selectedDate}
          
          رابط الاعلان : 
          https://place.sakanijo.com/place?id=${listingData?.id}
          `;
        }

        if (listingData?.gettingCalls === "whatsapp") {
          sendWhatsApp(listingData?.ownerPhone, text);
        } else {
          sendSMS(listingData?.ownerPhone, text);
        }

        setStep(4);
      } else {
        console.log(
          "Failed to post data:",
          response.status,
          response.statusText
        );
      }
    } catch (err) {
      console.log(err.response.data.error);
    }
  };

  const handleSelectPeriod = (period) => {
    setSelectedPeriod(period);
    setStep(2); // Move to the next step
  };

  const handleSelectDate = (day) => {
    setSelectedDate(day.dateString);
    setStep(3); // Move to the next step
  };

  const handleTimeSlotSelect = (time) => {
    let prix;

    // Check if selectedPeriod is "beforeNoon" and priceBeforeNoon is not null or undefined
    if (
      selectedPeriod === "beforeNoon" &&
      listingData?.priceBeforeNoon != null
    ) {
      console.log("before noon");
      prix = +listingData.priceBeforeNoon;
    }
    // Check if selectedPeriod is "afterNoon" and priceAfterNoon is not null or undefined
    else if (
      selectedPeriod === "afterNoon" &&
      listingData?.priceAfterNoon != null
    ) {
      console.log("after noon");
      prix = +listingData.priceAfterNoon;
    }
    // Fallback to default price if no specific period price is available
    else {
      console.log("normal noon");
      prix = +listingData.price;
    }

    // Update selected times and adjust the price accordingly
    setSelectedTime((prevSelected) => {
      let updatedSelectedTime;

      setPrice((prevPrice) => {
        // Check if the time is already selected (unselect it) or add it to the selection
        if (prevSelected.includes(time)) {
          updatedSelectedTime = prevSelected.filter((t) => t !== time);
          return prevPrice - prix; // Decrement the price
        } else {
          updatedSelectedTime = [...prevSelected, time];
          return prevPrice + prix; // Increment the price
        }
      });

      return updatedSelectedTime;
    });
  };

  const timeSlots =
    selectedPeriod === "beforeNoon" ? timeSlotsBeforeNoon : timeSlotsAfterNoon;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.openButton}
        onPress={() => {
          setModalVisible(true);
          setStep(1); // Reset to the first step
        }}>
        <Text style={styles.openButtonText}>{t("bookNow")}</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.headerContainer}>
              {selectedPeriod && (
                <Text style={styles.selectedText}>
                  {t("youSelected")}:{" "}
                  {selectedPeriod === "beforeNoon"
                    ? t("beforeNoon")
                    : t("afterNoon")}
                </Text>
              )}
              {selectedDate && (
                <Text style={styles.selectedText}>
                  {t("date")}: {selectedDate}
                </Text>
              )}
              <View style={styles.progressContainer}>
                <View
                  style={[
                    styles.progressStep,
                    step >= 1 && styles.progressStepActive,
                  ]}
                />
                <View
                  style={[
                    styles.progressStep,
                    step >= 2 && styles.progressStepActive,
                  ]}
                />
                <View
                  style={[
                    styles.progressStep,
                    step >= 3 && styles.progressStepActive,
                  ]}
                />
              </View>
            </View>

            {step === 1 && (
              <>
                <Text style={styles.header}>{t("selectPeriod")}</Text>
                <View style={styles.cardsContainer}>
                  {listingData?.hajez_type === "beforeNoon" ? (
                    <TouchableOpacity
                      style={styles.card}
                      onPress={() => handleSelectPeriod("beforeNoon")}>
                      <Image source={beforNoon} style={styles.icon} />
                      <Text style={styles.cardText}>{t("beforeNoon")}</Text>
                    </TouchableOpacity>
                  ) : listingData?.hajez_type === "afterNoon" ? (
                    <TouchableOpacity
                      style={styles.card}
                      onPress={() => handleSelectPeriod("afterNoon")}>
                      <Image source={afterNoon} style={styles.icon} />
                      <Text style={styles.cardText}>{t("afterNoon")}</Text>
                    </TouchableOpacity>
                  ) : listingData?.hajez_type === "12h" ? (
                    <>
                      <TouchableOpacity
                        style={styles.card}
                        onPress={() => handleSelectPeriod("beforeNoon")}>
                        <Image source={beforNoon} style={styles.icon} />
                        <Text style={styles.cardText}>{t("beforeNoon")}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.card}
                        onPress={() => handleSelectPeriod("afterNoon")}>
                        <Image source={afterNoon} style={styles.icon} />
                        <Text style={styles.cardText}>{t("afterNoon")}</Text>
                      </TouchableOpacity>
                    </>
                  ) : listingData?.hajez_type === "customeTime" ? (
                    checkTimePeriod(listingData?.timeOpen) === "beforeNoon" ? (
                      <TouchableOpacity
                        style={styles.card}
                        onPress={() => handleSelectPeriod("beforeNoon")}>
                        <Image source={beforNoon} style={styles.icon} />
                        <Text style={styles.cardText}>{t("beforeNoon")}</Text>
                      </TouchableOpacity>
                    ) : checkTimePeriod(listingData?.timeOpen) ===
                      "afterNoon" ? (
                      <TouchableOpacity
                        style={styles.card}
                        onPress={() => handleSelectPeriod("afterNoon")}>
                        <Image source={afterNoon} style={styles.icon} />
                        <Text style={styles.cardText}>{t("afterNoon")}</Text>
                      </TouchableOpacity>
                    ) : checkTimePeriod(listingData?.timeOpen) === "12h" ? (
                      <>
                        <TouchableOpacity
                          style={styles.card}
                          onPress={() => handleSelectPeriod("beforeNoon")}>
                          <Image source={beforNoon} style={styles.icon} />
                          <Text style={styles.cardText}>{t("beforeNoon")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.card}
                          onPress={() => handleSelectPeriod("afterNoon")}>
                          <Image source={afterNoon} style={styles.icon} />
                          <Text style={styles.cardText}>{t("afterNoon")}</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <Text
                        style={{ fontFamily: "droidAr", textAlign: "center" }}>
                        الحجز غير متوفر الان
                      </Text>
                    )
                  ) : (
                    <Text
                      style={{ fontFamily: "droidAr", textAlign: "center" }}>
                      الحجز غير متوفر الان
                    </Text>
                  )}

                  {listingData.home_type === "قاعات اجتماعات" ? (
                    <TouchableOpacity
                      style={styles.card}
                      onPress={() => {
                        setPrice(+listingData?.price);
                        handleSelectPeriod("allDay");
                      }}>
                      <Image source={dayImage} style={styles.icon} />
                      <Text style={styles.cardText}>{t("allDay")}</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </>
            )}

            {step === 2 && (
              <>
                <Calendar
                  onDayPress={handleSelectDate}
                  markedDates={{
                    [selectedDate]: {
                      selected: true,
                      selectedColor: "#FF5A5F",
                    },
                    // Disable past dates
                    [today]: { selected: false, disableTouchEvent: true },
                  }}
                  minDate={today} // Prevent selecting previous dates
                  theme={{
                    selectedDayBackgroundColor: "#FF5A5F",
                    selectedDayTextColor: "#FFFFFF",
                    todayTextColor: "#FF5A5F",
                  }}
                  style={styles.calendar}
                />
              </>
            )}

            {step === 3 ? (
              selectedPeriod !== "allDay" ? (
                <>
                  <Text style={styles.header}>{t("selectTimeSlots")}</Text>
                  <FlatList
                    data={timeSlots}
                    keyExtractor={(item) => item}
                    style={{ height: 350 }}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.timeSlot,
                          selectedTime.includes(item) &&
                            styles.selectedTimeSlot,
                        ]}
                        onPress={() => handleTimeSlotSelect(item)}>
                        <Text style={styles.timeSlotText}>{item}</Text>
                        {selectedTime.includes(item) && (
                          <Icon name="check" size={20} color="#FFFFFF" />
                        )}
                      </TouchableOpacity>
                    )}
                  />
                  <Text
                    style={{
                      textAlign: "center",
                      fontFamily: "droidAr",
                      fontSize: 20,
                    }}>
                    {t("priceTotal")} {price} JOD
                  </Text>
                </>
              ) : (
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      direction: "rtl",
                      alignItems: "center",
                    }}>
                    <Text style={{ fontSize: 20, fontFamily: "droidAr" }}>
                      تاريخ الحجز :
                    </Text>
                    <Text style={{ fontSize: 20, fontFamily: "droidAr" }}>
                      {selectedDate}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      direction: "rtl",
                      alignItems: "center",
                    }}>
                    <Text style={{ fontSize: 20, fontFamily: "droidAr" }}>
                      فترة الحجز :
                    </Text>
                    <Text style={{ fontSize: 20, fontFamily: "droidAr" }}>
                      {t(selectedPeriod)}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      direction: "rtl",
                      alignItems: "center",
                    }}>
                    <Text style={{ fontSize: 20, fontFamily: "droidAr" }}>
                      السعر الإجمالي :
                    </Text>
                    <Text style={{ fontSize: 20, fontFamily: "droidAr" }}>
                      {price} JOD
                    </Text>
                  </View>
                </View>
              )
            ) : null}

            {step == 4 && (
              <Text
                style={{
                  fontFamily: "droidAr",
                  fontSize: 25,
                  textAlign: "center",
                }}>
                {t("thnksMsg")}
              </Text>
            )}

            {step === 3 ? (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}>
                <TouchableOpacity
                  style={{ ...styles.closeButton, width: "45%" }}
                  onPress={() => {
                    sendBookToBackend();
                  }}>
                  <Text style={styles.closeButtonText}>{t("Confirm")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    ...styles.closeButton,
                    width: "45%",
                    borderWidth: 2,
                    borderColor: "#FF5A5F",
                    backgroundColor: "white",
                  }}
                  onPress={() => {
                    setModalVisible(false);
                    setSelectedPeriod("");
                    setSelectedDate("");
                    setSelectedTime("");
                    setPrice(0);
                  }}>
                  <Text style={{ ...styles.closeButtonText, color: "#FF5A5F" }}>
                    {t("close")}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setModalVisible(false);
                  setSelectedPeriod("");
                  setSelectedDate("");
                  setSelectedTime("");
                  setPrice(0);
                }}>
                <Text style={styles.closeButtonText}>{t("close")}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: '#F5F5F5',
  },
  openButton: {
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  openButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "droidAr",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  headerContainer: {
    marginBottom: 20,
  },
  selectedText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 5,
    fontFamily: "droidAr",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  progressStep: {
    width: "30%",
    height: 4,
    backgroundColor: "#DDD",
    borderRadius: 2,
  },
  progressStepActive: {
    backgroundColor: "#FF5A5F",
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    color: "#333",
    fontFamily: "droidAr",
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    flexWrap: "wrap",
    gap: 3,
  },
  card: {
    padding: 20,
    backgroundColor: "#F9F9F9",
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginHorizontal: 10,
    width: "43%",
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "droidAr",
  },
  calendar: {
    marginBottom: 20,
  },
  timeSlot: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#F0F0F0",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDD",
  },
  selectedTimeSlot: {
    backgroundColor: "#FF5A5F",
    borderColor: "#FF5A5F",
  },
  timeSlotText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "droidAr",
  },
  closeButton: {
    padding: 15,
    backgroundColor: "#FF5A5F",
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    fontFamily: "droidAr",
  },
});

export default ResirvationTime;
