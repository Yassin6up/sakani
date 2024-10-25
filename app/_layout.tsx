import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { View, Text, Modal, Button, Image, StyleSheet, Pressable } from 'react-native';

import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import ModalHeaderText from "@/components/ModalHeaderText";
import { TouchableOpacity } from "react-native";
import { Provider } from "react-redux";
import store from "../store/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { I18nextProvider } from "react-i18next";
import i18n from "../components/i18n";
import * as Network from 'expo-network';
import { useTranslation } from 'react-i18next';
import desconnectImg from "@/assets/images/disconnect.png"
import { useDispatch  } from "react-redux";
import { setReloadConnection } from "@/store/slices/posts";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    droidAr: require("../assets/fonts/droid.ttf"),
  });

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (error) {
      console.error("Font loading error:", error);
      // Handle font loading error if necessary
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('token');
        setToken(storedToken);
      } catch (error) {
        console.error("Error retrieving token:", error);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);


  if (loading || !loaded) {
    // Show a loading indicator while checking for the token or fonts are loading
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <RootLayoutNav token={token} />
        </I18nextProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav({ token }) {
  const router = useRouter();

  const dispatch = useDispatch()
  useEffect(() => {
    if (token) {
      router.replace('(tabs)');
    } else {
      router.replace('login');
    }
  }, [token, router]);
  const { t, i18n } = useTranslation();


  const [isConnected, setIsConnected] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Function to check the network status
  const checkConnection = async () => {
    const networkState = await Network.getNetworkStateAsync();
    console.log(networkState)
    setIsConnected(networkState.isConnected);
    if (networkState.isConnected) {
      setModalVisible(false); // Hide the modal if the connection is good
      dispatch(setReloadConnection())
    } else {
      setModalVisible(true);  // Show the modal if there's no connection
      dispatch(setReloadConnection())

    }
  };

  // Run connection check when app starts
  useEffect(() => {
    checkConnection();
  }, [isConnected]);


  return (
    <>



    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="listing/[id]" options={{ headerTitle: "" }} />
      <Stack.Screen name="services/[id]" options={{ headerTitle: "" }} />
      <Stack.Screen name="updateAds" options={{ headerTitle: ""  , headerBackTitle:"الرجوع"}} />
      <Stack.Screen name="BookCar" options={{ headerTitle: ""  , headerBackTitle:"الرجوع"}} />
      <Stack.Screen name="Filter" options={{ headerTitle: "بحت دقيق"  , headerBackTitle:"الرجوع " , headerTitleStyle:{fontFamily :"droidAr"} }}  />
      <Stack.Screen name="FilterPlace" options={{ headerTitle: "بحت داخل الاردن"  , headerBackTitle:"الرجوع " , headerTitleStyle:{fontFamily :"droidAr"} }}  />

      <Stack.Screen
        name="(modals)/booking"
        options={{
          presentation: "transparentModal",
          animation: "fade",
          headerTransparent: true,
          headerTitle: (props) => <ModalHeaderText />,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: "#fff",
                borderColor: Colors.grey,
                borderRadius: 20,
                borderWidth: 1,
                padding: 4,
              }}
            >
              <Ionicons name="close-outline" size={22} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: "سجل الدخول او انشئ حساب",
          headerTitleStyle: {
            fontFamily: "droidAr",
          },
        }}
      />
      <Stack.Screen
        name="ForgetPasscode"
        options={{
          title: "استرجاع كلمة المرور",
          headerTitleStyle: {
            fontFamily: "droidAr",
          },
          headerBackTitle: 'الرجوع'
        }}
      />
    </Stack>



    <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {}}
        
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Image
              source={desconnectImg} // Add your error image here
              style={styles.errorImage}
            />
            <Text style={styles.modalText}>{t("connectionIsNotGood")}</Text>
            <Pressable
            onPress={checkConnection}
            style={{
              width : "50%" , 
              padding : 10 , 
              justifyContent : "center" ,
              alignItems : "center" ,
              alignSelf : "center" , 
              borderRadius : 10 , 
              backgroundColor : Colors.primary
            }}
            >
              <Text style={{
                fontFamily : "droidAr" , 
                color : 'white'
              }}>{t("refrish")}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    padding: 20,
    width : "100%"  ,
    height : "100%",
    justifyContent : "center",
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  errorImage: {
    aspectRatio : "1/1",
    
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    color: 'red',
    fontFamily : "droidAr" ,
    marginBottom: 20,
    textAlign: 'center',
  },
});