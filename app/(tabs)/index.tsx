import { View } from 'react-native';
import React, { useMemo, useState , useEffect } from 'react';
import ListingsBottomSheet from '@/components/ListingsBottomSheet';
import listingsData from '@/assets/data/airbnb-listings.json';
import ListingsMap from '@/components/ListingsMap';
import listingsDataGeo from '@/assets/data/airbnb-listings.geo.json';
import { Stack } from 'expo-router';
import ExploreHeader from '@/components/ExploreHeader';
import axios from "axios"
import { useDispatch  , useSelector} from 'react-redux';
import { setPlaces } from '@/store/slices/posts';
const Page = () => {
  const items = useSelector((state)=> state.places.value.places)
  
  // const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch()



  useEffect(() => {
    const fetchData = async () => {
      try {  
        const response = await axios.get('https://backend.sakanijo.com/api/places');
        console.log("response :" , response.data.places)
        // setData(response.data.places);
        dispatch(setPlaces(response.data.places))
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


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
      
      <ListingsMap listings={items} />
      <ListingsBottomSheet listings={items} category={category} />
    </View>
  );
};

export default Page;
