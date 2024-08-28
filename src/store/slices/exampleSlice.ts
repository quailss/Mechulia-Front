import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: 0
};

const exampleSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: state => {
            // 카운터 값을 증가시킵니다.
            state.value += 1;
        },
        decrement: state => {
            // 카운터 값을 감소시킵니다.
            state.value -= 1;
        },
        incrementByAmount: (state, action) => {
            // 페이로드로 받은 값만큼 카운터 값을 증가시킵니다.
            state.value += action.payload;
        }
    }
});

// 생성한 액션 생성자 함수와 리듀서를 내보냅니다.
export const { increment, decrement, incrementByAmount } = exampleSlice.actions;
export default exampleSlice.reducer;