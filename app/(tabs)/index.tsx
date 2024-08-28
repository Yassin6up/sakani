import { View , Text, Pressable } from 'react-native';
import React, { useMemo, useState , useEffect } from 'react';
import ListingsBottomSheet from '@/components/ListingsBottomSheet';
import listingsData from '@/assets/data/airbnb-listings.json';
import ListingsMap from '@/components/ListingsMap';
import listingsDataGeo from '@/assets/data/airbnb-listings.geo.json';
import { Stack } from 'expo-router';
import ExploreHeader from '@/components/ExploreHeader';
import axios from "axios"
import { useDispatch  , useSelector} from 'react-redux';
import { setPlaces , setFilter } from '@/store/slices/posts';
import * as SecureStore from 'expo-secure-store';
import Colors from '@/constants/Colors';
import { useTranslation } from 'react-i18next';

const Page = () => {
  const items = useSelector((state)=> state.places.value.places)
  const isFilter = useSelector((state)=> state.places.value.isFilter)

  
  // const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch()
  const {t} = useTranslation()



  useEffect(() => {
    const fetchData = async () => {
      try {  
        // Check if a secure API link is stored
        const storedApiLink = await SecureStore.getItemAsync('apiLink');
        
        // If storedApiLink exists, use it; otherwise, use the default API
        const apiUrl = storedApiLink || 'https://backend.sakanijo.com/api/places';
      if(storedApiLink){
        dispatch(setFilter(true))
      }else{
        dispatch(setFilter(false))
        
      }
        
        const response = await axios.get(apiUrl);
        console.log("response:", response.data.places);
        
        // Update the state with the fetched places data
        dispatch(setPlaces(response.data.places));
      } catch (err) {
        console.error('Error fetching places:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch , isFilter]);



  // const items = useMemo(() => data as any, [loading]);
  // const getoItems = useMemo(() => listingsDataGeo, []);
  const [category, setCategory] = useState<string>('Tiny homes');

  const onDataChanged = (category: string) => {
    setCategory(category);
  };

  return (
    <View style={{ flex: 1 ,position : "relative"}}>
      {/* Define pour custom header */}
     
       <ExploreHeader onCategoryChanged={onDataChanged} />
       {isFilter?
      <Pressable style={{width : 60 , height : 60 , borderRadius : 50 , backgroundColor : Colors.primary , 
        position : "absolute" , top :200 , 
        right : 10 ,   
        zIndex :10000000 ,          
        alignItems : "center",      
        justifyContent : "center"   
      }}
      onPress={async()=>{
        await SecureStore.deleteItemAsync('apiLink')
        dispatch(setFilter(false))
      }}
      >
        <Text style={{fontFamily : "droidAr" , color : "white" , fontSize : 10
        }}>{t("clearFilter")}</Text>
      </Pressable>
    :
    null}

      <ListingsMap listings={items} />
      <ListingsBottomSheet listings={items} category={category} />
    </View>
  );
};

export default Page;
