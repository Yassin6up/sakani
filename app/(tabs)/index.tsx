import { View, Text, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import ListingsBottomSheet from "@/components/ListingsBottomSheet";
import ListingsMap from "@/components/ListingsMap";
import ExploreHeader from "@/components/ExploreHeader";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPlaces, setFilter } from "@/store/slices/posts";
import * as SecureStore from "expo-secure-store";
import Colors from "@/constants/Colors";
import { useTranslation } from "react-i18next";

const Page = () => {
  const items = useSelector((state) => state.places.value.places);
  const isFilter = useSelector((state) => state.places.value.isFilter);
  const [apiUrl, setApiUrl] = useState("");
  const [placesSavedData, setSavedPlaces] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Fetch the API URL from SecureStore
  useEffect(() => {
    const fetchApiUrl = async () => {
      try {
        const storedApiLink = await SecureStore.getItemAsync("apiLink");
        const placesSaved = await SecureStore.getItemAsync("places");

        if (storedApiLink || placesSaved) {
          if (!placesSaved) {
            setApiUrl(storedApiLink);
          } else {
            const data = JSON.parse(placesSaved);
            setSavedPlaces(data);
          }
          dispatch(setFilter(true));
        } else {
          setApiUrl(
            "https://backend.sakanijo.com/api/places?category=الكل&type=للإيجار"
          ); // Set to an empty string to avoid unnecessary fetch
          dispatch(setFilter(false));
        }
      } catch (err) {
        console.error("Error fetching API URL:", err);
      }
    };

    fetchApiUrl();
  }, [dispatch, isFilter]);

  // Fetch data from the API URL only if it's set
  useEffect(() => {
    if (placesSavedData) {
      console.log("placesSavedData", placesSavedData);
      dispatch(setPlaces(placesSavedData));
      return;
    }

    if (!apiUrl) return; // Exit if apiUrl is empty

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("api url : ", apiUrl);
        const response = await axios.get(apiUrl);
        console.log("response:", response.data.places);

        // Update the state with the fetched places data
        dispatch(setPlaces(response.data.places));
      } catch (err) {
        console.error("Error fetching places:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, dispatch, placesSavedData]);

  const [category, setCategory] = useState<string>("Tiny homes");

  const onDataChanged = (category: string) => {
    setCategory(category);
  };

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <ExploreHeader onCategoryChanged={onDataChanged} />
      {isFilter ? (
        <Pressable
          style={{
            width: 60,
            height: 60,
            borderRadius: 50,
            backgroundColor: Colors.primary,
            position: "absolute",
            top: 200,
            right: 10,
            zIndex: 10000000,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={async () => {
            await SecureStore.deleteItemAsync("apiLink");
            await SecureStore.deleteItemAsync("mapData");
            await SecureStore.deleteItemAsync("places");
            await SecureStore.deleteItemAsync("placeName");
            dispatch(setFilter(false));
            setSavedPlaces(null);
            setApiUrl(""); // Reset API URL to an empty string
          }}>
          <Text
            style={{
              fontFamily: "droidAr",
              color: "white",
              fontSize: 10,
            }}>
            {t("clearFilter")}
          </Text>
        </Pressable>
      ) : null}

      <ListingsMap listings={items} />
      <ListingsBottomSheet listings={items} category={category} />
    </View>
  );
};

export default Page;
