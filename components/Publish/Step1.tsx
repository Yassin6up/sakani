import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setHomeType, setResetAll, setBuyOrRent } from "@/store/slices/publish";
import {
  farmImg,
  apprtementImg,
  houseImg,
  locationImg,
  chalihat,
  meetingRoom,
  doctor,
  studio,
  superMarket,
  pool,
  gym,
  football,
  meeting,
  tent,
  travel,
} from "../intializeImages";
import { useTranslation } from "react-i18next";
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Shine,
} from "rn-placeholder";

import axios from "axios";
const Step1 = ({ switchStep }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.publishData.value);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch available categories from the backend
    axios
      .get("https://backend.sakanijo.com/categories/slug") // Replace with your backend URL
      .then((response) => {
        setAvailableCategories(response.data.slugs);
        setIsLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        setIsLoading(false); // Set loading to false after data is fetched

        console.error("Error fetching categories:", error);
      });
  }, []);

  // Helper function to check if the category should be displayed
  const isCategoryAvailable = (slug) => {
    return availableCategories.includes(slug);
  };
  const [selectedOption, setSelectedOption] = useState(data.homeType);

  const handleSelect = (option) => {
    setSelectedOption(option);
    dispatch(setHomeType(option));
  };

  const { t } = useTranslation();

  useEffect(() => {
    dispatch(setResetAll());
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("step1Title")}</Text>
      <View style={styles.boxesContainer}>
        {isLoading ? (
          // Render placeholders while loading
          Array(12)
            .fill(null)
            .map((_, index) => (
              <Placeholder
                key={index}
                Animation={Shine}
                style={[styles.box, styles.placeholderBox]}>
                <PlaceholderMedia style={{ width: 24, height: 24 }} />
                <PlaceholderLine width={50} />
              </Placeholder>
            ))
        ) : (
          <>
            {isCategoryAvailable("فيلا / منزل") && (
              <Pressable
                style={[
                  styles.box,
                  data.homeType === "فيلا / منزل" && styles.selectedBox,
                ]}
                onPress={() => {
                  handleSelect("فيلا / منزل");
                  switchStep();
                }}>
                <Image source={houseImg} style={{ width: 24, height: 24 }} />
                <Text style={styles.text}>{t("home")}</Text>
              </Pressable>
            )}

            {isCategoryAvailable("شقة") && (
              <Pressable
                style={[
                  styles.box,
                  data.homeType === "شقة" && styles.selectedBox,
                ]}
                onPress={() => {
                  handleSelect("شقة");
                  switchStep();
                }}>
                <Image
                  source={apprtementImg}
                  style={{ width: 24, height: 24 }}
                />
                <Text style={styles.text}>{t("apartment")}</Text>
              </Pressable>
            )}

            {isCategoryAvailable("مزرعة") && (
              <Pressable
                style={[
                  styles.box,
                  data.homeType === "مزرعة" && styles.selectedBox,
                ]}
                onPress={() => {
                  handleSelect("مزرعة");
                  switchStep();
                }}>
                <Image source={farmImg} style={{ width: 24, height: 24 }} />
                <Text style={styles.text}>{t("agriculture")}</Text>
              </Pressable>
            )}

            {isCategoryAvailable("ارض") && (
              <Pressable
                style={[
                  styles.box,
                  data.homeType === "ارض" && styles.selectedBox,
                ]}
                onPress={() => {
                  handleSelect("ارض");
                  switchStep();
                }}>
                <Image source={locationImg} style={{ width: 24, height: 24 }} />
                <Text style={styles.text}>{t("terrain")}</Text>
              </Pressable>
            )}

            {isCategoryAvailable("شليهات") && (
              <Pressable
                style={[
                  styles.box,
                  data.homeType === "شليهات" && styles.selectedBox,
                ]}
                onPress={() => {
                  handleSelect("شليهات");
                  switchStep();
                }}>
                <Image source={chalihat} style={{ width: 24, height: 24 }} />
                <Text style={styles.text}>{t("houseboat")}</Text>
              </Pressable>
            )}

            {isCategoryAvailable("استوديو") && (
              <Pressable
                style={[
                  styles.box,
                  data.homeType === "استوديو" && styles.selectedBox,
                ]}
                onPress={() => {
                  handleSelect("استوديو");
                  switchStep();
                }}>
                <Image source={studio} style={{ width: 24, height: 24 }} />
                <Text style={styles.text}>{t("studio")}</Text>
              </Pressable>
            )}

            {isCategoryAvailable("محلات ومخازن") && (
              <Pressable
                style={[
                  styles.box,
                  data.homeType === "محلات ومخازن" && styles.selectedBox,
                ]}
                onPress={() => {
                  handleSelect("محلات ومخازن");
                  switchStep();
                }}>
                <Image source={superMarket} style={{ width: 24, height: 24 }} />
                <Text style={styles.text}>{t("shopsAndWarehouses")}</Text>
              </Pressable>
            )}

            {isCategoryAvailable("مكاتب وعيادات") && (
              <Pressable
                style={[
                  styles.box,
                  data.homeType === "مكاتب وعيادات" && styles.selectedBox,
                ]}
                onPress={() => {
                  handleSelect("مكاتب وعيادات");
                  switchStep();
                }}>
                <Image source={doctor} style={{ width: 24, height: 24 }} />
                <Text style={styles.text}>{t("officesAndClinics")}</Text>
              </Pressable>
            )}

            {isCategoryAvailable("مسابح") && (
              <Pressable
                style={[
                  styles.box,
                  data.homeType === "مسابح" && styles.selectedBox,
                ]}
                onPress={() => {
                  handleSelect("مسابح");
                  dispatch(setBuyOrRent("الحجز"));
                  switchStep();
                }}>
                <Image source={pool} style={{ width: 24, height: 24 }} />
                <Text style={styles.text}>{t("swimming_pools")}</Text>
              </Pressable>
            )}

            {isCategoryAvailable("صالات رياضة") && (
              <Pressable
                style={[
                  styles.box,
                  data.homeType === "صالات رياضة" && styles.selectedBox,
                ]}
                onPress={() => {
                  handleSelect("صالات رياضة");
                  dispatch(setBuyOrRent("الحجز"));
                  switchStep();
                }}>
                <Image source={gym} style={{ width: 24, height: 24 }} />
                <Text style={styles.text}>{t("womens_fitness_centers")}</Text>
              </Pressable>
            )}

            {isCategoryAvailable("مخيمات و اكواخ") && (
              <Pressable
                style={[
                  styles.box,
                  data.homeType === "مخيمات و اكواخ" && styles.selectedBox,
                ]}
                onPress={() => {
                  handleSelect("مخيمات و اكواخ");
                  switchStep();
                }}>
                <Image source={tent} style={{ width: 24, height: 24 }} />
                <Text style={styles.text}>{t("camps_and_cabins")}</Text>
              </Pressable>
            )}

            {isCategoryAvailable("قاعات اجتماعات") && (
              <Pressable
                style={[
                  styles.box,
                  data.homeType === "قاعات اجتماعات" && styles.selectedBox,
                ]}
                onPress={() => {
                  handleSelect("قاعات اجتماعات");
                  dispatch(setBuyOrRent("الحجز"));
                  switchStep();
                }}>
                <Image source={meeting} style={{ width: 24, height: 24 }} />
                <Text style={styles.text}>{t("meetingRoomsS")}</Text>
              </Pressable>
            )}

            {isCategoryAvailable("تنضيم رحلات") && (
              <Pressable
                style={[
                  styles.box,
                  data.homeType === "تنضيم رحلات" && styles.selectedBox,
                ]}
                onPress={() => {
                  handleSelect("تنضيم رحلات");
                  dispatch(setBuyOrRent("الحجز"));
                  switchStep();
                }}>
                <Image source={travel} style={{ width: 24, height: 24 }} />
                <Text style={styles.text}>{t("trip_organizing")}</Text>
              </Pressable>
            )}

            {isCategoryAvailable("ملاعب") && (
              <Pressable
                style={[
                  styles.box,
                  data.homeType === "ملاعب" && styles.selectedBox,
                ]}
                onPress={() => {
                  handleSelect("ملاعب");
                  dispatch(setBuyOrRent("الحجز"));
                  switchStep();
                }}>
                <Image source={football} style={{ width: 24, height: 24 }} />
                <Text style={styles.text}>{t("sports_fields")}</Text>
              </Pressable>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: 20,
    fontFamily: "droidAr",
    // textAlign: 'right',
    marginHorizontal: 50,
  },
  boxesContainer: {
    width: "100%",
    marginTop: 20,
    padding: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
  },
  box: {
    padding: 16,
    display: "flex",
    width: "48%",
    borderWidth: 1,
    borderColor: "#dddddd",
    borderStyle: "solid",
    height: 100,
    borderRadius: 8,
    justifyContent: "center",
    gap: 10,
    alignItems: "flex-end",
  },
  text: {
    fontFamily: "droidAr",
  },
  selectedBox: {
    borderColor: "black",
    borderWidth: 2,
  },
  placeholderBox: {
    backgroundColor: "#e0e0e0", // Lighter gray for placeholder background
    borderColor: "#c0c0c0", // Slightly darker gray for border
    borderWidth: 1,
    borderRadius: 12, // Match the border radius of the actual boxes
    height: 100, // Match the height of the actual boxes
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Step1;
