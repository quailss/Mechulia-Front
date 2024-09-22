import { configureStore } from "@reduxjs/toolkit";
import sliderReducer from "./slices/sliderSlice";
import locationReducer from "./slices/locationSlice";
import restaurantReducer from "./slices/restaurantSlice";
import categoryReducer from "./slices/categorySlice";
import menuReducer from "./slices/menuSlice";
import bannerReducer from "./slices/bannerSlice";
import recipeReducer from "./slices/recipeSlice";
import reviewReducer from "./slices/reviewSlice";

export const store = configureStore({
    reducer: {
        slider: sliderReducer,
        location: locationReducer,
        category: categoryReducer,
        restaurants: restaurantReducer,
        menu: menuReducer,
        banner: bannerReducer,
        recipe: recipeReducer,
        review: reviewReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;