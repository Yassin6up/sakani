import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Link } from "expo-router"; // Assuming you're using React Router Native
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  ColorSpace,
  FadeInRight,
  FadeOutLeft,
} from "react-native-reanimated";

// import listingsData from '@/assets/data/airbnb-listings.json';
import Colors from "@/constants/Colors";
import axios from "axios";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useTranslation } from "react-i18next";

const Page = () => {
  // const items = useMemo(() => data as any, []);
  const [refresh, setRefresh] = useState<number>(0);
  const { t, i18n } = useTranslation();

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let result = await SecureStore.getItemAsync("userId");

      try {
        const response = await axios.get(
          `https://backend.sakanijo.com/api/user/${result}/likes`
        );
        setData(response.data);
        console.log("data from the favorite page : ", response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderItem = ({ item }: { item: any }) => {
    const photos = item?.photos?.split(",");

    return (
      <Link key={item.id} href={`/listing/${item.id}`} asChild>
        <TouchableOpacity>
          <Animated.View
            style={styles.listing}
            entering={FadeInRight}
            exiting={FadeOutLeft}>
            <Animated.Image
              source={{
                uri: `https://backend.sakanijo.com/api/images/${encodeURIComponent(
                  item.folderName
                )}/${encodeURIComponent(photos[0])}`,
              }}
              style={styles.image}
            />
            <TouchableOpacity
              style={{ position: "absolute", right: 30, top: 30 }}>
              <Ionicons name="heart" size={24} color={Colors.heart} />
            </TouchableOpacity>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 16, fontFamily: "droidAr" }}>
                {item.title}
              </Text>
              <View style={{ flexDirection: "row", gap: 4 }}>
                <Ionicons name="heart" size={16} color={Colors.heart} />
                <Text style={{ fontFamily: "droidAr" }}>{item.heartSave}</Text>
              </View>
            </View>
            <Text style={{ fontFamily: "droidAr" }}>{item.home_type}</Text>
            <View style={{ flexDirection: "row", gap: 4 }}>
              {item.priceHide == false ? (
                <Text style={{ fontFamily: "droidAr" }}>JOD {item.price}</Text>
              ) : (
                <Text style={{ fontFamily: "droidAr" }}>السعر مخفي</Text>
              )}

              {item?.home_type === "مسابح" ||
              item?.home_type === "ملاعب" ||
              item?.home_type === "قاعات اجتماعات" ? (
                <Text style={{ fontFamily: "droidAr" }}>{t("hour")}</Text>
              ) : item?.home_type === "تنضيم رحلات" ? (
                <Text style={{ fontFamily: "droidAr" }}>
                  {t(item?.tripLong)}
                </Text>
              ) : item?.home_type === "صالات رياضة" ? (
                <Text style={{ fontFamily: "droidAr" }}>
                  {item?.subscriptionTypeGym}
                </Text>
              ) : item?.buy_or_rent === "الحجز" ? (
                <Text style={{ fontFamily: "droidAr" }}>{t("night")}</Text>
              ) : null}

              {}
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ flexGrow: 1 }}
    />
  );
};

const styles = StyleSheet.create({
  listing: {
    padding: 16,
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
  },
});

export default Page;
