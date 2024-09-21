import React , {useState} from 'react';
import { View, Text, StyleSheet, Pressable, TextInput , Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentHomeStage , setTripLong , setTotalStages , setEvacuation  , setContainSdah , setDeepPool, setTypePool , setSpaceGeneral ,incrementRoomsNumber, decrementRoomsNumber, setHomeType , setFarmHasHouse , setFarmHasFarmed  , setFarmHasWater , setLandInFaceOfStreet , setNumberOfStreetsInLand, setMeetingRoomType, setCountPeople, setSubsGym } from '@/store/slices/publish'; // Import actions
import Colors from '@/constants/Colors';
import FeaturesSheet from './FeaturesSheet';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
const { height } = Dimensions.get('window');
const Step3 = () => {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const data = useSelector((state)=> state.publishData.value)

    const { rooms, kitchen, bathroom ,stages } = useSelector(state => state.publishData.value.numberOfRooms); // Get counts from Redux state
    const [isOpenModal , setOpenModal] = useState(false)
    
    const openModal  = (option)=>{
        setOpenModal(option)
    }
    const handleIncrement = (type) => {
        switch (type) {
            case 'rooms':
                dispatch(incrementRoomsNumber({ rooms: 1, kitchen: 0, bathroom: 0  , stages : 0}));
                break;
            case 'kitchen':
                dispatch(incrementRoomsNumber({ rooms: 0, kitchen: 1, bathroom: 0 , stages : 0 }));
                break;
            case 'bathroom':
                dispatch(incrementRoomsNumber({ rooms: 0, kitchen: 0, bathroom: 1 , stages : 0 }));
                break;
            case 'stages':
                dispatch(incrementRoomsNumber({ rooms: 0, kitchen: 0, bathroom: 0 , stages : 1 }));
                break;
            default:
                break;
        }
    };

    const handleDecrement = (type) => {
        switch (type) {
            case 'rooms':
                if (rooms > 0) dispatch(decrementRoomsNumber({ rooms: 1, kitchen: 0, bathroom: 0 , stages : 0 }));
                break;
            case 'kitchen':
                if (kitchen > 0) dispatch(decrementRoomsNumber({ rooms: 0, kitchen: 1, bathroom: 0 , stages : 0}));
                break;
            case 'bathroom':
                if (bathroom > 0) dispatch(decrementRoomsNumber({ rooms: 0, kitchen: 0, bathroom: 1 , stages : 0}));
                break;
            case 'stages':
                if (stages > 0) dispatch(decrementRoomsNumber({ rooms: 0, kitchen: 0, bathroom: 0, stages : 1}));
                break;
            default:
                break;
        }
    };
    // console.log(data.homeType)


    const handelFarmHouse = (option)=>{
        dispatch(setFarmHasHouse(option))
    }
    const handelFarmWater = (option)=>{
        dispatch(setFarmHasWater(option))
    }
    const handelFarmFarmed = (option)=>{
        dispatch(setFarmHasFarmed(option))
    }

    const handelLandFaceOfStreet = (option)=>{
        dispatch(setLandInFaceOfStreet(option))
    }
     

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{t("step3Title")} {data.homeType}</Text>
            <Text style={styles.subTitle}>{t("stepSubTitle")} {data.homeType}</Text>

                {data.homeType == "فيلا / منزل" || data.homeType == "شقة"  ? <>
                <Text style={styles.sectionTitle}>{t("roomsCount")}</Text>
            <View style={styles.boxesContainer}>
                <RoomBox
                    title={t("rooms")}
                    count={rooms}
                    onIncrement={() => handleIncrement('rooms')}
                    onDecrement={() => handleDecrement('rooms')}
                />
                <RoomBox
                    title={t("kitchen")}
                    count={kitchen}
                    onIncrement={() => handleIncrement('kitchen')}
                    onDecrement={() => handleDecrement('kitchen')}
                />
                <RoomBox
                    title={t("bathrooms")}
                    count={bathroom}
                    onIncrement={() => handleIncrement('bathroom')}
                    onDecrement={() => handleDecrement('bathroom')}
                />
                {data.homeType == "فيلا / منزل" ?
                <RoomBox
                    title={t("stage")}
                    count={stages}
                    onIncrement={() => handleIncrement('stages')}
                    onDecrement={() => handleDecrement('stages')}
                />  : null}
            </View>
            </>
             : null
             }
             {/* {data.homeType == 'مكاتب وعيادات' ?
                <RoomBox
                    title={t("رقم الطابق")}
                    count={stages}
                    onIncrement={() => handleIncrement('stages')}
                    onDecrement={() => handleDecrement('stages')}
                />  : null} */}

{
    data.homeType == "تنضيم رحلات"  ? null :  (    <View style={styles.boxInput}>
    <Text style={styles.sectionTitle}>{t(data.homeType)}<Text style={styles.required}>*</Text>
</Text>
    <TextInput keyboardType='numeric' defaultValue={data.spaceGeneral} placeholder='2م' style={styles.input} textAlign='right' cursorColor={Colors.primary} onChangeText={(text)=>{dispatch(setSpaceGeneral(text))}}/>
</View>)
}


            { data.homeType == "شقة" || data.homeType == 'مكاتب وعيادات'  || data.homeType == 'استوديو'  ? <>
            <View style={styles.boxInput}>
                    <Text style={styles.sectionTitle}> {t("numberOfStages")} <Text style={styles.required}>*</Text>
            </Text>
                    <TextInput defaultValue={data.numberOfHomeStage} placeholder="3"  style={styles.input} textAlign='right' keyboardType='numeric' cursorColor={Colors.primary} onChangeText={(text)=>{dispatch(setCurrentHomeStage(text))}}/>
            </View>

            <View style={styles.boxInput}>
                    <Text style={styles.sectionTitle}> {t("homesNumber")} :<Text style={styles.required}>*</Text>
                </Text>
                    <TextInput placeholder="10" defaultValue={data.totalStages}  style={styles.input} textAlign='right' keyboardType='numeric' cursorColor={Colors.primary} onChangeText={(text)=>{dispatch(setTotalStages(text))}}/>
            </View>
            </>
  : null}


  {
      data.homeType == "قاعات اجتماعات"  ?

      <>
       <View style={styles.boxInput}>
            <Text style={styles.sectionTitle}>{t("countPeople")}</Text>
            <TextInput keyboardType='numeric' defaultValue={data.countPeople} style={styles.input} textAlign='right' cursorColor={Colors.primary} onChangeText={(text)=>{dispatch(setCountPeople(text))}}/>
        </View>
     
      <View style={styles.boxInput}>
      <Text style={styles.sectionTitle}> {t("meetingRoomType")} <Text style={styles.required}>*</Text>
    </Text>
    <View style={styles.slectionBoxes}>

            <Pressable style={[styles.boxSelection , data.meetingRoomType === "غرفة على شكل U" && styles.selectedBox]}  onPress={() => dispatch(setMeetingRoomType("غرفة على شكل U"))}>
                <Text style={styles.text}>{t("Uroom")}</Text>
            </Pressable>

            <Pressable style={[styles.boxSelection , data.meetingRoomType === "مسرح" && styles.selectedBox]}  onPress={() =>  dispatch(setMeetingRoomType("مسرح"))}>
                <Text style={styles.text}>{t("stagem")}</Text>
            </Pressable>
            <Pressable style={[styles.boxSelection , data.meetingRoomType === "قاعة درس" && styles.selectedBox]}  onPress={() =>  dispatch(setMeetingRoomType("قاعات درس"))}>
                <Text style={styles.text}>{t("classRooms")}</Text>
            </Pressable>
            <Pressable style={[styles.boxSelection , data.meetingRoomType === "مكان للعمل الجماعي" && styles.selectedBox]}  onPress={() =>  dispatch(setMeetingRoomType("مكان للعمل الجماعي"))}>
                <Text style={styles.text}>{t("teamWork")}</Text>
            </Pressable>
            <Pressable style={[styles.boxSelection , data.meetingRoomType === "بيانات" && styles.selectedBox]}  onPress={() =>  dispatch(setMeetingRoomType("بيانات"))}>
                <Text style={styles.text}>{t("dataRoom")}</Text>
            </Pressable>
        </View>
    </View>
    </>
      :
      null
  }

  
{ data.homeType == 'محلات ومخازن'? <>
            <View style={styles.boxInput}>
                    <Text style={styles.sectionTitle}> {t("haveSdah")} <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.slectionBoxes}>
                        <Pressable style={[styles.boxSelection , data.containSdah === true && styles.selectedBox]}  onPress={() => dispatch(setContainSdah(true))}>
                            <Text style={styles.text}>{t("yes")}</Text>
                        </Pressable>
                        
                        <Pressable style={[styles.boxSelection , data.containSdah === false && styles.selectedBox]}  onPress={() =>  dispatch(setContainSdah(false))}>
                            <Text style={styles.text}>{t("no")}</Text>
                        </Pressable>
                    </View>
            </View>

            <View style={styles.boxInput}>
                    <Text style={styles.sectionTitle}> {t("evacuation")} <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.slectionBoxes}>
                        <Pressable style={[styles.boxSelection , data.evacuation === true && styles.selectedBox]}  onPress={() => dispatch(setEvacuation(true))}>
                            <Text style={styles.text}>{t("yes")}</Text>
                        </Pressable>
                        
                        <Pressable style={[styles.boxSelection , data.evacuation === false && styles.selectedBox]}  onPress={() =>  dispatch(setEvacuation(false))}>
                            <Text style={styles.text}>{t("no")}</Text>
                        </Pressable>
                    </View>
            </View>    
            </>
  : null}



{ data.homeType == "مسابح"  ?
   <>
                    <Text style={styles.sectionTitle}> {t("نوع المسبح")}</Text>
                    <View style={styles.slectionBoxes}>
                        <Pressable style={[styles.boxSelection , data.poolType === 'رجالي' && styles.selectedBox]}  onPress={() => dispatch(setTypePool("رجالي"))}>
                            <Text style={styles.text}>{t("رجالي")}</Text>
                        </Pressable>
                        
                        <Pressable style={[styles.boxSelection , data.poolType === 'نسائي' && styles.selectedBox]}  onPress={() => dispatch(setTypePool("نسائي"))}>
                            <Text style={styles.text}>{t("نسائي")}</Text>
                        </Pressable>
                    </View>

                    <Text style={styles.sectionTitle}>{t("مدى غرق السبح")}</Text>
                    <View style={styles.slectionBoxes}>
                        <Pressable style={[styles.boxSelection , data.deepPool === '1متر' && styles.selectedBox]}  onPress={() => dispatch(setDeepPool('1متر'))}>
                            <Text style={styles.text}>{t('1متر')}</Text>
                        </Pressable>
                        
                        <Pressable style={[styles.boxSelection , data.deepPool === '2متر' && styles.selectedBox]}  onPress={() => dispatch(setDeepPool('2متر'))}>
                            <Text style={styles.text}>{t('2متر')}</Text>
                        </Pressable>
                        <Pressable style={[styles.boxSelection , data.deepPool === '3متر' && styles.selectedBox]}  onPress={() => dispatch(setDeepPool('3متر'))}>
                            <Text style={styles.text}>{t('3متر')}</Text>
                        </Pressable>

                        <Pressable style={[styles.boxSelection , data.deepPool === "اكتر من 4 امتار" && styles.selectedBox]}  onPress={() => dispatch(setDeepPool("اكتر من 4 امتار"))}>
                            <Text style={styles.text}>{t("اكتر من 4 امتار")}</Text>
                        </Pressable>
                    </View>
                    </>
                :null}




{ data.homeType == "تنضيم رحلات"  ?
   <>

                    <Text style={styles.sectionTitle}>{t("voyage long")}</Text>
                    <View style={styles.slectionBoxes}>
                        <Pressable style={[styles.boxSelection , data.tripLong === '15day' && styles.selectedBox]}  onPress={() => dispatch(setTripLong('15day'))}>
                            <Text style={styles.text}>{t('15day')}</Text>
                        </Pressable>
                        
                        <Pressable style={[styles.boxSelection , data.tripLong === '1semane' && styles.selectedBox]}  onPress={() => dispatch(setTripLong('1semane'))}>
                            <Text style={styles.text}>{t('1semane')}</Text>
                        </Pressable>
                        <Pressable style={[styles.boxSelection , data.tripLong === '1month' && styles.selectedBox]}  onPress={() => dispatch(setTripLong('1month'))}>
                            <Text style={styles.text}>{t('1month')}</Text>
                        </Pressable>

                        <Pressable style={[styles.boxSelection , data.tripLong === "6month" && styles.selectedBox]}  onPress={() => dispatch(setTripLong("6month"))}>
                            <Text style={styles.text}>{t("6month")}</Text>
                        </Pressable>
                        <Pressable style={[styles.boxSelection , data.tripLong === "3month" && styles.selectedBox]}  onPress={() => dispatch(setTripLong("3month"))}>
                            <Text style={styles.text}>{t("3month")}</Text>
                        </Pressable>
                    </View>


                    </>
                :null}




{ data.homeType == 'صالات رياضة'  ?
   <>
                    <Text style={styles.sectionTitle}> {t("gymType")}</Text>
                    <View style={styles.slectionBoxes}>
                        <Pressable style={[styles.boxSelection , data.poolType === 'رجالي' && styles.selectedBox]}  onPress={() => dispatch(setTypePool("رجالي"))}>
                            <Text style={styles.text}>{t("men")}</Text>
                        </Pressable>
                        
                        <Pressable style={[styles.boxSelection , data.poolType === 'نسائي' && styles.selectedBox]}  onPress={() => dispatch(setTypePool("نسائي"))}>
                            <Text style={styles.text}>{t("women")}</Text>
                        </Pressable>
                    </View>

                    <Text style={styles.sectionTitle}> {t("abonmonet")}</Text>
                    <View style={styles.slectionBoxes}>
                        <Pressable style={[styles.boxSelection , data.subscriptionTypeGym === 'شهر' && styles.selectedBox]}  onPress={() => dispatch(setSubsGym('شهر'))}>
                            <Text style={styles.text}>{t("month")}</Text>
                        </Pressable>
                        
                        <Pressable style={[styles.boxSelection , data.subscriptionTypeGym === 'ثلاثة أشهر' && styles.selectedBox]}  onPress={() => dispatch(setSubsGym("ثلاثة أشهر"))}>
                            <Text style={styles.text}>{t("3month")}</Text>
                        </Pressable>
                        <Pressable style={[styles.boxSelection , data.subscriptionTypeGym === 'سنة' && styles.selectedBox]}  onPress={() => dispatch(setSubsGym("سنة"))}>
                            <Text style={styles.text}>{t("year")}</Text>
                        </Pressable>
                    </View>
                    </>
                :null}

   { data.homeType == "مزرعة"  ?
   <>
                    <Text style={styles.sectionTitle}> {t("housInFarm")}</Text>
                    <View style={styles.slectionBoxes}>
                        <Pressable style={[styles.boxSelection , data.farmHasHouse === 'نعم' && styles.selectedBox]}  onPress={() => handelFarmHouse('نعم')}>
                            <Text style={styles.text}>{t("yes")}</Text>
                        </Pressable>
                        
                        <Pressable style={[styles.boxSelection , data.farmHasHouse === 'لا' && styles.selectedBox]}  onPress={() => handelFarmHouse('لا')}>
                            <Text style={styles.text}>{t("no")}</Text>
                        </Pressable>
                    </View>

                    <Text style={styles.sectionTitle}>{t("wellWaterInFarm")}</Text>
                    <View style={styles.slectionBoxes}>
                        <Pressable style={[styles.boxSelection , data.farmHasWater === 'نعم' && styles.selectedBox]}  onPress={() => handelFarmWater('نعم')}>
                            <Text style={styles.text}>{t("yes")}</Text>
                        </Pressable>
                        
                        <Pressable style={[styles.boxSelection , data.farmHasWater === 'لا' && styles.selectedBox]}  onPress={() => handelFarmWater('لا')}>
                            <Text style={styles.text}>{t("no")}</Text>
                        </Pressable>
                    </View>

                    <Text style={styles.sectionTitle}>{t("Is_it_planted")}</Text>
                    <View style={styles.slectionBoxes}>
                        <Pressable style={[styles.boxSelection , data.farmHasFarmed === 'نعم' && styles.selectedBox]}  onPress={() => handelFarmFarmed('نعم')}>
                            <Text style={styles.text}>{t("yes")}</Text>
                        </Pressable>
                        
                        <Pressable style={[styles.boxSelection , data.farmHasFarmed === 'لا' && styles.selectedBox]}  onPress={() => handelFarmFarmed('لا')}>
                            <Text style={styles.text}>{t("no")}</Text>
                        </Pressable>
                    </View>

                    </>
                :null}



{ data.homeType == "ارض"  ?
                    <>
                    <Text style={styles.sectionTitle}> {t("isLandHasAStreet")}</Text>
                    <View style={styles.slectionBoxes}>
                        <Pressable style={[styles.boxSelection , data.landInFaceOfStreet === 'نعم' && styles.selectedBox]}  onPress={() => handelLandFaceOfStreet('نعم')}>
                            <Text style={styles.text}>{t("yes")}</Text>
                        </Pressable>
                        
                        <Pressable style={[styles.boxSelection , data.landInFaceOfStreet === 'لا' && styles.selectedBox]}  onPress={() => handelLandFaceOfStreet('لا')}>
                            <Text style={styles.text}>{t("no")}</Text>
                        </Pressable>
                    </View>
                    </>
    :null}
    {
        data.landInFaceOfStreet ===  'نعم'?  
        <View style={styles.boxInput}>
                    <Text style={styles.sectionTitle}>{t("numberOfStreet")}</Text>
                    <TextInput onChangeText={(text)=>{dispatch(setNumberOfStreetsInLand(text))}} defaultValue={data.numberOfStreetsInLand} placeholder="2" style={styles.input} textAlign='right' keyboardType='numeric' cursorColor={Colors.primary}/>
            </View>
         : null
    }



            <FeaturesSheet isEdit={false} />   
        </ScrollView>
    );
};

const RoomBox = React.memo(({ title, count, onIncrement, onDecrement }) => {
    return (
        <View style={styles.box}>
            <Text style={styles.text}>{title}</Text>
            <Pressable style={styles.btnAndicator} onPress={onIncrement}>
                <Text>+</Text>
            </Pressable>
            <View>
                <Text>{count}</Text>
            </View>
            <Pressable style={styles.btnAndicator} onPress={onDecrement} disabled={count === 0}>
                <Text>-</Text>
            </Pressable>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        paddingBottom : 50 ,
        flex : 1,
        height :height
        
    },
    subTitle: {
        color: 'grey',
        fontFamily: 'droidAr',
        textAlign: 'right',
        marginRight: 50,
    },
    title: {
        fontSize: 20,
        fontFamily: 'droidAr',
          // textAlign: 'right',
    marginHorizontal: 50,
    },
    sectionTitle : {
        fontFamily: 'droidAr',
        fontSize : 15  ,
        marginTop : 20 , 
        marginHorizontal: 20,
    },
    selectedBox: {
        borderColor: 'black',
        borderWidth : 2
    },
    boxesContainer: {
        width: '100%',
        padding: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10,
        
    },
    
    slectionBoxes : {
        width : "100%" , 
        height : 100 ,
        flexWrap : "wrap",
        gap : 10 ,
        display : "flex",
        flexDirection : "row",
        justifyContent: "flex-end" ,
        alignItems : "center"
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
    box: {
        paddingRight: 20,
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#dddddd',
        borderBottomStyle: 'solid',
        height: 50,
        justifyContent: 'flex-end',
        gap: 10,
        alignItems: 'center',
    },
    required : {
        color : "red" , 
    },
    text: {
        fontFamily: 'droidAr',
    },
    
    btnAndicator: {
        width: 35,
        height: 35,
        borderRadius: 50,
        borderWidth: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    boxInput: {
        padding: 16,
        display: 'flex',
        width: "100%",
        height: 150,
        alignItems : "flex-end"
        
    },
    
    input : {
        width : "100%" ,
        height : 60  , 
        fontFamily: 'droidAr',
        borderWidth: 1,
        borderColor: '#dddddd',
        borderStyle: 'solid',
        borderRadius: 8,
        paddingHorizontal : 10 , 
        marginTop : 10 ,
    },
});

export default Step3;
