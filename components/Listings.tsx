import {
  View,
  Text,
  StyleSheet,
  ListRenderItem,
  TouchableOpacity,
} from "react-native";
import { defaultStyles } from "@/constants/Styles";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { useEffect, useRef, useState } from "react";
import {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
} from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";
import Colors from "@/constants/Colors";

interface Props {
  listings: any[];
  refresh: number;
  category: string;
}

const Listings = ({ listings: items, refresh, category }: Props) => {
  const listRef = useRef<BottomSheetFlatListMethods>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { t, i18n } = useTranslation();

  // Update the view to scroll the list back top
  useEffect(() => {
    if (refresh) {
      scrollListTop();
    }
  }, [refresh]);

  const scrollListTop = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  // Use for "updating" the views data after category changed
  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, [category]);

  // Render one listing row for the FlatList
  const renderRow: ListRenderItem<any> = ({ item }) => {
    const photos = item.photos ? item.photos.split(",") : [];

    return (
      <Link href={`/listing/${item.id}`} asChild>
        <TouchableOpacity>
          <Animated.View
            style={styles.listing}
            entering={FadeInRight}
            exiting={FadeOutLeft}>
            {photos?.length > 0 ? (
              <Animated.Image
                source={{
                  uri: `https://backend.sakanijo.com/api/images/${encodeURIComponent(
                    item.folderName
                  )}/${encodeURIComponent(photos[0])}`,
                }}
                style={styles.image}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text>No Image</Text>
              </View>
            )}

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
              {item.priceHide == 0 ? (
                <Text style={{ fontFamily: "droidAr" }}>JOD {item.price}</Text>
              ) : (
                <Text style={{ fontFamily: "droidAr" }}>
                  {t("hiddenPrice")}
                </Text>
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
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <View style={defaultStyles.container}>
      <BottomSheetFlatList
        renderItem={renderRow}
        data={loading ? [] : items}
        ref={listRef}
        ListHeaderComponent={
          <Text style={styles.info}>
            {items?.length} {t("results")}
          </Text>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>لا توجد بيانات لعرضها</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listing: {
    padding: 16,
    gap: 10,
    marginVertical: 16,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
  },
  info: {
    textAlign: "center",
    fontFamily: "droidAr",
    fontSize: 16,
    marginTop: 4,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 100,
    color: "gray",
    fontSize: 16,
    fontFamily: "droidAr",
  },
});

export default Listings;
