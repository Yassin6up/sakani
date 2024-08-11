// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native';
// import { CheckBox } from 'react-native-elements';
// import { useLocalSearchParams } from 'expo-router';
// import Colors from '@/constants/Colors';

// const citiesInJordan = [
//   {
//     name: "Amman",
//     coordinate: {
//       long: 35.9271,
//       lat: 31.9632,
//     },
//     places: [
//       {
//         name: "جبل عمان",
//         lat: 31.9539,
//         long: 35.9106,
//       },
//       {
//         name: "الصويفية",
//         lat: 31.9563,
//         long: 35.8687,
//       },
//       {
//         name: "خلدا",
//         lat: 31.9744,
//         long: 35.8436,
//       },
//     ],
//   },
//   {
//     name: "Zarqa",
//     coordinate: {
//       long: 36.0230,
//       lat: 32.0728,
//     },
//     places: [
//       {
//         name: "الرصيفة",
//         lat: 32.0178,
//         long: 36.0465,
//       },
//       {
//         name: "الضليل",
//         lat: 32.1082,
//         long: 36.2002,
//       },
//     ],
//   },
//   {
//     name: "Irbid",
//     coordinate: {
//       long: 35.8577,
//       lat: 32.5568,
//     },
//     places: [
//       {
//         name: "الحصن",
//         lat: 32.5574,
//         long: 35.8525,
//       },
//       {
//         name: "بيت راس",
//         lat: 32.5644,
//         long: 35.8765,
//       },
//     ],
//   },
//   // Add more cities and places as needed
// ];

// const featureData = {
//   منزل: [
//     "مفروشة", "مصعد", "شقة طابقية", "بلكونة", "حديقة", "مطبخ راكب", "صالون", "غرفة غسيل", "غرفة تخزين", "تكيف",
//     "حماية نوافذ", "نظام شمسي", "حارس", "خزانة حائط", "أجهزة كهربائية", "ديكور", "نوافذ زجاجية مزدوجة", "نظام حماية"
//   ],
//   مزرعة: [
//     "المياه واصلة", "الكهرباء واصلة", "المجاري واصلة", "حارس مزرعة", "منطقة شواء", "منطقة لعب أطفال", "غرفة الحارس",
//     "إنترنت واي فاي", "الطاقة الشمسية", "منظر بانورامي", "منعزلة عن السكان", "نظام صوتي"
//   ],
//   ارض: [
//     "المياه واصلة", "الكهرباء واصلة", "المجاري واصلة", "مسيجة", "تقع داخل مجمع فيلات", "منظر بانورامي", "مطلّة على الشارع"
//   ],
//   شقة: [
//     "مصعد", "مفروشة", "بلكونة", "مطبخ راكب", "حماية نوافذ", "شقة طابقية", "نوافذ زجاجية مزدوجة", "ديكور", "خزانة حائط"
//   ]
// };

// const Filter = ({ onSubmit }) => {
//   const { type } = useLocalSearchParams();

//   const [location, setLocation] = useState('');
//   const [street, setStreet] = useState('');
//   const [title, setTitle] = useState('');
//   const [minPrice, setMinPrice] = useState('0');
//   const [maxPrice, setMaxPrice] = useState('999');
//   const [homeType, setHomeType] = useState('');
//   const [features, setFeatures] = useState({});

//   const handleFeatureChange = (feature) => {
//     setFeatures({ ...features, [feature]: !features[feature] });
//   };

//   const handleSubmit = () => {
//     const filters = {
//       location,
//       street,
//       title,
//       minPrice,
//       maxPrice,
//       homeType,
//       features,
//     };
//     onSubmit(filters);
//   };

//   const handleReset = () => {
//     setLocation('');
//     setStreet('');
//     setTitle('');
//     setMinPrice('');
//     setMaxPrice('');
//     setHomeType('');
//     setFeatures({});
//   };

//   if (!location) {
//     return (
//       <ScrollView contentContainerStyle={styles.container}>
//         <Text style={styles.label}>اختر المدينة</Text>
//         {citiesInJordan.map((cityData) => (
//           <TouchableOpacity key={cityData.name} onPress={() => setLocation(cityData.name)}>
//             <Text style={styles.item}>{cityData.name}</Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//     );
//   }

//   if (!street) {
//     return (
//       <ScrollView contentContainerStyle={styles.container}>
//         <Text style={styles.label}>اختر الشارع في {location}</Text>
//         {citiesInJordan
//           .find((cityData) => cityData.name === location)
//           .places.map((place) => (
//             <TouchableOpacity key={place.name} onPress={() => setStreet(place.name)}>
//               <Text style={styles.item}>{place.name}</Text>
//             </TouchableOpacity>
//           ))}
//         <Button title="رجوع" onPress={() => setLocation('')} />
//       </ScrollView>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.label}>العنوان</Text>
//       <TextInput
//         style={styles.input}
//         value={title}
//         onChangeText={setTitle}
//         placeholder="أدخل العنوان"
//       />
//       <Text style={styles.label}>أقل سعر</Text>
//       <TextInput
//         style={styles.input}
//         value={minPrice}
//         defaultValue='0'
//         onChangeText={setMinPrice}
//         placeholder="أدخل أقل سعر"
//         keyboardType="numeric"
//       />
//       <Text style={styles.label}>أعلى سعر</Text>
//       <TextInput
//         style={styles.input}
//         value={maxPrice}
//         defaultValue='999'
//         onChangeText={setMaxPrice}
//         placeholder="أدخل أعلى سعر"
//         keyboardType="numeric"
//       />
//       <Text style={styles.label}>ميزات العقار</Text>
//       {featureData[type]?.map((feature) => (
//         <CheckBox
//           key={feature}
//           title={feature}
//           checked={features[feature] || false}
//           onPress={() => handleFeatureChange(feature)}
//           containerStyle={{ backgroundColor: 'transparent' }}
//           textStyle={{ fontFamily: 'DroidArabicKufi' }}
//         />
//       ))}
//       <View style={styles.buttonContainer}>
//         <Button title="رجوع" onPress={() => setStreet('')} />

            
//         <View>
//         <Pressable onPress={handleSubmit} style={styles.submitButton}>
//           <Text style={styles.submitButtonText}>تطبيق الفلاتر</Text>
//         </Pressable>
//         <Pressable style={{marginTop : 10}} onPress={handleReset} >
//             <Text  style={{fontFamily : "droidAr"}}> إعادة تعيين الكل </Text>
//             </Pressable>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
//   label: {
//     marginVertical: 10,
//     fontSize: 16,
//     fontFamily: 'DroidArabicKufi',
//   },
//   input: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     paddingHorizontal: 10,
//     marginBottom: 20,
//     fontFamily: 'DroidArabicKufi',
//   },
//   item: {
//     padding: 15,
//     backgroundColor: '#f9f9f9',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//     fontFamily: 'DroidArabicKufi',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     alignSelf: 'center',
//     justifyContent: 'space-around',
//     width : "80%" ,
//     // alignItems : "center"
//   },
//   submitButton: {
//     backgroundColor: Colors.primary,
//     padding: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 10,
//   },
//   submitButtonText: {
//     fontFamily: 'DroidArabicKufi',
//     color: 'white',
//   },
// });

// export default Filter;




// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native';
// import { CheckBox } from 'react-native-elements';
// import { useLocalSearchParams } from 'expo-router';
// import Colors from '@/constants/Colors';

// const citiesInJordan = [
//   {
//     name: "Amman",
//     coordinate: {
//       long: 35.9271,
//       lat: 31.9632,
//     },
//     places: [
//       {
//         name: "جبل عمان",
//         lat: 31.9539,
//         long: 35.9106,
//       },
//       {
//         name: "الصويفية",
//         lat: 31.9563,
//         long: 35.8687,
//       },
//       {
//         name: "خلدا",
//         lat: 31.9744,
//         long: 35.8436,
//       },
//     ],
//   },
//   {
//     name: "Zarqa",
//     coordinate: {
//       long: 36.0230,
//       lat: 32.0728,
//     },
//     places: [
//       {
//         name: "الرصيفة",
//         lat: 32.0178,
//         long: 36.0465,
//       },
//       {
//         name: "الضليل",
//         lat: 32.1082,
//         long: 36.2002,
//       },
//     ],
//   },
//   {
//     name: "Irbid",
//     coordinate: {
//       long: 35.8577,
//       lat: 32.5568,
//     },
//     places: [
//       {
//         name: "الحصن",
//         lat: 32.5574,
//         long: 35.8525,
//       },
//       {
//         name: "بيت راس",
//         lat: 32.5644,
//         long: 35.8765,
//       },
//     ],
//   },
//   // Add more cities and places as needed
// ];

// const featureData = {
//   منزل: [
//     "مفروشة", "مصعد", "شقة طابقية", "بلكونة", "حديقة", "مطبخ راكب", "صالون", "غرفة غسيل", "غرفة تخزين", "تكيف",
//     "حماية نوافذ", "نظام شمسي", "حارس", "خزانة حائط", "أجهزة كهربائية", "ديكور", "نوافذ زجاجية مزدوجة", "نظام حماية"
//   ],
//   مزرعة: [
//     "المياه واصلة", "الكهرباء واصلة", "المجاري واصلة", "حارس مزرعة", "منطقة شواء", "منطقة لعب أطفال", "غرفة الحارس",
//     "إنترنت واي فاي", "الطاقة الشمسية", "منظر بانورامي", "منعزلة عن السكان", "نظام صوتي"
//   ],
//   ارض: [
//     "المياه واصلة", "الكهرباء واصلة", "المجاري واصلة", "مسيجة", "تقع داخل مجمع فيلات", "منظر بانورامي", "مطلّة على الشارع"
//   ],
//   شقة: [
//     "مصعد", "مفروشة", "بلكونة", "مطبخ راكب", "حماية نوافذ", "شقة طابقية", "نوافذ زجاجية مزدوجة", "ديكور", "خزانة حائط"
//   ]
// };

// const Filter = ({ onSubmit }) => {
//   const { type } = useLocalSearchParams();

//   const [location, setLocation] = useState('');
//   const [street, setStreet] = useState('');
//   const [title, setTitle] = useState('');
//   const [minPrice, setMinPrice] = useState('0');
//   const [maxPrice, setMaxPrice] = useState('999');
//   const [minSpace, setMinSpace] = useState('');
//   const [maxSpace, setMaxSpace] = useState('');
//   const [homeType, setHomeType] = useState('');
//   const [features, setFeatures] = useState({});
//   const [negotiation, setNegotiation] = useState(''); // New state for the negotiation options

//   const handleFeatureChange = (feature) => {
//     setFeatures({ ...features, [feature]: !features[feature] });
//   };

//   const handleNegotiationChange = (option) => {
//     setNegotiation(option);
//   };

//   const handleSubmit = () => {
//     const filters = {
//       location,
//       street,
//       title,
//       minPrice,
//       maxPrice,
//       minSpace,
//       maxSpace,
//       homeType,
//       features,
//       negotiation,
//     };
//     onSubmit(filters);
//   };

//   const handleReset = () => {
//     setLocation('');
//     setStreet('');
//     setTitle('');
//     setMinPrice('');
//     setMaxPrice('');
//     setMinSpace('');
//     setMaxSpace('');
//     setHomeType('');
//     setFeatures({});
//     setNegotiation('');
//   };

//   if (!location) {
//     return (
//       <ScrollView contentContainerStyle={styles.container}>
//         <Text style={styles.label}>اختر المدينة</Text>
//         {citiesInJordan.map((cityData) => (
//           <TouchableOpacity key={cityData.name} onPress={() => setLocation(cityData.name)}>
//             <Text style={styles.item}>{cityData.name}</Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//     );
//   }

//   if (!street) {
//     return (
//       <ScrollView contentContainerStyle={styles.container}>
//         <Text style={styles.label}>اختر الشارع في {location}</Text>
//         {citiesInJordan
//           .find((cityData) => cityData.name === location)
//           .places.map((place) => (
//             <TouchableOpacity key={place.name} onPress={() => setStreet(place.name)}>
//               <Text style={styles.item}>{place.name}</Text>
//             </TouchableOpacity>
//           ))}
//         <Button title="رجوع" onPress={() => setLocation('')} />
//       </ScrollView>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.label}>العنوان</Text>
//       <TextInput
//         style={styles.input}
//         value={title}
//         onChangeText={setTitle}
//         placeholder="أدخل العنوان"
//       />
//       <Text style={styles.label}>أقل سعر</Text>
//       <TextInput
//         style={styles.input}
//         value={minPrice}
//         onChangeText={setMinPrice}
//         placeholder="أدخل أقل سعر"
//         keyboardType="numeric"
//       />
//       <Text style={styles.label}>أعلى سعر</Text>
//       <TextInput
//         style={styles.input}
//         value={maxPrice}
//         onChangeText={setMaxPrice}
//         placeholder="أدخل أعلى سعر"
//         keyboardType="numeric"
//       />
//       <Text style={styles.label}>مساحة العقار (م²)</Text>
//       <View style={styles.row}>
//         <TextInput
//           style={[styles.input, styles.spaceInput]}
//           value={minSpace}
//           onChangeText={setMinSpace}
//           placeholder="أقل مساحة"
//           keyboardType="numeric"
//         />
//         <TextInput
//           style={[styles.input, styles.spaceInput]}
//           value={maxSpace}
//           onChangeText={setMaxSpace}
//           placeholder="أعلى مساحة"
//           keyboardType="numeric"
//         />
//       </View>
//       {type === 'شقة' && (
//         <>
//           <Text style={styles.label}>عدد الغرف في المنزل</Text>
//           <TextInput
//             style={styles.input}
//             value={homeType}
//             onChangeText={setHomeType}
//             placeholder="أدخل عدد الغرف"
//             keyboardType="numeric"
//           />
//           <Text style={styles.label}>رقم الطابق</Text>
//           <TextInput
//             style={styles.input}
//             value={homeType}
//             onChangeText={setHomeType}
//             placeholder="أدخل رقم الطابق"
//             keyboardType="numeric"
//           />
//         </>
//       )}
//       {type === 'مزرعة' && (
//         <>
//           <Text style={styles.label}>المزرعة تحتوي على منزل؟</Text>
//           <CheckBox
//             title="نعم"
//             checked={features['مزرعة تحتوي على منزل']}
//             onPress={() => handleFeatureChange('مزرعة تحتوي على منزل')}
//             containerStyle={styles.checkboxContainer}
//             textStyle={styles.checkboxText}
//           />
//           <Text style={styles.label}>المزرعة بها بئر مياه؟</Text>
//           <CheckBox
//             title="نعم"
//             checked={features['مزرعة بها بئر مياه']}
//             onPress={() => handleFeatureChange('مزرعة بها بئر مياه')}
//             containerStyle={styles.checkboxContainer}
//             textStyle={styles.checkboxText}
//           />
//           <Text style={styles.label}>هل هي مزروعة؟</Text>
//           <CheckBox
//             title="نعم"
//             checked={features['هل هي مزروعة']}
//             onPress={() => handleFeatureChange('هل هي مزروعة')}
//             containerStyle={styles.checkboxContainer}
//             textStyle={styles.checkboxText}
//           />
//         </>
//       )}
//       {type === 'ارض' && (
//         <>
//           <Text style={styles.label}>الأرض تطل على الشارع؟</Text>
//           <CheckBox
//             title="نعم"
//             checked={features['الأرض تطل على الشارع']}
//             onPress={() => handleFeatureChange('الأرض تطل على الشارع')}
//             containerStyle={styles.checkboxContainer}
//             textStyle={styles.checkboxText}
//           />
//           <Text style={styles.label}>عدد الشوارع المحيطة بالأرض</Text>
//           <TextInput
//             style={styles.input}
//             value={homeType}
//             onChangeText={setHomeType}
//             placeholder="أدخل عدد الشوارع"
//             keyboardType="numeric"
//           />
//         </>
//       )}
//       <Text style={styles.label}>الميزات</Text>
//       {(featureData[type] || []).map((feature) => (
//         <CheckBox
//           key={feature}
//           title={feature}
//           checked={features[feature]}
//           onPress={() => handleFeatureChange(feature)}
//           containerStyle={styles.checkboxContainer}
//           textStyle={styles.checkboxText}
//         />
//       ))}
//       <Text style={styles.label}>التفاوض والدفع</Text>
//       {['قابل لتفاوض', 'تقبل التقسيط', 'لا يقبل اي شيئ'].map((option) => (
//         <CheckBox
//           key={option}
//           title={option}
//           checked={negotiation === option}
//           onPress={() => handleNegotiationChange(option)}
//           containerStyle={styles.checkboxContainer}
//           textStyle={styles.checkboxText}
//         />
//       ))}
//       <Button title="بحث" onPress={handleSubmit} />
//       <Button title="إعادة تعيين" onPress={handleReset} />
//       <Button title="رجوع" onPress={() => setStreet('')} />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//   },
//   label: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   input: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     marginBottom: 12,
//     paddingHorizontal: 8,
//     borderRadius: 4,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   spaceInput: {
//     flex: 1,
//     marginHorizontal: 4,
//   },
//   checkboxContainer: {
//     backgroundColor: 'transparent',
//     borderWidth: 0,
//     margin: 0,
//     padding: 0,
//   },
//   checkboxText: {
//     fontSize: 16,
//     fontWeight: 'normal',
//   },
//   item: {
//     fontSize: 16,
//     padding: 8,
//     borderBottomColor: '#ccc',
//     borderBottomWidth: 1,
//   },
// });

// export default Filter;







import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { useLocalSearchParams } from 'expo-router';
import Colors from '@/constants/Colors'; // Assuming you have defined Colors


const featureData = {
  منزل: [
    "مفروشة", "مصعد", "شقة طابقية", "بلكونة", "حديقة", "مطبخ راكب", "صالون", "غرفة غسيل", "غرفة تخزين", "تكيف",
    "حماية نوافذ", "نظام شمسي", "حارس", "خزانة حائط", "أجهزة كهربائية", "ديكور", "نوافذ زجاجية مزدوجة", "نظام حماية"
  ],
  مزرعة: [
    "المياه واصلة", "الكهرباء واصلة", "المجاري واصلة", "حارس مزرعة", "منطقة شواء", "منطقة لعب أطفال", "غرفة الحارس",
    "إنترنت واي فاي", "الطاقة الشمسية", "منظر بانورامي", "منعزلة عن السكان", "نظام صوتي"
  ],
  ارض: [
    "المياه واصلة", "الكهرباء واصلة", "المجاري واصلة", "مسيجة", "تقع داخل مجمع فيلات", "منظر بانورامي", "مطلّة على الشارع"
  ],
  شقة: [
    "مصعد", "مفروشة", "بلكونة", "مطبخ راكب", "حماية نوافذ", "شقة طابقية", "نوافذ زجاجية مزدوجة", "ديكور", "خزانة حائط"
  ]
};

const Filter = ({ onSubmit }) => {
  const { type } = useLocalSearchParams();

  const [location, setLocation] = useState('');
  const [street, setStreet] = useState('');
  const [title, setTitle] = useState('');
  const [minPrice, setMinPrice] = useState('0');
  const [maxPrice, setMaxPrice] = useState('999');
  const [minSpace, setMinSpace] = useState('');
  const [maxSpace, setMaxSpace] = useState('');
  const [homeType, setHomeType] = useState('');
  const [features, setFeatures] = useState({});
  const [negotiation, setNegotiation] = useState('');

  const handleFeatureChange = (feature) => {
    setFeatures({ ...features, [feature]: !features[feature] });
  };

  const handleNegotiationChange = (option) => {
    setNegotiation(option);
  };

  const handleSubmit = () => {
    const filters = {
      location,
      street,
      title,
      minPrice,
      maxPrice,
      minSpace,
      maxSpace,
      homeType,
      features,
      negotiation,
    };
    onSubmit(filters);
  };

  const handleReset = () => {
    setLocation('');
    setStreet('');
    setTitle('');
    setMinPrice('');
    setMaxPrice('');
    setMinSpace('');
    setMaxSpace('');
    setHomeType('');
    setFeatures({});
    setNegotiation('');
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>العنوان</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="أدخل العنوان"
      />
      <Text style={styles.label}>أقل سعر</Text>
      <TextInput
        style={styles.input}
        value={minPrice}
        onChangeText={setMinPrice}
        placeholder="أدخل أقل سعر"
        keyboardType="numeric"
      />
      <Text style={styles.label}>أعلى سعر</Text>
      <TextInput
        style={styles.input}
        value={maxPrice}
        onChangeText={setMaxPrice}
        placeholder="أدخل أعلى سعر"
        keyboardType="numeric"
      />
      <Text style={styles.label}>مساحة العقار (م²)</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.spaceInput]}
          value={minSpace}
          onChangeText={setMinSpace}
          placeholder="أقل مساحة"
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.spaceInput]}
          value={maxSpace}
          onChangeText={setMaxSpace}
          placeholder="أعلى مساحة"
          keyboardType="numeric"
        />
      </View>
      {type === 'شقة' && (
        <>
          <Text style={styles.label}>عدد الغرف في المنزل</Text>
          <TextInput
            style={styles.input}
            value={homeType}
            onChangeText={setHomeType}
            placeholder="أدخل عدد الغرف"
            keyboardType="numeric"
          />
          <Text style={styles.label}>رقم الطابق</Text>
          <TextInput
            style={styles.input}
            value={homeType}
            onChangeText={setHomeType}
            placeholder="أدخل رقم الطابق"
            keyboardType="numeric"
          />
        </>
      )}
      {type === 'مزرعة' && (
        <>
          <Text style={styles.label}>المزرعة تحتوي على منزل؟</Text>
          <CheckBox
            title="نعم"
            checked={features['مزرعة تحتوي على منزل']}
            onPress={() => handleFeatureChange('مزرعة تحتوي على منزل')}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
          />
          <Text style={styles.label}>المزرعة بها بئر مياه؟</Text>
          <CheckBox
            title="نعم"
            checked={features['مزرعة بها بئر مياه']}
            onPress={() => handleFeatureChange('مزرعة بها بئر مياه')}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
          />
          <Text style={styles.label}>هل هي مزروعة؟</Text>
          <CheckBox
            title="نعم"
            checked={features['هل هي مزروعة']}
            onPress={() => handleFeatureChange('هل هي مزروعة')}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
          />
        </>
      )}
      {type === 'ارض' && (
        <>
          <Text style={styles.label}>الأرض تطل على الشارع؟</Text>
          <CheckBox
            title="نعم"
            checked={features['الأرض تطل على الشارع']}
            onPress={() => handleFeatureChange('الأرض تطل على الشارع')}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
          />
          <Text style={styles.label}>تحتوي على حماية؟</Text>
          <CheckBox
            title="نعم"
            checked={features['تحتوي على حماية']}
            onPress={() => handleFeatureChange('تحتوي على حماية')}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
          />
        </>
      )}
      {/* {type === 'شقة' && ( */}
        <>
          <Text style={styles.label}>مميزات العقار</Text>
          {featureData[type].map((feature) => (
            <CheckBox
              key={feature}
              title={feature}
              checked={features[feature]}
              onPress={() => handleFeatureChange(feature)}
              containerStyle={styles.checkboxContainer}
              textStyle={styles.checkboxText}
            />
          ))}
        </>
      {/* )} */}
      <Text style={styles.label}>هل السعر قابل للتفاوض؟</Text>
      {['قابل لتفاوض', 'تقبل التقسيط', 'لا يقبل اي شيئ'].map((option) => (
        <CheckBox
          key={option}
          title={option}
          checked={negotiation === option}
          onPress={() => handleNegotiationChange(option)}
          containerStyle={styles.checkboxContainer}
          textStyle={styles.checkboxText}
        />
      ))}
      <View style={styles.buttonContainer}>
        <Button title="الرجوع" onPress={() => setLocation('')} color={Colors.secondary} />
                 <View>
         <Pressable onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>تطبيق الفلاتر</Text>
         </Pressable>
         <Pressable style={{marginTop : 10}} onPress={handleReset} >
             <Text  style={{fontFamily : "droidAr"}}> إعادة تعيين الكل </Text>
            </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F8F8F8',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Droid Arabic Kufi',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: 'Droid Arabic Kufi',
    marginBottom: 16,
    backgroundColor: '#FFF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  spaceInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#FFF',
    fontFamily: 'Droid Arabic Kufi',
  },
  buttonSelected: {
    backgroundColor: Colors.primary,
  },
  checkboxContainer: {
    backgroundColor: '#FFF',
    borderWidth: 0,
    padding: 0,
    margin: 0,
  },
  checkboxText: {
    fontFamily: 'Droid Arabic Kufi',
    color: '#333',
  },
  item: {
    fontSize: 16,
    fontFamily: 'Droid Arabic Kufi',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
    submitButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  submitButtonText: {
    fontFamily: 'DroidArabicKufi',
    color: 'white',
  },
});

export default Filter;
