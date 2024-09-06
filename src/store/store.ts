import { configureStore } from "@reduxjs/toolkit";
import sliderReducer from "./slices/sliderSlice";
import locationReducer from "./slices/locationSlice";
import restaurantReducer from "./slices/restaurantSlice";
import categoryReducer from "./slices/categorySlice";

export const store = configureStore({
    reducer: {
        slider: sliderReducer,
        location: locationReducer,
        category: categoryReducer,
        restaurants: restaurantReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;