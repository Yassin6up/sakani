import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  Entypo,
  AntDesign,
  FontAwesome5,
} from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Link, router } from "expo-router";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Colors from "@/constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { setPlaces } from "@/store/slices/posts";
import * as SecureStore from "expo-secure-store";
import { colors } from "react-native-elements";

interface Props {
  onCategoryChanged: (category: string) => void;
}

const ExploreHeader = ({ onCategoryChanged }: Props) => {
  const places = useSelector((state) => state.places.value.places);
  const [filteredPlaces, setFilteredPlaces] = useState(places);
  const isFilter = useSelector((state) => state.places.value.isFilter);
  const { t } = useTranslation();
  const [categoriesSale, setCategoriesSale] = useState([]);
  const [categoriesRent, setCategoriesRent] = useState([]);
  const [categoriesBooking, setCategoriesBooking] = useState([]);

  const scrollRef = useRef<ScrollView>(null);
  const itemsRef = useRef<Array<TouchableOpacity | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedType, setSelectedType] = useState("للإيجار"); // Default selected type is rent
  const [selectedCategory1, setSelectedCat] = useState("");
  const [placeName, setPlaceName] = useState(t("search"));
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const [apiUrl, setApiUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiUrl = async () => {
      try {
        const storedApiLink = await SecureStore.getItemAsync("apiLink");
        const placeName = await SecureStore.getItemAsync("placeName");
        const savedType = await SecureStore.getItemAsync("selectedType");
        const savedCategory = await SecureStore.getItemAsync(
          "selectedCategory"
        );
        const savedIndexCat = await SecureStore.getItemAsync("selectedIndex");

        if (placeName) {
          setPlaceName(placeName);
        } else {
          setPlaceName(null);
        }

        if (savedType) {
          setSelectedType(savedType);
        }

        if (savedCategory) {
          setSelectedCat(savedCategory);
        }

        if (savedIndexCat) {
          setActiveIndex(+savedIndexCat);
        }

        if (storedApiLink) {
          setApiUrl(storedApiLink);
        } else {
          setApiUrl(null);
        }

        if (isFilter == false) {
          if (savedCategory && savedType) {
            fetchData(savedCategory, savedType);
          }
        }
      } catch (err) {
        console.error("Error fetching API URL or saved data:", err);
      }
    };

    fetchApiUrl();
  }, [isFilter]);

  const selectCategory = async (index: number, type: string) => {
    const selected = itemsRef.current[index];

    console.log(index);

    setActiveIndex(index);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const categoryList =
      type === "للإيجار"
        ? categoriesRent
        : type === "للبيع"
        ? categoriesSale
        : categoriesBooking;

    const selectedCategory = categoryList[index].slug;
    onCategoryChanged(selectedCategory);
    setSelectedCat(selectedCategory);

    console.log("catrgory :", selectedCategory);
    console.log("type :", type);
    // Save selected category and type in Secure Store
    SecureStore.setItem("selectedCategory", selectedCategory);
    SecureStore.setItem("selectedType", type);
    SecureStore.setItem("selectedIndex", index.toString());

    fetchData(selectedCategory, type);
  };

  const fetchData = async (category: string, type: string) => {
    console.log("start fetching");
    if (apiUrl !== null) {
      try {
        const response = await axios.get(apiUrl);
        let data = response.data.places;
        const filteredData = data.filter(
          (ele) =>
            (ele.home_type === category || category === "الكل") &&
            ele.buy_or_rent === type
        );
        console.log("type is:", type);
        console.log("category is:", category);
        console.log("filtered data:", filteredData);

        // Update the state with the fetched places data
        dispatch(setPlaces(filteredData));
      } catch (error) {
        console.error("Error fetching data from API:", error);
      }
    } else {
      const url = `https://test.sakanijo.com/api/places?category=${category}&type=${type}`;
      try {
        const response = await axios.get(url);
        console.log("Data fetched successfully:", response.data.places);
        dispatch(setPlaces(response.data.places));
        setFilteredPlaces(response.data.places);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    // Fetch categories from backend
    axios
      .get("https://test.sakanijo.com/categories/all") // Replace with your backend URL
      .then((response) => {
        console.log(response);
        // Destructure the response data
        const { categoriesSale, categoriesRent, categoriesBooking } =
          response.data;

        // Set the states
        setCategoriesSale(categoriesSale);
        setCategoriesRent(categoriesRent);
        setCategoriesBooking(categoriesBooking);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setLoading(false);
      });
  }, []);

  const renderCategories = (type: string) => {
    const categoryList =
      type === "للإيجار"
        ? categoriesRent
        : type === "للبيع"
        ? categoriesSale
        : categoriesBooking;

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }
    return categoryList.map((item, index) => (
      <TouchableOpacity
        ref={(el) => (itemsRef.current[index] = el)}
        key={index}
        style={
          activeIndex === index
            ? styles.categoriesBtnActive
            : styles.categoriesBtn
        }
        onPress={() => selectCategory(index, type)}>
        <MaterialIcons
          name={item.icon}
          size={24}
          color={activeIndex === index ? "#000" : "#BDBDBD"}
        />
        <Text
          style={
            activeIndex === index
              ? styles.categoryTextActive
              : styles.categoryText
          }>
          {t(item.name)}
        </Text>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={[styles.container, { zIndex: 100000, position: "absolute" }]}>
      <View style={{ ...styles.actionRow, marginTop: 20 }}>
        <Link href={"/FilterPlace"} asChild>
          <TouchableOpacity>
            <View style={styles.searchBtn}>
              <Ionicons name="search" size={24} />
              <View>
                <Text style={{ fontFamily: "droidAr" }}>
                  {placeName || t("search")}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Link>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => {
            router.navigate(`/Filter?type=${selectedCategory1}`);
          }}>
          <Ionicons name="options-outline" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.MainFilter}>
        <View style={styles.filterRow}>
          <Pressable
            style={styles.rowChild}
            onPress={() => {
              setSelectedType("للإيجار");

              fetchData(selectedCategory1, "للإيجار");
            }}>
            <Text
              style={
                selectedType === "للإيجار"
                  ? {
                      ...styles.filterText,
                      color: Colors.primary,
                      fontWeight: "bold",
                    }
                  : styles.filterText
              }>
              {t("rent")}
            </Text>
            <FontAwesome5
              name="door-open"
              size={20}
              color={selectedType === "للإيجار" ? Colors.primary : "#BDBDBD"}
            />
          </Pressable>
          <View style={styles.beforElement}></View>
          <Pressable
            style={styles.rowChild}
            onPress={() => {
              setSelectedType("للبيع");

              fetchData(selectedCategory1, "للبيع");
            }}>
            <Text
              style={
                selectedType === "للبيع"
                  ? {
                      ...styles.filterText,
                      color: Colors.primary,
                      fontWeight: "bold",
                    }
                  : styles.filterText
              }>
              {t("sell")}
            </Text>
            <Entypo
              name="key"
              size={20}
              color={selectedType === "للبيع" ? Colors.primary : "#BDBDBD"}
            />
          </Pressable>
          <View style={styles.beforElement}></View>
          <Pressable
            style={styles.rowChild}
            onPress={() => {
              setSelectedType("الحجز");

              fetchData(selectedCategory1, "الحجز");
            }}>
            <Text
              style={
                selectedType === "الحجز"
                  ? {
                      ...styles.filterText,
                      color: Colors.primary,
                      fontWeight: "bold",
                    }
                  : styles.filterText
              }>
              {t("booking")}
            </Text>
            <AntDesign
              name="calendar"
              size={20}
              color={selectedType === "الحجز" ? Colors.primary : "#BDBDBD"}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}
        contentContainerStyle={{
          alignItems: "center",
          backgroundColor: "transparent",
          gap: 20,
          paddingHorizontal: 16,
          zIndex: 600000,
        }}>
        {renderCategories(selectedType)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    zIndex: 1000,
    elevation: 2,
    width: "100%",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    direction: "rtl",
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 16,
    width: "100%",
    gap: 10,
  },
  MainFilter: {
    width: "100%",
  },

  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 50,
  },

  filterText: {
    fontSize: 16,
    fontFamily: "droidAr",
    color: "#000",
  },
  rowChild: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },

  beforElement: {
    height: "80%",
    width: 1,
    backgroundColor: "#BDBDBD",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBtn: {
    backgroundColor: "#fff",
    flexDirection: "row",
    gap: 10,
    padding: 14,
    alignItems: "center",
    width: 280,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#c2c2c2",
    borderRadius: 30,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  filterBtn: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#A2A0A2",
    borderRadius: 24,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: "droidAr",
    color: "#BDBDBD",
  },
  categoryTextActive: {
    fontSize: 14,
    fontFamily: "droidAr",
    color: "#000",
  },
  categoriesBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 8,
  },
  categoriesBtnActive: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: "#000",
    borderBottomWidth: 2,
    paddingBottom: 8,
  },
});

export default ExploreHeader;
