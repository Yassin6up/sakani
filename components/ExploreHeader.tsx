import React, { useState, useRef } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons, MaterialIcons, Entypo, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Link, router } from 'expo-router';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import { useDispatch } from 'react-redux';
import { setPlaces } from '@/store/slices/posts';
interface Props {
  onCategoryChanged: (category: string) => void;
}
import { SafeAreaProvider } from "react-native-safe-area-context";


const ExploreHeader = ({ onCategoryChanged }: Props) => {
  const scrollRef = useRef<ScrollView>(null);
  const itemsRef = useRef<Array<TouchableOpacity | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedType, setSelectedType] = useState('rent'); // Added state for selected type
  const [selectedCategory1 , setSelectedCat] = useState("")

  const dispatch = useDispatch()
  const selectCategory = (index: number, type: string) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);
    selected?.measure((x) => {
      scrollRef.current?.scrollTo({ x: x - 16, y: 0, animated: true });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const categoryList = 
    type === 'للإيجار' ? categoriesRent :
    type === 'للبيع' ? categoriesSale :
    categoriesBooking; // Assuming 'categoriesDays' was intended to be 'categoriesBooking'
      
    const selectedCategory = categoryList[index].slug;
    onCategoryChanged(selectedCategory);
    setSelectedCat(selectedCategory)

    console.log("type :" , type)
    console.log("selected category :" , selectedCategory)

    let url = `https://backend.sakanijo.com/api/places?category=${selectedCategory}&type=${type}`

    
    
    // Send data to backend
    axios.get(selectedCategory ==="الكل" ?"https://backend.sakanijo.com/api/places" : url )
    .then(response => {
      
      console.log('Data sent successfully:', response.data.places);
      dispatch(setPlaces(response.data.places))

    })
    .catch(error => {
      console.error('Error sending data:', error);
    });
  }

  const { t } = useTranslation();

  const categoriesSale = [
    {
      name: t('all'),
      icon: 'local-fire-department',
      slug: 'الكل',
    },
    {
      name: t('apartment'),
      icon: 'apartment',
      slug: 'شقة',
    },
    {
      name: t('home'),
      icon: 'home',
      slug: 'منزل',
    },
    {
      name: t('agriculture'),
      icon: 'agriculture',
      slug: 'مزرعة',
    },
    {
      name: t('terrain'),
      icon: 'terrain',
      slug: 'ارض',
    },
    {
      name: t('houseboat'),
      icon: 'chalet',
      slug: 'شاليهات',
    },
    {
      name: t('studio'),
      icon: 'view-quilt',
      slug: 'استوديوهات',
    }
  ];
  
  const categoriesRent = [
    {
      name: t('all'),
      icon: 'local-fire-department',
      slug: 'الكل',
    },
    {
      name: t('apartment'),
      icon: 'apartment',
      slug: 'شقة',
    },
    {
      name: t('home'),
      icon: 'home',
      slug: 'منزل',
    },
    {
      name: t('agriculture'),
      icon: 'agriculture',
      slug: 'مزرعة',
    },
    {
      name: t('terrain'),
      icon: 'terrain',
      slug: 'ارض',
    }
  ];
  

  const categoriesBooking = [
    {
      name: t('all'),
      icon: 'local-fire-department',
      slug: 'الكل',
    },
    {
      name: t('furnished_apartment'),
      icon: 'apartment',
      slug: 'شقة',
    },
    {
      name: t('home'),
      icon: 'home',
      slug: 'منزل',
    },
    {
      name: t('houseboat'),
      icon: 'chalet',
      slug: 'شاليهات',
    },
    {
      name: t('studio'),
      icon: 'view-quilt',
      slug: 'استوديوهات',
    },
    {
      name: t('agriculture'),
      icon: 'agriculture',
      slug: 'مزرعة',
    },
    {
      name: t('swimming_pools'),
      icon: 'pool',
      slug: 'مسابح',
    },
    {
      name: t('sports_fields'),
      icon: 'stadium',
      slug: 'ملاعب كرة القدم',
    },
    {
      name: t('mens_fitness_centers'),
      icon: 'sports-martial-arts',
      slug: 'مراكز لياقة بدنية للرجال',
    },
    {
      name: t('womens_fitness_centers'),
      icon: 'sports-gymnastics',
      slug: 'مراكز لياقة بدنية للنساء',
    },
    {
      name: t('trip_organizing'),
      icon: 'hiking',
      slug: 'تنظيم رحلات ومغامرات',
    },
    {
      name: t('camps_and_cabins'),
      icon: 'cabin',
      slug: 'مخيمات وكبائن',
    }
  ];
  

  const renderCategories = (type: string) => {
    console.log("type :" , type)
    const categoryList = 
    type === 'للإيجار' ? categoriesRent :
    type === 'للبيع' ? categoriesSale :
    categoriesBooking; // Assuming 'categoriesDays' was intended to be 'categoriesBooking'

    return categoryList.map((item, index) => (
      <TouchableOpacity
        ref={(el) => (itemsRef.current[index] = el)}
        key={index}
        style={activeIndex === index ? styles.categoriesBtnActive : styles.categoriesBtn}
        onPress={() => selectCategory(index, type)}>
        <MaterialIcons
          name={item.icon}
          size={24}
          color={activeIndex === index ? '#000' : '#BDBDBD'}
        />
        <Text style={activeIndex === index ? styles.categoryTextActive : styles.categoryText}>
          {item.name}
        </Text>
      </TouchableOpacity>
    ));
  };
  console.log( "selected :" ,selectedCategory1)

  return (
    // <SafeAreaView style={{ backgroundColor: '#fff' , zIndex : 100000 }}>
      <View style={[styles.container ,  {zIndex : 100000 , position: "absolute"}]}>
        <View style={{...styles.actionRow , marginTop : 20 }}>

          <Link href={"/FilterPlace"} asChild>
            <TouchableOpacity>
              <View style={styles.searchBtn}>
                <Ionicons name="search" size={24} />
                <View>
                  <Text style={{ fontFamily: 'droidAr' }}>{t('search')}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity style={styles.filterBtn} onPress={()=>{
            router.navigate(selectedCategory1 === "منزل" || selectedCategory1 === "شقة"  || selectedCategory1 === "مزرعة" || selectedCategory1 === "ارض"  ? `/Filter?type=${selectedCategory1}` :'/(modals)/booking')
          }}>
            <Ionicons name="options-outline" size={24} />
          </TouchableOpacity>

        </View>
        <View style={styles.MainFilter}>
          <View style={styles.filterRow}>
            <Pressable style={styles.rowChild} onPress={() => setSelectedType('للإيجار')}>
              <Text style={selectedType === "للإيجار" ? { ...styles.filterText, color: Colors.primary, fontWeight: "bold" } : styles.filterText}>{t('rent')}</Text>
              <FontAwesome5 name="door-open" size={20} color={selectedType === "للإيجار" ? Colors.primary : "#BDBDBD"} />
            </Pressable>

            <View style={styles.beforElement}></View>

            <Pressable style={styles.rowChild} onPress={() => setSelectedType('للبيع')}>
              <Text style={selectedType === "للبيع" ? { ...styles.filterText, color: Colors.primary, fontWeight: "bold" } : styles.filterText}>{t('sell')}</Text>
              <Entypo name="key" size={20} color={selectedType === "للبيع" ? Colors.primary : "#BDBDBD"} />
            </Pressable>
            <View style={styles.beforElement}></View>
            <Pressable style={styles.rowChild} onPress={() => setSelectedType('الحجز')}>
              <Text style={selectedType === "الحجز" ? { ...styles.filterText, color: Colors.primary, fontWeight: "bold" } : styles.filterText}>{t('booking')}</Text>
              <AntDesign name="calendar" size={20} color={selectedType === "الحجز" ? Colors.primary : "#BDBDBD"} />
            </Pressable>
          </View>
        </View>


        <ScrollView
          horizontal
          ref={scrollRef}
          scrollEnabled

          showsHorizontalScrollIndicator={false}

          contentContainerStyle={{
            alignItems: 'center',
            backgroundColor: "transparent",
            gap: 20,
            paddingHorizontal: 16,
            zIndex :600000
          }}>

          {renderCategories(selectedType)}
        </ScrollView>


      </View>
    // </SafeAreaView>
  );

};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    zIndex : 1000 ,
    elevation: 2,
    width : "100%" ,
    justifyContent: "space-between",
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    direction: "rtl",
    shadowOffset: {
      width: 1,
      height: 10,
    },
    
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    width : '100%' , 
    gap : 10
  },
  MainFilter: {
    width: "100%",
  },

  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
  },

  filterText: {
    fontSize: 16,
    fontFamily: 'droidAr',
    color: '#000',
  },
  rowChild : {
    display :"flex" , 
    flexDirection : "row", 
    alignItems : "center" , 
    

  } , 

  beforElement: {
    height: "80%",
    width: 1,
    backgroundColor: "#BDBDBD"
  },
  searchBtn: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    alignItems: 'center',
    width: 280,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#c2c2c2',
    borderRadius: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  filterBtn: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#A2A0A2',
    borderRadius: 24,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'droidAr',
    color: '#BDBDBD',
  },
  categoryTextActive: {
    fontSize: 14,
    fontFamily: 'droidAr',
    color: '#000',
  },
  categoriesBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
  },
  categoriesBtnActive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#000',
    borderBottomWidth: 2,
    paddingBottom: 8,
  },
});

export default ExploreHeader;
