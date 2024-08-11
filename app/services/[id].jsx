import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View, StyleSheet, TextInput, Text, TouchableOpacity , ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const Page = () => {



  return (
    <ScrollView style={styles.container}>

    <View style={{ position : "relative" , 
    top: "-10%" , height:140 , width : "100%" , backgroundColor : Colors.primary , borderRadius : 100, 
    display :"flex" , justifyContent : "flex-end", alignItems : "center" }}>
    <Text style={styles.title}>عقود الإيجار</Text>
    </View>
    <Text style={{textAlign : "center" , fontFamily: "droidAr" , fontSize : 18 , marginTop    : "-30px"}}>تمكنك هذه الخدمة من توثيق عقود الإيجار من خلال منصة إيجار. سواء العقود السكنية أو التجارية</Text>
     <Text style={{padding : 5 ,marginTop :  30 ,  fontFamily: "droidAr" }}>لعمل عقد إيجار رسمي، الرجاء إرسال المستندات التالية عبر الواتساب:</Text>
      <View style={styles.listRequiremnt}>
          <View style={styles.singleCheck}>
            <Text style={{fontFamily :"droidAr" }}>صورة بطاقة المستأجر.</Text>
            <AntDesign name="checkcircle" size={24} color={Colors.primary} />
           </View>
           <View style={styles.singleCheck}>
            <Text style={{fontFamily :"droidAr" }}>صورة بطاقة المالك.</Text>
            <AntDesign name="checkcircle" size={24} color={Colors.primary} />
           </View>
           <View style={styles.singleCheck}>
            <Text style={{fontFamily :"droidAr" }}>صورة الصك.</Text>
            <AntDesign name="checkcircle" size={24} color={Colors.primary} />
           </View>
      </View>
      <View style={{textAlign : "right" , width : "100%" , display : "flex" , alginItems : "flex-end" ,  }}>
        <Text style={{padding : 5 ,marginTop :  30 ,  fontFamily: "droidAr" , backgrouondColor : "red" , }}>ساعات العمل:</Text>
      </View>
      <View style={styles.listRequiremnt}>
          <View style={styles.singleCheck}>
            <Text style={{fontFamily :"droidAr" }}> من الأحد الى الخميس.</Text>
            <Ionicons name="calendar" size={24} color={Colors.primary} />
            </View>
           <View style={styles.singleCheck}>
            <Text style={{fontFamily :"droidAr" }}>8 صباحاً - 4 عصراً</Text>
            <Ionicons name="time" size={24} color={Colors.primary} />
           </View>
      </View>
      
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
    bottom: 30,
    alignSelf: 'right',
    backgroundColor: Colors.primary,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
