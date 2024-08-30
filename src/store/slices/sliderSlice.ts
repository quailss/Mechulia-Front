import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SliderState {
    currentIndex: number;
}

const initialState: SliderState = {
    currentIndex: 0,
};

//슬라이더 정의
const sliderSlice = createSlice({
    name: 'slider',
    initialState,
    reducers: {
        nextSlide(state){
            state.currentIndex += 1;
        },
        prevSlide(state) {
            state.currentIndex -= 1;
        },
        setSlide(state, action: PayloadAction<number>) {
            state.currentIndex = action.payload;
        },
    },
});

export const { nextSlide, prevSlide, setSlide } = sliderSlice.actions;
export default sliderSlice.reducer;