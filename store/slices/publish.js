import { createSlice } from '@reduxjs/toolkit';


let initialState ={
  value: {
    homeType: "شقة",
    price: "",
    priceHide : false ,
    farmHasHouse : "لا",
    farmHasWater : "لا",
    farmHasFarmed : "لا",
    landInFaceOfStreet :"لا" , 
    numberOfStreetsInLand : null ,
    spaceGeneral : null ,
    numberOfHomeStage : null , 
    totalStages : null ,
    numberOfRooms: {
      kitchen: 1,
      rooms: 2,
      bathroom: 1,
      stages : 1
    },
    buyOrRent : "للبيع",
    rentType : "شهري",
    ownerStatus : "",
    location: "",
    amenities: [],
    images: [],
    description: "",
    title: "" , 
    hajezDays :  ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'] ,
    hajezType : "24ساعة",
    variablePrices: {} , 
    publisherState : 'ملك'  ,
    adsAccept  : "لا" , 
    specificDaysInCalander : [] ,
    specificDaysCalanderPrice : "" ,
    longitude : 0 , 
    latitude : 0 , 
    address : "" , 
    poolType : "رجالي"    ,
    deepPool : "1متر" ,
    gettingCalls : "whatsapp" ,
    containSdah : false  , 
    evacuation : false , 
    tripLong : "15day" , 
    tripDate : "" ,
    timeOpen : {
      start : null ,
      end : null
    }
  
  }
}

const publishData = createSlice({
  name: 'publish',
  initialState ,
  reducers: {
    setTimeStart : (state, action)=>{
      state.value.timeOpen.start = action.payload;
    },
    setTimeEnd : (state, action)=>{
      state.value.timeOpen.end = action.payload;
    },
    setTriDate : (state, action)=>{
      state.value.tripDate = action.payload;
    },
    setTripLong : (state, action)=>{
      state.value.tripLong = action.payload;
    },
    setEvacuation : (state, action)=>{
      state.value.evacuation = action.payload;
    },
    setContainSdah : (state, action)=>{
      state.value.containSdah = action.payload;
    },
    setGettingCalls : (state, action)=>{
      state.value.gettingCalls = action.payload;
    },
    setDeepPool : (state, action)=>{
      state.value.deepPool = action.payload;
    },
    setTypePool : (state, action)=>{
      state.value.poolType = action.payload;
    },
    setDaysInCalander : (state, action)=>{
      state.value.specificDaysInCalander = action.payload;

    },
    setAdress : (state, action)=>{
      state.value.address = action.payload;

    },
    setCoordinateData : (state, action)=>{
      state.value.latitude = action.payload.latitude;
      state.value.longitude = action.payload.longitude;

    },
    setPriceCalander : (state, action)=>{
      state.value.specificDaysCalanderPrice = action.payload;

    },
    setPriceHide : (state, action)=>{
      state.value.priceHide = action.payload;

    },
    setHomeType: (state, action) => {
      state.value.homeType = action.payload;
    },
    incrementRoomsNumber: (state, action) => {
      const { rooms, kitchen, bathroom , stages } = action.payload;
      state.value.numberOfRooms.rooms += rooms;
      state.value.numberOfRooms.kitchen += kitchen;
      state.value.numberOfRooms.bathroom += bathroom;
      state.value.numberOfRooms.stages += stages;

    },
    decrementRoomsNumber: (state, action) => {
      const { rooms, kitchen, bathroom  , stages} = action.payload;
      state.value.numberOfRooms.rooms = Math.max(state.value.numberOfRooms.rooms - rooms, 0);
      state.value.numberOfRooms.kitchen = Math.max(state.value.numberOfRooms.kitchen - kitchen, 0);
      state.value.numberOfRooms.bathroom = Math.max(state.value.numberOfRooms.bathroom - bathroom, 0);
      state.value.numberOfRooms.stages = Math.max(state.value.numberOfRooms.stages - stages, 0);

    },
    addImages : (state , action)=>{
        state.value.images = [...state.value.images, action.payload]
    },
    deleteImage : (state , action)=>{
        let index =action.payload
        state.value.images = state.value.images.filter((e,i)=>{
            return i !== index
        })
    },
    setLocation:(state , action)=> {

    } , 
    setamenities : (state , action)=>{
      state.value.amenities.push(action.payload)
    } ,
    setHajez : (state , action)=>{
      const day = action.payload;
      console.log("day selected : " ,day)
      if (state.value.hajezDays.includes(day)) {
        // If the day is already selected, remove it
        state.value.hajezDays = state.value.hajezDays.filter(d => d !== day);
      } else {
        // Otherwise, add it
        state.value.hajezDays.push(day);
      }
    } ,
    setVariablePrice : (state, action) => {
      const { day, price } = action.payload;
      state.value.variablePrices[day] = price;
    },
    setFarmHasHouse : (state , action)=>{
      state.value.farmHasHouse = action.payload
    } , 
    setFarmHasWater : (state , action)=>{
      state.value.farmHasWater = action.payload
    } , 
    setFarmHasFarmed : (state , action)=>{
      state.value.farmHasFarmed = action.payload
    } , 
    setLandInFaceOfStreet : (state , action)=>{
      state.value.landInFaceOfStreet = action.payload
    },
    setNumberOfStreetsInLand : (state , action)=>{
      state.value.numberOfStreetsInLand = action.payload
    } ,
    setSpaceGeneral : (state , action)=>{
      state.value.spaceGeneral = action.payload
    } ,
    setTotalStages : (state , action)=>{
      state.value.totalStages = action.payload
    } ,
    setCurrentHomeStage : (state , action)=>{
      state.value.numberOfHomeStage = action.payload
    } ,
    setTitle : (state , action)=>{
      state.value.title = action.payload
    } ,
    setDescription : (state , action)=>{
      state.value.description = action.payload
    } , 
    setPrice : (state , action)=>{
      state.value.price = action.payload
    },
    setBuyOrRent : (state , action)=>{
      state.value.buyOrRent = action.payload
    } ,
    setRentType: (state , action)=>{
      state.value.rentType = action.payload
    },
    setOwnerStatus: (state , action)=>{
      state.value.ownerStatus = action.payload
    },
    setResetAll : (state , action)=>{
      state.value = initialState.value
    } , 
    setHajezType : (state , action)=>{
      state.value.hajezType = action.payload
    }
,
setPublisherType : (state , action)=>{
  state.value.publisherState = action.payload
},
setAdsAccept: (state , action)=>{
  state.value.adsAccept = action.payload
}

  },
});

export const {
  setDescription ,
  setTitle ,
  setHomeType,
  setSpaceGeneral ,
  setTotalStages ,
  setCurrentHomeStage ,
  incrementRoomsNumber,
  decrementRoomsNumber,
  addImages , 
  deleteImage , 
  setamenities ,
  setFarmHasHouse , 
  setFarmHasWater ,
  setFarmHasFarmed , 
  setLandInFaceOfStreet , 
  setNumberOfStreetsInLand , 
  setPrice,
  setBuyOrRent ,
  setRentType ,
  setOwnerStatus ,
  setResetAll ,
  setHajez ,
  setVariablePrice ,
  setHajezType ,
  setPublisherType ,
  setAdsAccept ,
  setPriceHide ,
  setPriceCalander ,
  setDaysInCalander , 
  setCoordinateData ,
  setAdress ,
  setTypePool ,
  setDeepPool ,
  setGettingCalls,
  setContainSdah ,
  setEvacuation ,
  setTripLong ,
  setTriDate ,
  setTimeEnd ,
  setTimeStart



} = publishData.actions;

export default publishData.reducer;
