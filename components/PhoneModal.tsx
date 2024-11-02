import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  StyleSheet,
  Alert,
  Pressable,
  ActivityIndicator,
} from "react-native";
import Colors from "@/constants/Colors";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { MaterialIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

const PhoneModal = ({ visible, onClose, userId, updateUserPhone }) => {
  const { t } = useTranslation();
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(null);
  const [resendEnabled, setResendEnabled] = useState(true);

  useEffect(() => {
    if (visible) {
      setNewPhoneNumber("");
      setCode("");
      setIsVerifying(false);
      setLoading(false);
      setLastRequestTime(null);
      setResendEnabled(true);
    }
  }, [visible]);

  function formatPhoneNumber(phoneNumber) {
    const jordanCountryCode = "+962";
    if (!phoneNumber.startsWith(jordanCountryCode)) {
      phoneNumber = jordanCountryCode + phoneNumber;
    }
    return phoneNumber;
  }

  const saveLastRequestTime = async () => {
    const currentTime = Date.now().toString();
    await SecureStore.setItemAsync("lastRequestTime", currentTime);
    setLastRequestTime(currentTime);
  };

  const getLastRequestTime = async () => {
    const storedTime = await SecureStore.getItemAsync("lastRequestTime");
    if (storedTime) {
       setLastRequestTime(storedTime);
    }
    return  storedTime ;
  };

  const canRequestVerification = (lsT) => {
    if (!lsT) return true;
    const currentTime = Date.now();
    const timeDiff = currentTime - parseInt(lsT);
    return timeDiff >= 60000; 
  };

  const handlePhoneSubmit = async () => {
    if (code !== verificationCode) {
      Alert.alert(t("Error"), t("Invalid code"));
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `https://backend.sakanijo.com/user/update-phone`,
        {
          phone: formatPhoneNumber(newPhoneNumber),
          id: userId,
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        setCode("");
        Alert.alert(t("تم بنجاح"), t("تم تحديث رقم الهاتف بنجاح"));
        onClose(newPhoneNumber); // Close the modal after success
      }
    } catch (error) {
      console.error("Error updating phone number", error);
      Alert.alert(
        t("خطأ"),
        t("فشل تحديث رقم الهاتف. يرجى المحاولة مرة أخرى.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async () => {
    if (!newPhoneNumber) {
      return;
    }
    const lastTime = await getLastRequestTime(); // Get last request time

    if (!canRequestVerification(lastTime)) {
      Alert.alert(t("انتظر"), t("يرجى الانتظار قبل طلب رمز التحقق الجديد."));
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `https://backend.sakanijo.com/user/phone-verification`,
        {
          phone: formatPhoneNumber(newPhoneNumber),
          id: userId,
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        setIsVerifying(true);
        setResendEnabled(false);
        setVerificationCode(response.data.code);
        await saveLastRequestTime(); // Save the current request time
        setTimeout(() => setResendEnabled(true), 25000); // Enable resend after 25 seconds
      }
    } catch (error) {
      console.error("Error verifying phone number", error);
      Alert.alert(t("خطأ"), t("فشلت عملية التحقق. يرجى المحاولة مرة أخرى."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Pressable
          style={{ position: "absolute", top: 60, left: 50 }}
          onPress={() => {
            onClose();
          }}
        >
          <MaterialIcons name="arrow-back-ios" size={25} />
        </Pressable>
        <View style={styles.modalContent}>
          {!isVerifying ? (
            <>
              <Text style={styles.modalTitle}>{t("Enter new phone number")}</Text>
              <TextInput
                style={styles.phoneInput}
                value={newPhoneNumber}
                onChangeText={setNewPhoneNumber}
                placeholder={t("phonePlaceholder")}
                keyboardType="phone-pad"
              />
              <Pressable
                style={[styles.button, loading && styles.disabledButton]}
                onPress={handleVerificationSubmit}
                disabled={loading || !resendEnabled}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.buttonText}>{t("next")}</Text>
                )}
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.modalTitle}>{t("Enter verification code")}</Text>
              <TextInput
                style={styles.phoneInput}
                value={code}
                onChangeText={setCode}
                placeholder={t("codePlaceholder")}
                keyboardType="number-pad"
              />
              <Pressable
                style={[styles.button, loading && styles.disabledButton]}
                onPress={handlePhoneSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.buttonText}>{t("Confirm")}</Text>
                )}
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "droidAr",
    marginBottom: 10,
  },
  phoneInput: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark,
    marginBottom: 20,
    padding: 10,
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: Colors.primary,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: Colors.lightGray,
  },
  buttonText: {
    color: "white",
    fontFamily: "droidAr",
    fontSize: 16,
  },
});

export default PhoneModal
