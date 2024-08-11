import React , {useState} from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentHomeStage , setTotalStages , setSpaceGeneral ,incrementRoomsNumber, decrementRoomsNumber, setHomeType , setFarmHasHouse , setFarmHasFarmed  , setFarmHasWater , setLandInFaceOfStreet , setNumberOfStreetsInLand } from '@/store/slices/publish'; // Import actions
import Colors from '@/constants/Colors';
import FeaturesSheet from './FeaturesSheet';
import { useTranslation } from 'react-i18next';

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
        <View style={styles.container}>
            <Text style={styles.title}>{t("step3Title")}</Text>
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


            <View style={styles.boxInput}>
                    <Text style={styles.sectionTitle}>{t("realEstateSpace")}<Text style={styles.required}>*</Text>
</Text>
                    <TextInput keyboardType='numeric' defaultValue={data.spaceGeneral} placeholder='2م' style={styles.input} textAlign='right' cursorColor={Colors.primary} onChangeText={(text)=>{dispatch(setSpaceGeneral(text))}}/>

            </View>

            { data.homeType == "شقة" || data.homeType == 'مكاتب وعيادات'  || data.homeType == 'شليهات' || data.homeType == 'استوديو'  ||
            data.homeType == 'محلات ومخازن' ? <>
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

            <FeaturesSheet  /> 


        </View>
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
        paddingBottom : 60 ,
        flex : 1,
        
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
    required : {
        color : "red" , 
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
