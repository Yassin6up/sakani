import { configureStore } from '@reduxjs/toolkit';


import publishData from './slices/publish';
import places from "./slices/posts"
export default configureStore({
  reducer: {
    publishData: publishData,
    places : places
  },
});