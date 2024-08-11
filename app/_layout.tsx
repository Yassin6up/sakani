import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter } from "expo-router";
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

  useEffect(() => {
    if (token) {
      router.replace('(tabs)');
    } else {
      router.replace('login');
    }
  }, [token, router]);

  return (
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
  );
}
