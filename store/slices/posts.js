import { createSlice } from '@reduxjs/toolkit';


let initialState ={
  value: {
    places : [] ,
    isFilter : false , 
    map:{
      lat : 0,
      long : 0
    },
    globalFilter : false  , 
    reloadConnection : false
    }
}

const places = createSlice({
  name: 'places',
  initialState ,
  reducers: {
    setGlobalFilter : (state ,  action)=>{
      state.value.globalFilter = !state.value.globalFilter
    },
    setReloadConnection : (state ,  action)=>{
      state.value.reloadConnection = !state.value.reloadConnection
    },
    setPlaces: (state, action) => {
      console.log("start seting places")
      console.log("action :" , action.payload)
      state.value.places = action.payload;
    },
    setFilter : (state , action )=>{
      state.value.isFilter = action.payload
    },
    setMap : (state , action )=>{
      state.value.map.lat = action.payload.lat
      state.value.map.long = action.payload.long
    }
  },
});

export const {
  setPlaces,
  setFilter ,
  setMap ,
  setGlobalFilter ,
  setReloadConnection
} = places.actions;

export default places.reducer;
