import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Modal,
  Linking,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import Step1 from "../../components/Publish/Step1";
import Step2 from "@/components/Publish/Step2";
import Step3 from "@/components/Publish/Step3";
import Step4 from "@/components/Publish/Step4";
import Step5 from "@/components/Publish/Step5";
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import { useSelector, useDispatch } from "react-redux";
import { setResetAll } from "@/store/slices/publish";
import LottieView from "lottie-react-native";
import SuccessModal from "@/components/AddedPlaceModal";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import * as SecureStore from "expo-secure-store";
import { setGlobalFilter } from "@/store/slices/posts";
const Page = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [addedSeccess, setCorrectAdd] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible1, setModalVisible1] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const data = useSelector((state) => state.publishData.value);
  const dispatch = useDispatch();

  const { height } = Dimensions.get("window");

  const handleNext = () => {
    if (currentStep === 3) {
      if (
        data.homeType === "شقة" ||
        data.homeType == "مكاتب وعيادات" ||
        data.homeType == "استوديو"
      ) {
        if (
          !data.numberOfHomeStage ||
          !data.totalStages ||
          !data.spaceGeneral
        ) {
          Alert.alert("يرجى تعبئة بيانات المنزل");
        } else {
          setCurrentStep(currentStep + 1);
        }
      } else if (data.homeType == "فيلا / منزل" || data.homeType == "شليهات") {
        if (!data.spaceGeneral) {
          Alert.alert("يرجى تعبئة بيانات المنزل");
        } else {
          setCurrentStep(currentStep + 1);
        }
      } else if (data.homeType === "مزرعة") {
        if (
          !data.farmHasHouse ||
          !data.farmHasWater ||
          !data.farmHasFarmed ||
          !data.spaceGeneral
        ) {
          Alert.alert("يرجى تعبئة بيانات المزرعة");
        } else {
          setCurrentStep(currentStep + 1);
        }
      } else if (data.homeType === "ارض") {
        if (!data.landInFaceOfStreet || !data.spaceGeneral) {
          Alert.alert("يرجى تعبئة بيانات الأرض");
        } else {
          setCurrentStep(currentStep + 1);
        }
      } else if (
        data.homeType === "مسابح" ||
        data.homeType === "صالات رياضة" ||
        data.homeType == "قاعات اجتماعات" ||
        data.homeType == "ملاعب" ||
        data.homeType == "محلات ومخازن" ||
        data.homeType == "مخيمات و اكواخ"
      ) {
        if (!data.spaceGeneral) {
          Alert.alert("يرجى تعبئة بيانات");
        } else {
          setCurrentStep(currentStep + 1);
        }
      } else if (data.homeType === "تنضيم رحلات") {
        setCurrentStep(currentStep + 1);
      }

      if (data.amenities.length === 0) {
        Alert.alert("يرجى تعبئة المرافق");
      }
    } else if (currentStep === 4) {
      if (data.images.length === 0) {
        Alert.alert("يرجى إضافة الصور");
      } else {
        setCurrentStep(currentStep + 1);
      }
    } else if (currentStep === 5) {
      if (
        !data.title ||
        !data.description ||
        !data.price ||
        data.price == "0"
      ) {
        Alert.alert("يرجى تعبئة العنوان والوصف أو السعر");
      } else {
        if (data.homeType == "فيلا / منزل" || data.homeType == "شقة") {
          if (!data.buyOrRent) {
            Alert.alert("يرجى تعبئة نوع الشراء");
          } else {
            if (data.homeType == "مسابح") {
              if (!data.poolDocument) {
                Alert.alert("يرجى إضافة المستندات");
              }
            } else if (data.homeType == "شليهات") {
              if (!data.chaletDocument) {
                Alert.alert("يرجى إضافة المستندات");
              }
            } else {
              setCurrentStep(currentStep + 1);
            }
          }
        }
      }
    } else if (currentStep === 2) {
      if (data.address === "" || data.longitude === 0 || data.latitude === 0) {
        Alert.alert("يرجى تعبئة العنوان");
      } else {
        setCurrentStep(currentStep + 1);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const totalSteps = 5;

  const uriToBlob = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const toggleModal = () => {
    setModalVisible1(!isModalVisible1);
    setCorrectAdd(false);
    dispatch(setResetAll());
    setCurrentStep(1);
    router.push("/(tabs)/");
  };

  const handlePublish = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    const user = await SecureStore.getItem("userData");

    if (!data.title || !data.description || !data.price) {
      Alert.alert("يرجى تعبئة العنوان والوصف أو السعر");
      setIsSubmitting(false);
      return;
    }

    if (user) {
      const userData = JSON.parse(user);
      formData.append("ownerId", userData.id);
      formData.append("ownerPhone", userData.phone);
      formData.append("ownerName", userData.name);
    }
    setLoading(true);

    // Append non-image data
    for (const key in data) {
      if (
        key !== "images" &&
        key !== "poolDocument" &&
        key !== "chaletDocument"
      ) {
        if (typeof data[key] === "object" && data[key] !== null) {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      }
    }

    // Append images array
    for (let i = 0; i < data.images.length; i++) {
      const image = data.images[i];
      const file = {
        uri: image.uri,
        type: image.mimeType,
        name: image.fileName,
      };
      formData.append(`images`, file);
    }

    // Append chaletDocument
    if (data.chaletDocument) {
      const chaletFile = {
        uri: data.chaletDocument.uri,
        type: data.chaletDocument.mimeType,
        name: data.chaletDocument.fileName,
      };
      formData.append("chaletDocument", chaletFile);
    }

    // Append poolDocument
    if (data.poolDocument) {
      console.log("pool Doculment", data.poolDocument);
      const poolFile = {
        uri: data.poolDocument.uri,
        type: data.poolDocument.mimeType,
        name: data.poolDocument.fileName,
      };
      formData.append("poolDocument", poolFile);
    }

    console.log("start inserting ");
    try {
      const response = await axios.post(
        "https://backend.sakanijo.com/api/places/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch(setGlobalFilter());
      setLoading(false);
      setCorrectAdd(true);
      setModalVisible1(true);

      setModalVisible(false);
      setIsSubmitting(false);
    } catch (error) {
      setLoading(false);
      setCorrectAdd(false);
      setIsSubmitting(false);
      console.error("Error sending data:", error);
    }
  };

  const openTermsAndPolicy = () => {
    Linking.openURL("https://sakanijo.com/policy");
  };

  return (
    <>
      <ScrollView style={styles.container}>
        {currentStep === 1 && <Step1 switchStep={handleNext} />}
        {currentStep === 2 && <Step2 />}
        {currentStep === 3 && <Step3 />}
        {currentStep === 4 && <Step4 />}
        {currentStep === 5 && <Step5 />}
      </ScrollView>

      <View style={styles.navigation}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={{ fontFamily: "droidAr" }}>{t("back")}</Text>
          </TouchableOpacity>
        )}

        <View style={styles.lineProgress}>
          <Text
            style={{ fontSize: 16, fontWeight: 700, color: Colors.primary }}>
            {" "}
            {currentStep} / {totalSteps}{" "}
          </Text>
        </View>

        {currentStep < totalSteps ? (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={{ fontFamily: "droidAr", color: "white" }}>
              {t("next")}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              ...styles.nextButton,
              alignItems: "center",
              backgroundColor: Colors.primary,
              width: 100,
              borderRadius: 8,
            }}
            onPress={() => {
              if (!data.title || !data.description || !data.price) {
                Alert.alert("يرجى تعبئة العنوان والوصف أو السعر");
                setIsSubmitting(false);
                return;
              }

              setModalVisible(true);
            }}>
            <Text style={{ fontFamily: "droidAr", color: "white" }}>
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                t("publish")
              )}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {addedSeccess && (
        <>
          <SuccessModal onClose={toggleModal} isVisible={isModalVisible1} />
          <LottieView
            source={require("@/assets/placeAdded.json")}
            autoPlay
            loop
            style={{
              width: "100%",
              height: height,
              alignSelf: "center",
              position: "absolute",
            }}
          />
        </>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              بالضغط على "إرسال"، فإنك توافق على جميع{" "}
              <Text style={styles.linkText} onPress={openTermsAndPolicy}>
                الشروط والسياسات
              </Text>
              .
            </Text>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handlePublish}>
              {isSubmitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.submitButtonText}>إرسال</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  lineProgress: {
    flex: 1,
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  linkText: {
    color: Colors.primary,
    textDecorationLine: "underline",
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default Page;
