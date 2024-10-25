import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import { Link, router } from "expo-router";
import Colors from "../../constants/Colors";
import axios from "axios";
// Sample data mimicking JSON from backend
const servicesData = [
  { id: 1, icon: "team", text: "الاشتراكات" },
  { id: 2, icon: "comments-dollar", text: "طلب البحث" },
  { id: 3, icon: "file-contract", text: "عقود الإيجار" },
];

const Page = () => {
  const [slides, setSlides] = useState([]);
  const [services, setServices] = useState([]);

  // Fetch all slides when component mounts
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get(
          "https://backend.sakanijo.com/api/slides"
        ); // Fetch slides from the backend
        setSlides(response.data);
      } catch (error) {
        console.log("Error fetching slides:", error);
      } finally {
      }
    };

    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "https://backend.sakanijo.com/api/services"
        ); 
        setServices(response.data.services);
      } catch (error) {
        console.log("Error fetching slides:", error);
      } finally {
      }
    };

    fetchServices()
    fetchSlides();
  }, []); // Empty dependency array to run only once on component mount

  return (
    <ScrollView>
      <View style={{ margin: 20 }}>
        <Swiper
          style={styles.wrapper}
          showsButtons={false}
          autoplay={true}
          autoplayTimeout={4}
          centerContent={true}
          paginationStyle={styles.paginationStyle}
          activeDotColor={Colors.primary}>
          {slides.map((slide) => {
            return (
              <Pressable
              onPress={()=>{
                if(slide.serviceId != "0"){
                  router.navigate(`/services/${slide.serviceId}`)
                }
              }}
              style={styles.slide}>
                <Image
                  style={styles.image}
                  src={`https://backend.sakanijo.com/api/slides/single/${slide.file_path}`}
                  resizeMode="cover"
                />
              </Pressable>
            );
          })}
        </Swiper>
      </View>

      <Text style={styles.title}>الخدمات المتوفرة</Text>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "center",
        }}>
        {services?.map((service) => (
          <Link key={service.id} href={`/services/${service.service_id}`} asChild>
            <Pressable style={styles.singleCard}>
              <View style={styles.iconCard}>
              <Image 
              source={{ uri: `https://backend.sakanijo.com/api/icons/single/${service.icon}` }} 
              style={{ width: 80, height: 80, borderRadius: 40 }} 
              resizeMode="contain" // or "cover"
            />
              </View>
              <Text style={styles.cardText}>{service.title}</Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    padding: 20,
    fontFamily: "droidAr",
  },
  singleCard: {
    width: "30%",
    gap : 10 ,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  
  cardText: {
    fontFamily: "droidAr",
    fontSize: 17 , 
    textAlign : "center"
  },
  wrapper: {
    height: 150,
    borderRadius: 20,
    overflow: "hidden",
  },
  slide: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  paginationStyle: {
    bottom: -20,
  },
});

export default Page;
