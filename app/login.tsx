import Colors from "@/constants/Colors";
import { Ionicons, MaterialCommunityIcons, MaterialIcons, Zocial } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import CustomAlert from "@/components/Alert";
// https://github.com/clerkinc/clerk-expo-starter/blob/main/components/OAuth.tsx
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { defaultStyles } from "@/constants/Styles";

import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import VerificationModal from "@/components/VerificationPhone";

const Page = () => {
  useWarmUpBrowser();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [phoneRegister, setPhoneRegister] = useState("");
  const [nameRegister, setNameRegister] = useState("");

  const [passwordRegister, setPasswordRegister] = useState("");

  const [alertVisible, setAlertVisible] = useState(false);
  const [msg, setMsg] = useState("");
  const [icon, setIcon] = useState("warning");
  const [pageState, setPageState] = useState("login");

  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => setModalVisible(true);
  const handleCloseModal = () => setModalVisible(false);

  function formatPhoneNumber(phoneNumber) {
    const jordanCountryCode = "+962";
    if (!phoneNumber.startsWith(jordanCountryCode)) {
      phoneNumber = jordanCountryCode + phoneNumber;
    }
    return phoneNumber;
  }

  // Function to save the token securely
  async function saveToken(key, value) {
    console.log(value);
    await SecureStore.setItemAsync(key, value);
  }

  // Function to login with phone number and password
  async function login(phoneNumber, password) {
    try {
      const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

      console.log("phone sended :", formattedPhoneNumber);
      console.log("pass sended :", password);
      // Send the phone number and password to the backend
      const response = await axios.post("https://backend.sakanijo.com/login", {
        phone: formattedPhoneNumber,
        password: password,
      });

      // Check if the login was successful and token is received
      if (response.data && response.data.sessionToken) {
        // Store the token securely
        console.log("Login successful and token saved!");
        console.log(response.data);
        await saveToken("token", response.data.sessionToken);
        await saveToken("userId", response.data.user.id.toString());
        await saveToken("userData", JSON.stringify(response.data.user));

        router.replace("/(tabs)/");
        // setIcon("check")
      } else if (response.data.userId) {
        // sent verfication code
        handleOpenModal();
      } else {
        console.log("somthing else");
      }
    } catch (error) {
      setIcon("error");

      setAlertVisible(true);
      setMsg(error.response.data.message);
      console.log(error.response.data.message);
      console.error("Error during login:", error);
    }
  }

  const handleSubmitCode = async (code) => {
    try {
      let formattedPhoneNumber = "";
      if (pageState == "login") {
        formattedPhoneNumber = formatPhoneNumber(phone);
      } else {
        formattedPhoneNumber = formatPhoneNumber(phoneRegister);
      }

      const response = await fetch(
        "https://backend.sakanijo.com/verify-phone",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, phone: formattedPhoneNumber }),
        }
      );
      const result = await response.json();
      console.log("result :", result);
      if (result.user) {
        setIcon("check");
        setAlertVisible(true);
        setMsg(result.message);
        // await saveToken('token', result.user.session_token);
        // setPageState("login")
        // router.replace("/(tabs)/")
      } else {
        setAlertVisible(true);
        setMsg(result.message);
      }
    } catch (error) {
      setIcon("error");

      setAlertVisible(true);
      setMsg("An error occurred. Please try again.");
    } finally {
      handleCloseModal();
    }
  };

  useEffect(() => {
    let timer;
    if (alertVisible) {
      timer = setTimeout(() => {
        setAlertVisible(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [alertVisible]);

  async function register(phoneNumber, password, name) {
    try {
      const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
      console.log("phone sended :", formattedPhoneNumber);
      console.log("pass sended :", password);
      // Send the phone number and password to the backend
      const response = await axios.post(
        "https://backend.sakanijo.com/register",
        {
          phone: formattedPhoneNumber,
          password: password,
          name: name,
        }
      );

      // Check if the login was successful and token is received
      if (response.data && response.data.user) {
        // Store the token securely
        console.log("Login successful and token saved!");
        console.log(response.data);
        setIcon("check");
        handleOpenModal();
      } else {
        console.log("somthing else");
      }
    } catch (error) {
      setIcon("error");

      setAlertVisible(true);
      setMsg(error.response.data.message);
      console.error("Error during login:", error);
    }
  }

  return (
    <View style={styles.container}>
      {pageState === "login" ? (
        <>
          <TextInput
            autoCapitalize="none"
            placeholder="رقم الهاتف"
            keyboardType="phone-pad"
            style={[
              defaultStyles.inputField,
              { marginBottom: 30, fontFamily: "droidAr" },
            ]}
            onChangeText={(text) => setPhone(text)}
          />
          <TextInput
            autoCapitalize="none"
            placeholder="كلمة المرور"
            textContentType="password"
            secureTextEntry
            style={[
              defaultStyles.inputField,
              { marginBottom: 30, fontFamily: "droidAr" },
            ]}
            onChangeText={(text) => setPassword(text)}
          />
          <Pressable onPress={() => router.navigate("/ForgetPasscode")}>
            <Text
              style={{
                fontFamily: "droidAr",
                color: "blue",
                padding: 10,
                fontSize: 14,
              }}>
              هل نسيت كلمة المرور ؟
            </Text>
          </Pressable>
          <TouchableOpacity
            style={defaultStyles.btn}
            onPress={() => {
              login(phone, password);
            }}>
            <Text style={{ ...defaultStyles.btnText, fontFamily: "droidAr" }}>
              تسجيل الدخول
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            autoCapitalize="none"
            placeholder="الاسم الكامل"
            keyboardType="name-phone-pad"
            style={[
              defaultStyles.inputField,
              { marginBottom: 30, fontFamily: "droidAr" },
            ]}
            textContentType="name"
            onChangeText={(text) => setNameRegister(text)}
          />
          <TextInput
            autoCapitalize="none"
            placeholder="رقم الهاتف"
            keyboardType="phone-pad"
            style={[
              defaultStyles.inputField,
              { marginBottom: 30, fontFamily: "droidAr" },
            ]}
            onChangeText={(text) => setPhoneRegister(text)}
          />
          <TextInput
            autoCapitalize="none"
            placeholder="كلمة المرور"
            textContentType="password"
            secureTextEntry
            style={[
              defaultStyles.inputField,
              { marginBottom: 30, fontFamily: "droidAr" },
            ]}
            onChangeText={(text) => setPasswordRegister(text)}
          />
          <TouchableOpacity
            style={defaultStyles.btn}
            onPress={() => {
              register(phoneRegister, passwordRegister, nameRegister);
            }}>
            <Text style={{ ...defaultStyles.btnText, fontFamily: "droidAr" }}>
              انشاء حساب
            </Text>
          </TouchableOpacity>
        </>
      )}

      <View style={styles.seperatorView}>
        <View
          style={{
            flex: 1,
            borderBottomColor: "black",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />

        <Text style={styles.seperator}>او</Text>

        <View
          style={{
            flex: 1,
            borderBottomColor: "black",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
      </View>

      <View style={{ gap: 20 }}>
        {pageState == "login" ? (
          <TouchableOpacity
            style={styles.btnOutline}
            onPress={() => {
              setPageState("register");
            }}>
            <Ionicons
              name="phone-portrait-outline"
              size={24}
              style={defaultStyles.btnIcon}
            />
            <Text style={styles.btnOutlineText}>انشاء حساب برقم الهاتف</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.btnOutline}
            onPress={() => {
              setPageState("login");
            }}>
            <Ionicons name="log-in" size={24} style={defaultStyles.btnIcon} />
            <Text style={styles.btnOutlineText}>تسجيل الدخول</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
            style={styles.btnOutline}
            onPress={() => {
              if(router.canGoBack()){
                router.back()
              }else{
                router.replace("/(tabs)/")
              }
            }}>
            <Zocial name="guest" size={24} style={defaultStyles.btnIcon} />
            <Text style={styles.btnOutlineText}>تسجيل الدخول كضيف</Text>
          </TouchableOpacity>

      <CustomAlert
        icon={icon} // Use any icon name from Material Icons
        message={msg}
        visible={alertVisible}
      />

      <VerificationModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSubmit={handleSubmitCode}
      />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 26,
  },

  seperatorView: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginVertical: 30,
  },
  seperator: {
    fontFamily: "droidAr",
    color: Colors.grey,
    fontSize: 16,
  },
  btnOutline: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.grey,
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    marginTop : 20
  },
  btnOutlineText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "droidAr",
  },
});
