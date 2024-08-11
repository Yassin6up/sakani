import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Pressable } from 'react-native';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';
import { Link } from 'expo-router';
import Colors from "../../constants/Colors";

// Sample data mimicking JSON from backend
const servicesData = [
  { id: 1, icon: 'team', text: 'الاشتراكات' },
  { id: 2, icon: 'comments-dollar', text: 'طلب البحث' },
  { id: 3, icon: 'file-contract', text: 'عقود الإيجار' }
];

const Page = () => {
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
          activeDotColor={Colors.primary}
        >
          <View style={styles.slide}>
            <Image
              style={styles.image}
              source={require('../../assets/images/slide1.jpeg')}
              resizeMode="cover"
            />
          </View>
          <View style={styles.slide}>
            <Image
              style={styles.image}
              source={require('../../assets/images/slide2.jpeg')}
              resizeMode="cover"
            />
          </View>
        </Swiper>
      </View>

      <Text style={styles.title}>الخدمات المتوفرة</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
        {servicesData.map(service => (
          <Link key={service.id} href={`/services/${service.id}`} asChild>
            <Pressable style={styles.singleCard}>
              <View style={styles.iconCard}>
                {service.icon === 'team' && <AntDesign name={service.icon} size={24} color={Colors.primary} />}
                {service.icon === 'comments-dollar' && <FontAwesome5 name={service.icon} size={24} color={Colors.primary} />}
                {service.icon === 'file-contract' && <FontAwesome5 name={service.icon} size={24} color={Colors.primary} />}
              </View>
              <Text style={styles.cardText}>{service.text}</Text>
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
    fontFamily: "droidAr"
  },
  singleCard: {
    width: "30%",
    height: 100,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  iconCard: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: "#eee"
  },
  cardText: {
    fontFamily: "droidAr",
  },
  wrapper: {
    height: 150,
    borderRadius: 20,
    overflow: 'hidden',
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    height: "100%"
  },
  image: {
    width: '100%',
    height: "100%",
    borderRadius: 20,
  },
  paginationStyle: {
    bottom: -20,
  },
});

export default Page;
