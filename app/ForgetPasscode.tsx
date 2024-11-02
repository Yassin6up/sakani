import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import Colors from "@/constants/Colors";

const ForgetPasscode = () => {
  const [step, setStep] = useState(1); // 1: Phone Number, 2: Verification Code, 3: New Password
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [receivedCode, setReceivedCode] = useState("");
  const [lastRequestTime, setLastRequestTime] = useState(null);

  function formatPhoneNumber(phoneNumber) {
    const jordanCountryCode = "+962";
    if (!phoneNumber.startsWith(jordanCountryCode)) {
      phoneNumber = jordanCountryCode + phoneNumber;
    }
    return phoneNumber;
  }

  async function saveToken(key, value) {
    await SecureStore.setItemAsync(key, value);
  }

  async function saveLastRequestTime() {
    const currentTime = Date.now().toString();
    console.log("timesaved :",currentTime )

    await SecureStore.setItemAsync("lastRequestTime", currentTime);
  }

  async function getLastRequestTime() {
    const storedTime = await SecureStore.getItemAsync("lastRequestTime");
    if (storedTime) {
      setLastRequestTime(storedTime);
    }
    return storedTime
  }

  const handlePhoneNumberSubmit = async () => {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    // Get last request time and check if 1 minute has passed
    const lastTime = await getLastRequestTime();
    if (lastTime) {
      console.log("timegited :",lastTime )

      const currentTime = Date.now();
      const timeDiff = currentTime - parseInt(lastTime);
      if (timeDiff < 60000) {
        Alert.alert("انتظر", "لقد قمت بالفعل بطلب رمز التحقق. يرجى الانتظار لمدة دقيقة قبل تقديم الطلب مرة أخرى.");
        return;
      }
    }

    try {
      const response = await axios.post(
        "https://backend.sakanijo.com/check-phone",
        { phoneNumber: formattedPhone }
      );

      if (response.data.success) {
        setReceivedCode(response.data.code); // Assuming the backend sends the code
        console.log(response.data.code);
        await saveLastRequestTime(); // Save the timestamp of the request
        console.log("numbersaved")
        setStep(2);
      } else {
        Alert.alert("خطأ", "لم يتم العثور على رقم الهاتف");
      }
    } catch (error) {
      Alert.alert("خطأ", "An error occurred while checking the phone number");
    }
  };
  const handleVerificationSubmit = () => {
    if (verificationCode === receivedCode) {
      setStep(3);
    } else {
      Alert.alert("خطأ", "رمز التحقق غلط ");
    }
  };

  const handleNewPasswordSubmit = async () => {
    const formattedPhone = formatPhoneNumber(phoneNumber);

    try {
      const response = await axios.post(
        "https://backend.sakanijo.com/reset-password-forget",
        { phoneNumber: formattedPhone, newPassword }
      );
      await saveToken("token", response.data.user.session_token.toString());
      await saveToken("userId", response.data.user.id.toString());
      await saveToken("userData", JSON.stringify(response.data.user));
      router.replace("/(tabs)/");
    } catch (error) {
      Alert.alert("خطأ", "An error occurred while resetting the password");
    }
  };

  return (
    <View style={styles.container}>
      {step === 1 && (
        <View style={styles.innerContainer}>
          <Text style={styles.header}>اكتب رقم الهاتف</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <Button
            title="التالي"
            color={Colors.primary}
            onPress={handlePhoneNumberSubmit}

          />
        </View>
      )}
      {step === 2 && (
        <View style={styles.innerContainer}>
          <Text style={styles.header}>ادخل رمز التحقق</Text>
          <TextInput
            style={styles.input}
            placeholder="Verification Code"
            keyboardType="number-pad"
            value={verificationCode}
            onChangeText={setVerificationCode}
          />
          <Button
            title="تحقق"
            color={Colors.primary}
            onPress={handleVerificationSubmit}
          />
        </View>
      )}
      {step === 3 && (
        <View style={styles.innerContainer}>
          <Text style={styles.header}>كلمة السر الجديدة</Text>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <Button
            title={"حفظ"}
            color={Colors.primary}
            onPress={handleNewPasswordSubmit}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    padding: 16,
  },
  innerContainer: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    fontFamily: "droidAr",
  },
  input: {
    height: 48,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});

export default ForgetPasscode;
