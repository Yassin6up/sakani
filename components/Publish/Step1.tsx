import React, { useState , useEffect } from 'react';
import { View, Text, StyleSheet, Pressable , Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { useDispatch , useSelector } from 'react-redux';
import { setHomeType , setResetAll , setBuyOrRent  } from '@/store/slices/publish';
import { farmImg , apprtementImg , houseImg , locationImg , chalihat , meetingRoom,
  doctor , studio , superMarket , pool , gym ,football , meeting , tent ,travel
 } from '../intializeImages';
import { useTranslation } from 'react-i18next';

const Step1 = ({switchStep}) => {
    const dispatch = useDispatch()
    const data = useSelector((state)=> state.publishData.value)

  const [selectedOption, setSelectedOption] = useState(data.homeType);

  const handleSelect = (option) => {
    setSelectedOption(option);
    dispatch(setHomeType(option))
  };
  const { t } = useTranslation();

useEffect(()=>{
 dispatch(setResetAll())
  
} , [])
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("step1Title")}</Text>
      <View style={styles.boxesContainer}>
        <Pressable
          style={[styles.box, data.homeType === 'فيلا / منزل'  && styles.selectedBox]}
          onPress={() => {
            handleSelect('فيلا / منزل')
            switchStep()
          }}
        >
          <Image  source={houseImg} style={{width : 24 , height : 24}}/>
          <Text style={styles.text}>{t("home")}</Text>
        </Pressable>
        <Pressable
          style={[styles.box, data.homeType === 'شقة' && styles.selectedBox]}
          onPress={() =>{ handleSelect('شقة')
            switchStep()
          }}
        >
          <Image  source={apprtementImg} style={{width : 24 , height : 24}}/>
          <Text style={styles.text}>{t("apartment")}</Text>
        </Pressable>
        <Pressable
          style={[styles.box, data.homeType === 'مزرعة' && styles.selectedBox]}
          onPress={() => {handleSelect('مزرعة')
            switchStep()
          }}
        >
          <Image  source={farmImg} style={{width : 24 , height : 24}}/>
          <Text style={styles.text}>{t("agriculture")}</Text>
        </Pressable>

        <Pressable
          style={[styles.box, data.homeType === 'ارض' && styles.selectedBox]}
          onPress={() => {handleSelect('ارض')
            switchStep()
          }}
        >
          <Image  source={locationImg} style={{width : 24 , height : 24}}/>
          <Text style={styles.text}>{t("terrain")}</Text>
        </Pressable>


        <Pressable
          style={[styles.box, data.homeType === 'شليهات' && styles.selectedBox]}
          onPress={() => {handleSelect('شليهات')
            switchStep()
          }}
        >
          <Image  source={chalihat} style={{width : 24 , height : 24}}/>
          <Text style={styles.text}>{t("شليهات")}</Text>
        </Pressable>

        <Pressable
          style={[styles.box, data.homeType === 'استوديو' && styles.selectedBox]}
          onPress={() => {handleSelect('استوديو')
            switchStep()
          }}
        >
          <Image  source={studio} style={{width : 24 , height : 24}}/>
          <Text style={styles.text}>{t('استوديو')}</Text>
        </Pressable>
        <Pressable
          style={[styles.box, data.homeType === 'محلات ومخازن' && styles.selectedBox]}
          onPress={() => {handleSelect('محلات ومخازن')
            switchStep()
          }}
        >
          <Image  source={superMarket} style={{width : 24 , height : 24}}/>
          <Text style={styles.text}>{t('shopsAndWarehouses')}</Text>
        </Pressable>
        <Pressable
          style={[styles.box, data.homeType === 'مكاتب وعيادات' && styles.selectedBox]}
          onPress={() => {handleSelect('مكاتب وعيادات')
            switchStep()
          }}
        >
          <Image  source={doctor} style={{width : 24 , height : 24}}/>
          <Text style={styles.text}>{t('officesAndClinics')}</Text>
        </Pressable>
        <Pressable
          style={[styles.box, data.homeType === 'مسابح' && styles.selectedBox]}
          onPress={() => {handleSelect('مسابح')
            dispatch(setBuyOrRent("الحجز"))
            
            switchStep()
          }}
        >
          <Image  source={pool} style={{width : 24 , height : 24}}/>
          <Text style={styles.text}>{t('مسبح')}</Text>
        </Pressable>
        <Pressable
          style={[styles.box, data.homeType === 'صالات رياضة' && styles.selectedBox]}
          onPress={() => {handleSelect('صالات رياضة')
            dispatch(setBuyOrRent("الحجز"))
            switchStep()
          }}
        >
          <Image  source={gym} style={{width : 24 , height : 24}}/>
          <Text style={styles.text}>{t('صالات رياضة')}</Text>
        </Pressable>
        <Pressable
          style={[styles.box, data.homeType === 'مخيمات و اكواخ' && styles.selectedBox]}
          onPress={() => {handleSelect('مخيمات و اكواخ')
            switchStep()
          }}
        >
          <Image  source={tent} style={{width : 24 , height : 24}}/>
          <Text style={styles.text}>{t('مخيمات و اكواخ')}</Text>
        </Pressable>
        <Pressable
          style={[styles.box, data.homeType === "قاعات اجتماعات" && styles.selectedBox]}
          onPress={() => {handleSelect("قاعات اجتماعات")
            dispatch(setBuyOrRent("الحجز"))
            switchStep()
          }}
        >
          <Image  source={meeting} style={{width : 24 , height : 24}}/>
          <Text style={styles.text}>{t("قاعات اجتماعات")}</Text>
        </Pressable>
        <Pressable
          style={[styles.box, data.homeType === "تنضيم رحلات" && styles.selectedBox]}
          onPress={() => {handleSelect("تنضيم رحلات")
            dispatch(setBuyOrRent("الحجز"))
            switchStep()
          }}
        >
          <Image  source={travel} style={{width : 24 , height : 24}}/>

          <Text style={styles.text}>{t("تنضيم رحلات")}</Text>
        </Pressable>
        <Pressable
          style={[styles.box, data.homeType === "ملاعب" && styles.selectedBox]}
          onPress={() => {
            handleSelect("ملاعب")
            dispatch(setBuyOrRent("الحجز"))
            switchStep()
          }}
        >
          
          <Image  source={football} style={{width : 24 , height : 24}}/>
          <Text style={styles.text}>{t("ملاعب")}</Text>
        </Pressable>


      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  box: {
    padding: 16,
    display: 'flex',
    width: '48%',
    borderWidth: 1,
    borderColor: '#dddddd',
    borderStyle: 'solid',
    height: 100,
    borderRadius: 8,
    justifyContent: 'center',
    gap: 10,
    alignItems: 'flex-end',
  },
  text: {
    fontFamily: 'droidAr',
  },
  selectedBox: {
    borderColor: 'black',
    borderWidth : 2
  },
});

export default Step1;

