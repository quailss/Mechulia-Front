import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface LocationState {
    latitude: number | null;
    longitude: number | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: LocationState = {
    latitude: null,
    longitude: null,
    status: 'idle',
    error: null,
}

//사용자의 현재 위치 정보 받아오기
export const fetchLocation = createAsyncThunk('location/fetchLocation', async() => {
    return new Promise<{ latitude: number; longitude: number}>((resolve, reject) => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    reject(error.message);
                }
            );
        } else {
            reject('Geolocation is not supported by this browser.');
        }
    });
});

const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        resetLocation: (state) => {
            state.latitude = null;
            state.longitude = null;
            state.status = 'idle';
            state.error = null;
        },
    },

    extraReducers: (bulider) => {
        bulider
            .addCase(fetchLocation.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLocation.fulfilled, (state, action: PayloadAction<{ latitude: number; longitude: number}>) => {
                state.latitude = action.payload.latitude;
                state.longitude = action.payload.longitude;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchLocation.rejected, (state,action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch location';
            });
    },
});

export const {resetLocation} = locationSlice.actions;
export default locationSlice.reducer;