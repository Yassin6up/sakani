import React, { useCallback, useMemo, useRef, useState , useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetModalProvider , BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Colors from '@/constants/Colors';
import { setamenities, setHomeType } from '@/store/slices/publish';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';


const App = ({type , isEdit}) => {
  const dispatch = useDispatch();
  const data = useSelector((state)=> state.publishData.value)
  const [list  , setList] = useState([])
  const { t } = useTranslation();



  useEffect(()=>{
    const featuresHouse = t("featuresHouse")
    console.log("amients : " , featuresHouse)
    const featureFarme = t("featureFarme")
    const featureLand = t("featureLand")
    const featureApertament = t("featureApertament")
    const office = t("featureOffice")
    const studio = t("featureStudio")
    const shops = t("featureShops")
    const shalet = t('featrdShalet')
    const pool = t('featureSwimmingPool')
    const gym = t("featureGym")
    const camp = t("featureCampsAndCabins")
    const meeting = t("featureMeetingRooms")
    const trip = t("featureTripOrganization")
    const stadium = t("featureSportsFields")
    console.log("office :" , office)

    if(type){
    switch (type) {
      case "فيلا / منزل":
        setList(JSON.parse(featuresHouse) )
        break;
        case "مزرعة":
        setList(JSON.parse(featureFarme))
        break;
        case "ارض":
        setList(JSON.parse(featureLand))
        break;
        case "شقة":
        setList(JSON.parse(featureApertament))
        break;
        case 'مكاتب وعيادات' :
          setList(JSON.parse(office))
        break;
        case 'استوديو' :
          setList(JSON.parse(studio))
        break;
        case 'محلات ومخازن' :
          setList(JSON.parse(shops))
        break;
        case 'شليهات' :
          setList(JSON.parse(shalet))
        case 'مسابح' :
          setList(JSON.parse(pool))
        break;
        case 'صالات رياضة' :
          setList(JSON.parse(gym))
        break;

        case 'مخيمات و اكواخ' :
          setList(JSON.parse(camp))
        break;
        case "قاعات اجتماعات" :
          setList(JSON.parse(meeting))
        break;
        case "تنضيم رحلات" :
          setList(JSON.parse(trip))
        break;
        case "ملاعب":
          setList(JSON.parse(stadium))
        break;
    
      default:
        break;
    }
  }else{
    switch (data.homeType) {
      case "فيلا / منزل":
        setList(JSON.parse(featuresHouse) )
        break;
        case "مزرعة":
        setList(JSON.parse(featureFarme))
        break;
        case "ارض":
        setList(JSON.parse(featureLand))
        break;
        case "شقة":
        setList(JSON.parse(featureApertament))
        break;
        case 'مكاتب وعيادات' :
          setList(JSON.parse(office))
        break;
        case 'استوديو' :
          setList(JSON.parse(studio))
        break;
        case 'محلات ومخازن' :
          setList(JSON.parse(shops))
        break;
        case 'شليهات' :
          setList(JSON.parse(shalet))
        break;
        case 'مسابح' :
          setList(JSON.parse(pool))
        break;
        case 'صالات رياضة' :
          setList(JSON.parse(gym))
        break;
        case 'مخيمات و اكواخ' :
          setList(JSON.parse(camp))
        break;

        case "قاعات اجتماعات" :
          setList(JSON.parse(meeting))
        break;
        case "تنضيم رحلات" :
          setList(JSON.parse(trip))
        break;
        case "ملاعب":
          setList(JSON.parse(stadium))
        break;
    
        

      default:
        break;
    }
  }


  } , [data.homeType , type ,data.amenities ])

  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  // state to store selected items
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // variables
  const snapPoints = isEdit? useMemo(() => ['15%', '30%']  , []) : useMemo(() => ['25%', '60%']  , []) ;

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handlePress = useCallback((item: string) => {
    setSelectedItems(prevSelected => {
      if (prevSelected.includes(item)) {
        return prevSelected.filter(selected => selected !== item);
      } else {
        return [...prevSelected, item];
      }
    });
    // Dispatch action to update Redux state with selected amenities
    dispatch(setamenities(item));
  }, [dispatch]);


  // Define your features array here

  // renders
  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <Pressable onPress={handlePresentModalPress} style={styles.boxSelection}>
          <Text style={{ fontFamily: "droidAr" }}>{t("AddPropertyFeatures")}</Text>
        </Pressable>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
        >
          <BottomSheetScrollView style={styles.contentContainer}>
            <Text style={{ fontFamily: "droidAr", textAlign: "center" }}>{t("Features")}</Text>
            <View style={styles.boxesContainer}>
              {list.map((feature, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.boxSelection,
                    selectedItems.includes(feature) && styles.selectedBox
                  ]}
                  onPress={() => handlePress(feature)}
                >
                  <Text style={styles.text}>{feature}</Text>
                </Pressable>
              ))}
            </View>
          </BottomSheetScrollView>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  text: {
    fontFamily: 'droidAr',
},
  boxSelection : {
    paddingLeft : 20 , 
    paddingRight : 20 , 
    height : 50 , 
    borderWidth: 1,
    borderColor: '#dddddd',
    borderStyle: 'solid',
    borderRadius: 8,
    display : "flex",
    justifyContent: "center" ,
    alignItems : "center"
},
sectionTitle : {
  fontFamily: 'droidAr',
  fontSize : 15 

},
box: {
  padding: 16,
  display: 'flex',
  width: "100%",
  height: 150,
  gap : 10 ,
  alignItems : "flex-end"
  
},
selectedBox : {
  borderWidth: 2,
  borderColor: 'black',
  borderStyle: 'solid',
  borderRadius: 8,
} ,
boxesContainer: {
    width: '100%',
    marginTop: 20,
    padding: 15,
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
},
});

export default App;