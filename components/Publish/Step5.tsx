import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image ,TextInput , Button  ,TouchableOpacity} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {  useDispatch, useSelector } from 'react-redux';
  import {  setPriceCalander ,setTriDate , setTimeEnd , setTimeStart , setDaysInCalander , setGettingCalls ,setPriceHide ,setTitle , setDescription , setAdsAccept ,setHajezType , setPublisherType , setVariablePrice ,setHajez    , setPrice , setBuyOrRent , setOwnerStatus , setRentType} from '@/store/slices/publish';
import Colors from '@/constants/Colors';
import { Calendar } from 'react-native-calendars';
import { useTranslation } from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';


const Step5 = () => {
        const { t } = useTranslation();

        const [startTime, setStartTime] = useState(new Date());
        const [endTime, setEndTime] = useState(new Date());
        const [showStartTimePicker, setShowStartTimePicker] = useState(false);
        const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    
        const onStartTimeChange = (event, selectedTime) => {
            const currentTime = selectedTime || startTime;
            setShowStartTimePicker(false);
            setStartTime(currentTime);
            dispatch(setTimeStart(currentTime))
        };
    
        const onEndTimeChange = (event, selectedTime) => {
            const currentTime = selectedTime || endTime;
            setShowEndTimePicker(false);
            setEndTime(currentTime);
            dispatch(setTimeEnd(currentTime))
        };
        
        const [priceLimmit , setPricelimmit] = useState(false)
        const [showPass , setShowPass]=useState(true)
        const [selectedOption, setSelectedOption] = useState("للبيع");
        // const [selectedStatusOption, setSelectedStatusOption] = useState("ملك");
        const [selectFeature, setSelectFeature] = useState("لا");
        // const [rentType , setRentType] = useState("شهري")
        // const [hajezType , setHajezType] = useState("24ساعة")
        const [priceType, setPriceType] = useState('fixed'); // 'fixed' or 'variable'
        const [variablePrices, setVariablePrices] = useState({});

        const data = useSelector((state)=> state.publishData.value)
        const dispatch = useDispatch()
  const handleSelect = (option) => {
    setSelectedOption(option);
    // dispatch(setHomeType(selectedOption))
  };
  const handleSelectOption = (option) => {
    // setSelectedStatusOption(option);
    dispatch(setPublisherType(option))
  };

  const acceptFeatur = (option) => {
    // setSelectFeature(option);
    dispatch(setAdsAccept(option))
    // dispatch(setHomeType(selectedOption))
  };
  const changeRentType =(option)=>{
    dispatch(setRentType(option))
  }

  const changeHajez =(option)=>{
    dispatch(setHajezType(option))
    // setHajezType(option)
  }

  const daysOfWeek = ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'];
  
  const handleVariablePriceChange = (day, price) => {
    setVariablePrices(prev => ({ ...prev, [day]: price }));
    dispatch(setVariablePrice({ day, price }));
  };

  const DaySelection = ({ day, isSelected, onSelect }) => (
    <Pressable
      style={[styles.boxSelection, isSelected && styles.selectedBox]}
      onPress={() => onSelect(day)}
    >
      <Text style={styles.text}>{day}</Text>
    </Pressable>
  );


  const [selectedDates, setSelectedDates] = useState({});

  const onDayPress = (day) => {
    const selected = { ...selectedDates };
    if (selected[day.dateString]) {
      delete selected[day.dateString];
    } else {
      selected[day.dateString] = { selected: true, selectedColor: Colors.primary };
    }
    setSelectedDates(selected);

    console.log("selectd Dates :" , Object.keys(selected) )
    dispatch(setDaysInCalander(Object.keys(selected)))
  };


  const onTripDaySelected = (day) => {
    
    let date  = day.dateString

    dispatch(setTriDate(date))
    console.log(data.tripDate)

  };
    return (
        <View style={styles.container}>
            <Text style={styles.title}> {t("step5Title")}</Text>
            <Text style={styles.subTitle}>{t("stepSubTitle")} {data.homeType}</Text>
            <View style={styles.boxesContainer}>
                
                <View style={styles.box}>
                    <Text style={styles.sectionTitle}>{t("titleInput")}<Text style={styles.required}>*</Text></Text>
                    <TextInput placeholder='' style={styles.input} textAlign='right' cursorColor={Colors.primary} onChangeText={(text)=>{dispatch(setTitle(text))}}/>
                </View>
                <View style={{...styles.box , marginBottom : 30}}>
                    <Text style={styles.sectionTitle}>{t("descriptionInput")}<Text style={styles.required}>*</Text></Text>
                    <TextInput placeholder='' multiline style={{...styles.input , height : 100}} textAlign='right' cursorColor={Colors.primary} onChangeText={(text)=>{dispatch(setDescription(text))}}/>
                </View>
        {
                !data.priceHide ?
                <View style={styles.box}>
                    <Text style={styles.sectionTitle}>{t("priceInput")}</Text>
                    <View style={{width:"100%"  , alignItems : "flex-end" }}>
                    <TextInput placeholder='0.0' defaultValue={data.price} keyboardType='number-pad' showSoftInputOnFocus={true}  style={{...styles.input , width : "50%"}} textAlign='right' cursorColor={Colors.primary} onChangeText={(text)=> {
                        if(+text <= 1){
                            setPricelimmit(true)
                        }else{     
                            dispatch(setPrice(text) ) 
                            setPricelimmit(false)
                        }
                    }  }/>
                    {priceLimmit? <Text style={{color : "red" , fontFamily : 'droidAr' ,  fontSize : 10}}>يجب ان يكون المبلغ اكبر من 1 </Text>   : null}
                    </View>
                </View>
 : null}
                    <View style={styles.slectionBoxes}>
                        <Pressable style={[styles.boxSelection , !data.priceHide === true && styles.selectedBox]}  onPress={() =>  dispatch(setPriceHide(false)) }>
                            <Text style={styles.text}>{t("showPrice")}</Text>
                        </Pressable>
                        
                        <Pressable style={[styles.boxSelection , !data.priceHide === false && styles.selectedBox]}  onPress={() => {
                            
                            dispatch(setPriceHide(true)) 
                            }}>
                            <Text style={styles.text}>{t("hidePrice")}</Text>
                        </Pressable>
                    </View>


{ data.homeType =="فيلا / منزل"  || data.homeType == "شقة"  || data.homeType == "مزرعة"  || data.homeType == 'مخيمات و اكواخ' ?
                    <View style={styles.box}>
                    <Text style={styles.sectionTitle}>{t("sellMethodInput")}</Text>
                    <View style={styles.slectionBoxes}>
                        <Pressable style={[styles.boxSelection , data.buyOrRent === 'للبيع' && styles.selectedBox]}  onPress={() => dispatch(setBuyOrRent('للبيع')) }>
                            <Text style={styles.text}>{t("sell")}</Text>
                        </Pressable>
                        <Pressable style={[styles.boxSelection , data.buyOrRent === 'الحجز' && styles.selectedBox]}  onPress={() =>  dispatch(setBuyOrRent('الحجز'))}>
                        <Text style={styles.text}>{t("booking")}</Text>
                    </Pressable>
                        <Pressable style={[styles.boxSelection , data.buyOrRent === 'للإيجار' && styles.selectedBox]}  onPress={() =>dispatch(setBuyOrRent('للإيجار'))}>
                            <Text style={styles.text}>{t("rent")}</Text>
                        </Pressable>
                    </View>
                </View>
                :null}


{
     data.homeType == 'شليهات'  ?
     <View style={styles.box}>
     <Text style={styles.sectionTitle}>{t("sellMethodInput")}</Text>
     <View style={styles.slectionBoxes}>
         <Pressable style={[styles.boxSelection , data.buyOrRent === 'للبيع' && styles.selectedBox]}  onPress={() => dispatch(setBuyOrRent('للبيع')) }>
             <Text style={styles.text}>{t("sell")}</Text>
         </Pressable>
         <Pressable style={[styles.boxSelection , data.buyOrRent === 'الحجز' && styles.selectedBox]}  onPress={() =>  dispatch(setBuyOrRent('الحجز'))}>
         <Text style={styles.text}>{t("booking")}</Text>
     </Pressable>
         {/* <Pressable style={[styles.boxSelection , data.buyOrRent === 'للإيجار' && styles.selectedBox]}  onPress={() =>dispatch(setBuyOrRent('للإيجار'))}>
             <Text style={styles.text}>{t("rent")}</Text>
         </Pressable> */}
     </View>
 </View>

     :
     null
}

{   data.homeType == 'مكاتب وعيادات' || data.homeType == 'استوديو'  ||
            data.homeType == 'محلات ومخازن' ?
                    <View style={styles.box}>
                    <Text style={styles.sectionTitle}>{t("sellMethodInput")}</Text>
                    <View style={styles.slectionBoxes}>
                        <Pressable style={[styles.boxSelection , data.buyOrRent === 'للبيع' && styles.selectedBox]}  onPress={() => dispatch(setBuyOrRent('للبيع')) }>
                            <Text style={styles.text}>{t("sell")}</Text>
                        </Pressable>
                        
                        <Pressable style={[styles.boxSelection , data.buyOrRent === 'للإيجار' && styles.selectedBox]}  onPress={() =>dispatch(setBuyOrRent('للإيجار'))}>
                            <Text style={styles.text}>{t("rent")}</Text>
                        </Pressable>
                    </View>
                </View>
                :null}

            {/* { data.buyOrRent === 'الحجز' || data.homeType == 'مسابح' ?   
                            <View style={styles.box}>
                            <Text style={styles.sectionTitle}>{t("bookingTypeInput")}</Text>
                            <View style={styles.slectionBoxes}>
                                <Pressable style={[styles.boxSelection , data.hajezType === '24ساعة' && styles.selectedBox]}  onPress={() => changeHajez('24ساعة')}>
                                    <Text style={styles.text}>{t("24h")}</Text>
                                </Pressable>
                                
                                <Pressable style={[styles.boxSelection , data.hajezType === '12ساعة' && styles.selectedBox]}  onPress={() => changeHajez('12ساعة')}>
                                    <Text style={styles.text}>{t("12h")}</Text>
                                </Pressable>
                            </View>
                        </View>
                            : null} */}

{ data.homeType == 'مسابح'   ||data.homeType == 'صالات رياضة'   || data.homeType == "قاعات اجتماعات"  ||  data.homeType === "ملاعب"?   
                            <View style={styles.box}>
                            <Text style={styles.sectionTitle}>{t("ساعات العمل")}</Text>
                            <View style={styles.slectionBoxes}>
                                <Pressable style={[styles.boxSelection , data.hajezType === 'beforeNoon' && styles.selectedBox]}  onPress={() => changeHajez('beforeNoon')}>
                                    <Text style={styles.text}>{t("قبل الضهيرة")}</Text>
                                    <Text style={{fontSize : 9}}>12:00h - 7:00h</Text>
                                </Pressable>
                                
                                <Pressable style={[styles.boxSelection , data.hajezType === 'afterNoon' && styles.selectedBox]}  onPress={() => changeHajez('afterNoon')}>
                                    <Text style={styles.text}>{t("بعد الضهيرة")}</Text>
                                    <Text style={{fontSize : 9}}>8:00h - 1:00h</Text>
                                </Pressable>

                                <Pressable style={[styles.boxSelection , data.hajezType === '12h' && styles.selectedBox]}  onPress={() => changeHajez('12h')}>
                                    <Text style={styles.text}>{t("النهار كله")}</Text>
                                    {/* <Text>10:00م -   7:00ص</Text> */}

                                </Pressable>

                                <Pressable style={[styles.boxSelection , data.hajezType === 'customeTime' && styles.selectedBox]}  onPress={() => changeHajez('customeTime')}>
                                    <Text style={styles.text}>{t("وقت مخصص")}</Text>
                                </Pressable>

                            </View>
                        </View>
                            : null}

                            
                {data.homeType == 'مسابح'  ||data.homeType == 'صالات رياضة'  ||data.homeType == "قاعات اجتماعات"   ||data.homeType == "ملاعب"  ?  data.hajezType === 'customeTime' ?(
                       <View style={{...styles.box , marginBottom : data.hajezDays.length +  300}}>
                        <Text style={styles.sectionTitle}> {t("timeCustome")}</Text>
                            <View style={styles.variablePriceContainer}>
                            <View style={styles.timePickerContainer}>
                        {/* Start Time Picker */}
                        <TouchableOpacity style={styles.timeButton} onPress={() => setShowStartTimePicker(true)}>
                            <Text style={styles.buttonText}>اختر وقت البدء</Text>
                        </TouchableOpacity>
                        {showStartTimePicker && (
                            <DateTimePicker
                                value={startTime}
                                mode="time"
                                is24Hour={true}
                                display="default"
                                onChange={onStartTimeChange}
                            />
                        )}
                        <Text style={styles.selectedTimeText}>وقت البدء المحدد: {startTime.toLocaleTimeString()}</Text>

                        {/* End Time Picker */}
                        <TouchableOpacity style={styles.timeButton} onPress={() => setShowEndTimePicker(true)}>
                            <Text style={styles.buttonText}>اختر وقت الانتهاء</Text>
                        </TouchableOpacity>
                        {showEndTimePicker && (
                            <DateTimePicker
                                value={endTime}
                                mode="time"
                                is24Hour={true}
                                display="default"
                                onChange={onEndTimeChange}
                            />
                        )}
                        <Text style={styles.selectedTimeText}>وقت الانتهاء المحدد: {endTime.toLocaleTimeString()}</Text>
                    </View>
                            </View>
                    </View>
                    ) : null : null}





{data.buyOrRent === 'الحجز' && 
 (data.homeType !== 'مسابح' && 
  data.homeType !== 'صالات رياضة' && 
  data.homeType !== 'قاعات اجتماعات' && 
  data.homeType !== 'ملاعب') ? (
    <View style={{...styles.box, marginBottom: 100}}>
        <Text style={styles.sectionTitle}>{t('bookingAvailabelDays')}</Text>
        <View style={styles.slectionBoxes}>
            {daysOfWeek.map(day => (
                <DaySelection
                    key={day}
                    day={day}
                    isSelected={data.hajezDays.includes(day)}
                    onSelect={(selectedDay) => dispatch(setHajez(selectedDay))}
                />
            ))}
        </View>
    </View>
) : null}




                    {data.buyOrRent === 'الحجز' &&
 (data.homeType !== 'مسابح' && 
  data.homeType !== 'صالات رياضة' && 
  data.homeType !== 'قاعات اجتماعات' && 
  data.homeType !== 'ملاعب')   ? (
                    <View style={styles.box}>
                        <Text style={styles.sectionTitle}>{t("priceState")}</Text>
                        <View style={styles.slectionBoxes}>
                        <Pressable
                            style={[styles.boxSelection, priceType === 'fixed' && styles.selectedBox]}
                            onPress={() => setPriceType('fixed')}
                        >
                            <Text style={styles.text}>{t("fixed")}</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.boxSelection, priceType === 'variable' && styles.selectedBox]}
                            onPress={() => setPriceType('variable')}
                        >
                            <Text style={styles.text}>{t("variable")}</Text>
                        </Pressable>
                        </View>
                    </View>
                    ) : null}


                {priceType === 'variable' &&  data.buyOrRent === 'الحجز' ? (
                       <View style={{...styles.box , marginBottom : data.hajezDays.length * 45}}>
                        <Text style={styles.sectionTitle}>{t("priceByDays")}</Text>
                    <View style={styles.variablePriceContainer}>
                        {data.hajezDays.map(day => (
                        <View key={day} style={styles.variablePriceRow}>
                            <Text style={styles.text}>{day}</Text>
                            <TextInput
                            style={{...styles.input , width  : 100}}
                            placeholder="ادخل السعر الجديد"
                            defaultValue={data.price}
                            keyboardType="numeric"
                            onChangeText={(text) => handleVariablePriceChange(day, text)}
                            />
                        </View>
                        ))}
                    </View>
                    </View>
                    ) : null}

                        {priceType === 'variable' &&  data.buyOrRent === 'الحجز' ? (
                       <View style={{...styles.box , marginBottom : data.hajezDays.length +  300}}>
                        <Text style={styles.sectionTitle}> {t("priceByDaysInCalander")}</Text>
                            <View style={styles.variablePriceContainer}>
                            <View style={styles.calendarContainer}>
                            <Calendar
                                onDayPress={onDayPress}
                                markedDates={selectedDates}
                                style={styles.calendar}
                            />
                            </View>
                            <View style={styles.variablePriceRow}>
                            {/* priceForSelectedDays */}
                            <Text style={styles.text}>{t("priceForSelectedDays")}</Text>
                            <TextInput
                            style={{...styles.input}}
                            placeholder="ادخل السعر الجديد"
                            defaultValue={data.price}
                            keyboardType="numeric"
                            onChangeText={(text) => {
                                dispatch(setPriceCalander(text))
                            }}
                            />
                        </View>
                            

                            </View>
                    </View>
                    ) : null}


{ data.homeType === "تنضيم رحلات" ? (
                       <View style={{...styles.box , marginBottom : data.hajezDays.length +  300}}>
                        <Text style={styles.sectionTitle}> {t("timeTrip")}</Text>
                            <View style={styles.variablePriceContainer}>
                            <View style={styles.calendarContainer}>
                            <Calendar
                                onDayPress={onTripDaySelected}
                                markedDates={{
                                    [data.tripDate]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
                                  }}
                                style={styles.calendar}
                            />
                            </View>

                            </View>
                    </View>
                    ) : null}


                { data.buyOrRent === 'للإيجار' ?   
                <View style={styles.box}>
                <Text style={styles.sectionTitle}>{t("rentState")}</Text>
                <View style={styles.slectionBoxes}>
                    <Pressable style={[styles.boxSelection , data.rentType === 'شهري' && styles.selectedBox]}  onPress={() => changeRentType('شهري')}>
                        <Text style={styles.text}>{t("monthly")}</Text>
                    </Pressable>
                    
                    <Pressable style={[styles.boxSelection , data.rentType === 'سنوي' && styles.selectedBox]}  onPress={() => changeRentType('سنوي')}>
                        <Text style={styles.text}>{t("yearly")}</Text>
                    </Pressable>
                </View>
            </View>
                : null}
                
                
                <View style={styles.box}>
                    <Text style={styles.sectionTitle}>{t("areYou")}</Text>
                    <View style={styles.slectionBoxes}>
                        <Pressable style={[styles.boxSelection , data.publisherState === 'ملك' && styles.selectedBox]}  onPress={() => handleSelectOption('ملك')}>
                            <Text style={styles.text}>{t("ownerRealEstate")}</Text>
                        </Pressable>
                        
                        <Pressable style={[styles.boxSelection , data.publisherState === 'وسيط' && styles.selectedBox]}  onPress={() => handleSelectOption('وسيط')}>
                            <Text style={styles.text}>{t("wasit")}</Text>
                        </Pressable>
                    </View>
                </View>

                {
                    data.buyOrRent === 'الحجز' ?
                    null 
                    :
                    <View style={styles.slectionBoxes}>
                    <Pressable style={[styles.boxSelection , data.adsAccept === "لتفاوض" && styles.selectedBox]}  onPress={() =>  acceptFeatur("لتفاوض")}>
                        <Text style={styles.text}>{t("changabelPrice")}</Text>
                    </Pressable>
                    <Pressable style={[styles.boxSelection , data.adsAccept === "التقسيط" && styles.selectedBox]}  onPress={() => acceptFeatur("التقسيط")}>
                        <Text style={styles.text}>{t("payMonhthly")}</Text>
                    </Pressable>
                    <Pressable style={[styles.boxSelection , data.adsAccept === "لا" && styles.selectedBox]}  onPress={() => acceptFeatur("لا")}>
                        <Text style={styles.text}>  {t("nothingAccepted")} </Text>
                    </Pressable>
                </View>
                }

{
                    data.buyOrRent === 'الحجز'?
                    null 
                    :
                    <View style={styles.box}>
                    <Text style={styles.sectionTitle}>{t("gettingCalls")}</Text>
                    <View style={styles.slectionBoxes}>
                    <Pressable style={[styles.boxSelection , data.gettingCalls === "sms" && styles.selectedBox]}  onPress={() =>  dispatch(setGettingCalls("sms"))}>
                        <Text style={styles.text}>{"sms"}</Text>
                    </Pressable>
                    <Pressable style={[styles.boxSelection , data.gettingCalls === "whatsapp" && styles.selectedBox]}  onPress={() =>dispatch(setGettingCalls("whatsapp"))}>
                        <Text style={styles.text}>{t("whatssapp")}</Text>
                    </Pressable>
                    </View>
                </View>

                }
                

               

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom : 100
    },
    title: {
        fontSize: 20,
        fontFamily: 'droidAr',
          // textAlign: 'right',
    marginHorizontal: 50,
    },
    boxesContainer: {
        width: '100%',
        marginTop: 20,
        padding: 15,
        display: 'flex',
    },
    box: {
        padding: 16,
        display: 'flex',
        width: "100%",
        height: 150,
        gap : 10 ,
        alignItems : "flex-end"
        
    },
    required : {
        color : "red" , 
    },
    calendarContainer: {
        borderWidth: 3,
        borderColor: Colors.primary,
        borderRadius: 20,
        overflow: 'hidden',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.2,
        // shadowRadius: 4,
        // elevation: 9,
      },
      calendar: {
        borderRadius: 20,
      },

    input : {
        width : "100%" ,
        height : 60  , 
        fontFamily: 'droidAr',
        borderWidth: 1,
        borderColor: '#dddddd',
        borderStyle: 'solid',
        borderRadius: 8,
        paddingHorizontal : 10
    },
    text: {
        fontFamily: 'droidAr',
    },
    sectionTitle : {
        fontFamily: 'droidAr',
        fontSize : 15 

    },
    subTitle: {
        color: 'grey',
        fontFamily: 'droidAr',
        textAlign: 'right',
        marginRight: 50,
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
    selectedBox: {
        borderColor: 'black',
        borderWidth : 2
    },
    priceTypeContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
    priceTypeButton: { padding: 10, borderWidth: 1, borderRadius: 5 },
    selectedPriceType: { backgroundColor: 'lightblue' },
    variablePriceContainer: { 
        flexDirection: 'row',
        flexWrap : "wrap" , 
        gap : 3 , 
        justifyContent : "center"
    },
    variablePriceRow: {  alignItems: 'center', marginVertical: 5 },
    timePickerContainer: {
        marginTop: 15,
    },
    timeButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginBottom: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    selectedTimeText: {
        fontSize: 16,
        color: '#2c3e50',
        marginTop: 5,
        marginBottom: 15,
        textAlign: 'center',
    },
  
});

export default Step5;
