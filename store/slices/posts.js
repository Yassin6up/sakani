import { createSlice } from '@reduxjs/toolkit';


let initialState ={
  value: {
    places : []
    }
}

const places = createSlice({
  name: 'places',
  initialState ,
  reducers: {
    setPlaces: (state, action) => {
      console.log("start seting places")
      console.log("action :" , action.payload)
      state.value.places = action.payload;
    },
  },
});

export const {
  setPlaces,
} = places.actions;

export default places.reducer;
