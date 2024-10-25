import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from 'react-i18next';
import moment from 'moment';

const ReservationModal = ({
  visible,
  onClose,
  onSubmit,
  weekDaysObject,
  specifiedDates,
  priceNormal,
  ismultiSelect,
  priceforSpecificDays,
  acceptNight,
  notAllowedDays ,
  myAd
}) => {
  const [step, setStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedDates, setSelectedDates] = useState({});
  const [priceDetails, setPriceDetails] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const weekDaysPrices = weekDaysObject;
  const { t, i18n } = useTranslation();
  moment.locale('en');

const today = moment().format('YYYY-MM-DD'); // Get today's date in Western numerals

console.log("today :",today)

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setStep(2);
  };

  useEffect(() => {
    console.log("notAllowedDays :", notAllowedDays);
  }, []);

  const handleDayPress = (day) => {
    if (notAllowedDays.includes(day.dateString)) {
      return; // Prevent selection of not allowed days
    }

    const newSelectedDates = { ...selectedDates };
    const newPriceDetails = { ...priceDetails };

    if (selectedOption !== "24 Hours") {
      setSelectedDates({
        [day.dateString]: {
          selected: true,
          color: "#FF5A5F",
        },
      });
      setPriceDetails({
        [day.dateString]: getPrice(day.dateString),
      });
    } else {
      if (startDate && endDate) {
        setStartDate(day.dateString);
        setEndDate(null);
        setSelectedDates({
          [day.dateString]: {
            selected: true,
            startingDay: true,
            color: "#FF5A5F",
          },
        });
        setPriceDetails({
          [day.dateString]: getPrice(day.dateString),
        });
      } else if (startDate && !endDate) {
        const isBeforeStartDate = new Date(day.dateString) < new Date(startDate);
        if (isBeforeStartDate) {
          setStartDate(day.dateString);
          setSelectedDates({
            [day.dateString]: {
              selected: true,
              startingDay: true,
              color: "#FF5A5F",
            },
          });
          setPriceDetails({
            [day.dateString]: getPrice(day.dateString),
          });
        } else {
          setEndDate(day.dateString);
          const datesInRange = getDatesInRange(startDate, day.dateString);
          datesInRange.forEach((date) => {
            newSelectedDates[date] = {
              selected: true,
              color: "#FF5A5F",
            };
            newPriceDetails[date] = getPrice(date);
          });
          setSelectedDates(newSelectedDates);
          setPriceDetails(newPriceDetails);
        }
      } else {
        setStartDate(day.dateString);
        setSelectedDates({
          [day.dateString]: {
            selected: true,
            startingDay: true,
            color: "#FF5A5F",
          },
        });
        setPriceDetails({
          [day.dateString]: getPrice(day.dateString),
        });
      }
    }
  };

  const getPrice = (dateString) => {
    const dayOfWeek = new Date(dateString).toLocaleDateString(i18n.language, {
      weekday: "long",

    });

    let objectDays = JSON.parse(specifiedDates)

    if (objectDays && objectDays[dateString]) {
      console.log(dateString)
      console.log(objectDays[dateString])
      return objectDays[dateString];
    } else {
      if(selectedOption === "Day Only"){
        return myAd.priceBeforeNoon
      }else if(selectedOption ===  "Night Only"){
        return myAd.priceAfterNoon
      }else if(selectedOption === "24 Hours"){
        if (weekDaysPrices[dayOfWeek]) {
          return parseInt(weekDaysPrices[dayOfWeek], 10);
        }
        return priceNormal
      }
    }
  };


  const getDatesInRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dates = [];

    let currentDate = startDate;
    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const calculateTotalPrice = () => {
    const total = Object.keys(priceDetails).reduce((sum, date) => {
      return parseInt(sum) + (parseInt(priceDetails[date]) || 0);
    }, 0);
    setTotalPrice(total);
  };

  const renderSelectedDates = () => {
    return Object.keys(selectedDates).map((date) => (
      <View key={date} style={styles.dateDetail}>
        <Text style={styles.dateText}>{t("date")}: {date}</Text>
        <Text style={styles.priceText}>{t("priceTotal")}: JOD {priceDetails[date]}</Text>
      </View>
    ));
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [priceDetails]);

  const renderStep1 = () => (
    <View style={styles.optionContainer}>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => handleOptionSelect("Night Only")}
      >
        <MaterialIcons name="night-shelter" size={24} color="black" />
        <Text style={styles.optionText}>{t("nightOnly")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => handleOptionSelect("Day Only")}
      >
        <MaterialIcons name="wb-sunny" size={24} color="black" />
        <Text style={styles.optionText}>{t("dayOnly")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => handleOptionSelect("24 Hours")}
      >
        <MaterialIcons name="access-time" size={24} color="black" />
        <Text style={styles.optionText}>{t("24Hours")}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <>
      <ScrollView style={styles.calendarContainer}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          ...selectedDates,
          ...notAllowedDays.reduce((acc, date) => {
            acc[date] = { disabled: true, disableTouchEvent: true };
            return acc;
          }, {}),
          ...Object.keys(selectedDates).reduce((acc, date) => {
            if (date < today) {
              acc[date] = { disabled: true, disableTouchEvent: true }; // Disable past dates
            }
            return acc;
          }, {})
        }}
        minDate={today} // Prevent selecting previous dates
        theme={{
          todayTextColor: "#FF5A5F",
          selectedDayBackgroundColor: "#FF5A5F",
          arrowColor: "#FF5A5F",
        }}
      />
      </ScrollView>
      <ScrollView style={styles.detailsContainer}>
        {renderSelectedDates()}
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>{t("totalPrice")}: JOD {totalPrice}</Text>
        </View>
      </ScrollView>
    </>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{t("bookHome")}</Text>
          {step === 1 ? renderStep1() : renderStep2()}
          <TouchableOpacity
            onPress={() => {
              if (step === 1) {
                onClose();
              } else {
                setStep(1);
                setSelectedDates({});
                setPriceDetails({});
                setTotalPrice(0);
              }
            }}
            style={{ ...styles.button, backgroundColor: "transparent" }}
          >
            <Text style={{ ...styles.buttonText, color: "black" }}>
              {step === 1 ? t("close") : t("back")}
            </Text>
          </TouchableOpacity>
          {step === 2 && (
            <TouchableOpacity
              onPress={() => {
                onSubmit({
                  totalPrice,
                  dateSelected: Object.keys(priceDetails),
                  period : selectedOption
                });
                setSelectedDates({});
                setPriceDetails({});
                setTotalPrice(0);
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>{t("confirm")}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  optionContainer: {
    alignItems: "center",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    justifyContent: "center",
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  calendarContainer: {
    marginBottom: 10,
  },
  detailsContainer: {
    maxHeight: 200,
  },
  dateDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  priceText: {
    fontSize: 16,
    color: "#333",
  },
  totalContainer: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
    marginTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  button: {
    backgroundColor: "#FF5A5F",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ReservationModal;
