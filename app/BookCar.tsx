import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View, StyleSheet, TextInput, Text, TouchableOpacity , ScrollView , Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
const HIEGHT = Dimensions.get("window").height

const Page = () => {

  return (
    <ScrollView style={styles.container}>

    <View style={{ position : "relative" , 
    top: "-10%" , height:140 , width : "100%" , backgroundColor : Colors.primary , borderRadius : 100, 
    display :"flex" , justifyContent : "flex-end", alignItems : "center" }}>
    <Text style={styles.title}>حجز سيارة</Text>
    </View>
    <Text style={{textAlign : "center" , fontFamily: "droidAr" , fontSize : 18 , marginTop    : "-30px"}}>تمكنك هذه الخدمة من حجز سيارات</Text>
     <Text style={{padding : 5 ,marginTop :  30 ,  fontFamily: "droidAr" }}>المستلزمات الضرورية</Text>
      <View style={styles.listRequiremnt}>
          <View style={styles.singleCheck}>
            <Text style={{fontFamily :"droidAr" }}>بطاقة تعريف الشخص</Text>
            <AntDesign name="checkcircle" size={24} color={Colors.primary} />
           </View>
           <View style={styles.singleCheck}>
            <Text style={{fontFamily :"droidAr" }}> رخصة السياقة (مر عليها اكنر من خمس سنوات )</Text>
            <AntDesign name="checkcircle" size={24} color={Colors.primary} />
           </View>
           <View style={styles.singleCheck}>
            <Text style={{fontFamily :"droidAr" }}>صورة شخصية.</Text>
            <AntDesign name="checkcircle" size={24} color={Colors.primary} />
           </View>
      </View>
      <View style={{width : "100%" , display : "flex" , alginItems : "flex-end" ,  }}>
        <Text style={{padding : 5 ,marginTop :  30 ,  fontFamily: "droidAr" , backgrouondColor : "red" , }}>لحجز سيارة الرجاء الضغط على الزر اسفله:</Text>
      </View>
      {/* <View style={styles.listRequiremnt}>
          <View style={styles.singleCheck}>
            <Text style={{fontFamily :"droidAr" }}> من الأحد الى الخميس.</Text>
            <Ionicons name="calendar" size={24} color={Colors.primary} />
            </View>
           <View style={styles.singleCheck}>
            <Text style={{fontFamily :"droidAr" }}>8 صباحاً - 4 عصراً</Text>
            <Ionicons name="time" size={24} color={Colors.primary} />
           </View>
      </View> */}
      
      <View style={styles.whatsappButton}>
        <View><MaterialCommunityIcons name="whatsapp" size={24} color="white" /></View>
      </View>
    </ScrollView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 26,  
    position: "relative" , 
    top : -25 ,
    height : HIEGHT
  },

  title: {
    fontSize: 25,
    padding: 20,
    fontFamily: "droidAr" ,
    color: "white" 
    
  },
  listRequiremnt : {
    padding : 15 , 
    gap : 10 , 
    display : "flex" ,
    
  },
  singleCheck : {
    display : "flex" , 
    width : "100%" , 
    justifyContent: 'flex-end',
    alignItems :"center" , 
    flexDirection  : "row" , 
    gap : 3
    

  } , 

  seperatorView: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginVertical: 30,
  },
  seperator: {
    fontFamily : "droidAr",
    color: Colors.grey,
    fontSize: 16,
  },
  btnOutline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.grey,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  btnOutlineText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'droidAr',
  },
  whatsappButton: {
    position: 'absolute',
    bottom: '-20%',
    alignSelf: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 25,
    width: "50%",
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
