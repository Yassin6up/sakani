import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Colors from "@/constants/Colors";
import { Link, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import axios from "axios"; // Import Axios
import Swiper from "react-native-swiper";
import { ScrollView } from "react-native-gesture-handler";
import ConfirmDeleteModal from "@/components/DeleteModal";

const Page = () => {
  const { t, i18n } = useTranslation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState({});
  const [selectedTab, setSelectedTab] = useState("booking");
  const [ads, setAds] = useState([]);
  const [booking, setBooking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const [refrish, setRefrish] = useState(false);


  useEffect(() => {
    const getUserData = async () => {
      const user = await SecureStore.getItem("userData");
      if (user) {
        const userData = JSON.parse(user);
        setUser(userData);
        setFirstName(userData.name.slice(0, userData.name.indexOf(" ")));
        setLastName(userData.name.slice(userData.name.indexOf(" ")));
      } else {
        router.push("/login");
      }
    };

    getUserData();
  }, []);

  const photosBooking = booking?.photos?.split(',');
  const photoAds = ads?.photos?.split(',');

  const onSaveUser = async () => {
    try {
      const userId = await SecureStore.getItem("userId");
      console.log(userId);
      const response = await axios.post(
        `https://backend.sakanijo.com/user/update-name`,
        {
          name: firstName + " " + lastName,
          id: userId,
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        setUser((prevUser) => ({
          ...prevUser,
          name: `${firstName} ${lastName}`,
        }));
        SecureStore.setItem("userData", JSON.stringify(response.data.user));

        setEdit(false);
      }
    } catch (error) {
      console.error("Error updating user data", error);
    }
  };

  const onCaptureImage = () => {
    // Function to capture image goes here
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "ar" ? "en" : "ar");
  };

  const renderAdItem = ({ item , type}) => (
    <View style={styles.adCard}>
      <Image source={{ uri: `https://backend.sakanijo.com/api/images/${encodeURIComponent(item.folderName)}/${encodeURIComponent( item.photos?.split(',')[0] )}` }} style={styles.adImage} />
      <View style={styles.adButtons}>
        <TouchableOpacity style={styles.adButton} onPress={() => router.navigate("/updateAds?id="+item.id)}>
          <Ionicons name="create-outline" size={24} color={Colors.dark} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.adButton} onPress={()=> setVisible(true)}>
          <Ionicons name="trash-outline" size={24} color={Colors.dark} />
        </TouchableOpacity>
      </View>
      <Text style={styles.adTitle}>{item.title}</Text>

      <ConfirmDeleteModal 
      isVisible={visible}
      onConfirm={async () => {
        try {
          const response = await axios.post(`https://backend.sakanijo.com/delete/places/${item.id}`);
          if (response.status === 200) {
            setRefrish(!refrish)
            setVisible(false)
          }
        } catch (error) {
          console.error('Error deleting place:', error);
        } finally {
        }
        // delete item
        }}
        onClose={()=>{
          setVisible(false)
        }}
      
      


      />
    </View>
  );


  useEffect(() => {
    const fetchPlaces = async () => {
      const ownerId = await SecureStore.getItem("userId");
      console.log(ownerId);
      
      try {
        const response = await axios.get('https://backend.sakanijo.com/profile/places', {
          params: { ownerId }
        });

        console.log(response)
        setAds(response.data.ads);
        setBooking(response.data.booking);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching places:', err);
        setError('Failed to fetch places');
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [refrish]);


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
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{t("profile")}</Text>
      </View>

      <View style={styles.languageSwitchContainer}>
        <TouchableOpacity
          style={[
            styles.languageButton,
            i18n.language === "ar" && styles.activeLanguageButton,
          ]}
          onPress={() => i18n.changeLanguage("ar")}
        >
          <Text
            style={[
              styles.languageButtonText,
              {fontFamily : "droidAr"},

              i18n.language === "ar" && { color: "white" },
            ]}
          >
            {t("arabic")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.languageButton,
            i18n.language === "en" && styles.activeLanguageButton,
          ]}
          onPress={() => i18n.changeLanguage("en")}
        >
          <Text
            style={[
              styles.languageButtonText,
              {fontFamily : "droidAr"},
              i18n.language === "en" && { color: "white" },
            ]}
          >
            {t("english")}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <TouchableOpacity onPress={onCaptureImage}>
          <Image
            source={require("../../assets/images/publisherUsers/2.png")}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <View style={{ flexDirection: "row", gap: 6 , alignSelf : "center" }}>
          {!edit && (
            <View style={styles.editRow}>
              <Text style={{ fontFamily: "droidAr", fontSize: 22 , textAlign : "center" }}>
                {firstName} {lastName}
              </Text>
              <TouchableOpacity onPress={() => setEdit(true)}>
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={Colors.dark}
                />
              </TouchableOpacity>
            </View>
          )}
          {edit && (
            <View style={styles.editRow}>
              <TextInput
                placeholder={t("profile.firstNamePlaceholder")}
                value={firstName}
                onChangeText={setFirstName}
                style={[styles.inputField, { width: 100 }]}
              />
              <TextInput
                placeholder={t("profile.lastNamePlaceholder")}
                value={lastName}
                onChangeText={setLastName}
                style={[styles.inputField, { width: 100 }]}
              />
              <TouchableOpacity onPress={onSaveUser}>
                <Ionicons
                  name="checkmark-outline"
                  size={24}
                  color={Colors.dark}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={{flexDirection:""}} >
        <Text style={{textAlign : "center"}}>{user.phone}</Text>
        </View>
        <Text style={{ fontFamily: "droidAr" , textAlign : "center" }}>
          {t("joined")} {formatDate(user.created)}
        </Text>
      </View>

      
      <Text style={{fontSize : 20 , fontFamily : "droidAr" , textAlign : "center" , marginBottom : 20}}>{t("myAds")}</Text>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "booking" && styles.activeTabButton,
          ]}
          onPress={() => setSelectedTab("booking")}
        >
          <Text
            style={[
              styles.tabButtonText,
              {fontFamily : "droidAr"}
              ,
              selectedTab === "booking" && { color: "white" },
            ]}
          >
            {t("booking")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            
            selectedTab === "ads" && styles.activeTabButton,
          ]}
          onPress={() => setSelectedTab("ads")}
        >
          <Text
            style={[
              styles.tabButtonText,
              {fontFamily : "droidAr"}
              ,
              selectedTab === "ads" && { color: "white" },
            ]}
          >
            {t("ads")}
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === "booking" && (
        <View style={styles.bookingContent}>
          <Swiper style={styles.wrapper} >
          {booking.map((ad) => (
            <View key={ad.id} style={styles.slide}>
              {renderAdItem({ item: ad , type: "ads"  })}
            </View>
          ))}
        </Swiper>
        </View>
      )}

      {selectedTab === "ads" && (
        <Swiper style={styles.wrapper} >
          {ads.map((ad) => (
            <View key={ad.id} style={styles.slide}>
              {renderAdItem({ item: ad , type: "ads" })}
            </View>
          ))}
        </Swiper>
      )}

      <Pressable
        onPress={() => {
          SecureStore.deleteItemAsync("token");
          SecureStore.deleteItemAsync("userData");
          SecureStore.deleteItemAsync("userId");
          router.replace("/login");
        }}
        style={{backgroundColor : Colors.primary , width : "60%" , height : 40 , alignItems : "center" , justifyContent : "center" , marginBottom : 60 , borderRadius : 60 , alignSelf : "center"}}
      >
        <Text style={{color : "white" , fontFamily : "droidAr" , fontSize : 20}}>{t("logout")}</Text>
        </Pressable>

      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingBottom: 24,
  },
  header: {
    fontFamily: "droidAr",
    fontSize: 24,
  },
  languageSwitchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  languageButton: {
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  activeLanguageButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  languageButtonText: {
    fontSize: 16,
    color: Colors.dark,
  },
  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 16,
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent : "center"

  },
  inputField: {
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  tabButton: {
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  activeTabButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabButtonText: {
    fontSize: 16,
    color: Colors.dark,
  },
  bookingContent: {
    alignItems: "center",
  },
  wrapper: {
    height: 300,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  adCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
    padding: 16,
    alignItems: "center",
  },
  adImage: {
    width: 150,
    height: 150,
    borderRadius: 16,
  },
  adButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
  },
  adButton: {
    padding: 8,
    backgroundColor: Colors.lightGrey,
    borderRadius: 8,
  },
  adTitle: {
    marginTop: 8,
    fontFamily: "droidAr",
    fontSize: 18,
  },
});

export default Page;
