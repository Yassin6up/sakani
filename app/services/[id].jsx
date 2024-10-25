import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View, StyleSheet, TextInput, Text, TouchableOpacity , ScrollView, Pressable  ,Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useState , useEffect } from 'react';
import axios from "axios"
const Page = () => {

  const { id } = useLocalSearchParams();

console.log("id :" , id)
const [service, setService] = useState(null);
const [error, setError] = useState(null);
const [listRequired, setList] = useState([]);

const sendWhatsApp = (phoneNumber, text = "") => {
  let whatsappUrl = `whatsapp://send?phone=${phoneNumber}`;
  if (text) {
    whatsappUrl += `&text=${encodeURIComponent(text)}`;
  }
  Linking.openURL(whatsappUrl).catch(() => {
    // Handle error (e.g., WhatsApp not installed)
    alert("الرجاء تاكد من ان الواتساب محمل على جهازك");
  });
};
const makePhoneCall = (phoneNumber) => {
  let phoneUrl = `tel:${phoneNumber}`;
  Linking.openURL(phoneUrl);
};


useEffect(() => {
  const fetchService = async () => {
    try {
      const response = await axios.get(`https://backend.sakanijo.com/api/getOnce/services/${id}`);
      setService(response.data);
      const list = JSON.parse(response.data.required_list) 
      const finnalList = JSON.parse(list)
      setList(finnalList)
      console.log(list)
    } catch (err) {
      console.log(err)
      setError(err.response.data ? err.response.data.error.toString() : 'Error fetching service data');
    }
  };

  fetchService();
}, [id]);

if (error) {
  return <Text>{error}</Text>;
}

if (!service) {
  return <Text>Loading...</Text>;
}
  return (
    <ScrollView style={styles.container}>

    <View style={{ position : "relative" , 
    top: "-2%" , height:140 , width : "100%" , backgroundColor : Colors.primary , borderRadius : 100, 
    display :"flex" , justifyContent : "flex-end", alignItems : "center" }}>
    <Text style={styles.title}>{service.title}</Text>
    </View>
    <Text style={{textAlign : "center" , fontFamily: "droidAr" , fontSize : 18 , marginTop    : "-30px"}}>{service.description}</Text>
     

     {listRequired.length != 0 ?
     
     <>
   
     <Text style={{padding : 5 ,marginTop :  30 ,  fontFamily: "droidAr" }}> للإستفادة من هذه الخدمة لابد من توفر هذه الشروط : </Text>
      <View style={styles.listRequiremnt}>

      {
        listRequired?.map((item)=>{
          return (
            <View style={styles.singleCheck}>
            <Text style={{fontFamily :"droidAr" }}>{item}</Text>
            <AntDesign name="checkcircle" size={24} color={Colors.primary} />
           </View>
          )

        })
      }
      </View>

     </>
     
     
     :
     
     null}
  

      <View style={{textAlign : "right" , width : "100%" , display : "flex" , alginItems : "flex-end" ,  }}>
        <Text style={{padding : 5 ,marginTop :  30 ,  fontFamily: "droidAr" , backgrouondColor : "red" , }}> للتواصل :</Text>
      </View>
      {
        service.phone ?
        <View style={styles.listRequiremnt}>
          <Pressable style={styles.singleCheck}
          onPress={()=>{
            makePhoneCall(service.phone)
          }}
          >
            <Text style={{}}>{service.phone}</Text>
            <Ionicons name="call" size={24} color={Colors.primary} />
            </Pressable>
      </View>
      
      : 
      null
      }
      
      {
        service.wtsLink ?

        <Pressable
      onPress={()=>{
        sendWhatsApp(service.wtsLink , `أريد الأستفادة من هذه الخدمة  ${service.title}`)
      }}
       style={styles.whatsappButton}>
        <View><MaterialCommunityIcons name="whatsapp" size={30} color="white" /></View>
      </Pressable>


        :
        null
      }
      

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
    fontSize: 24,
    padding: 20,
    fontFamily: "droidAr" ,
    color: "white" ,
    textAlign : "center"
    
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
    
    alignSelf: 'right',
    backgroundColor:"#128c7f",
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom : 30
  },
});
