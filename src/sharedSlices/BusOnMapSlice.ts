import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface BusOnMapSliceContext {
    coordinates: { x: number; y: number }[];
}

const initialState: BusOnMapSliceContext = {
    coordinates: []
};

const busOnMapSlice = createSlice({
    name: 'busOnMap',
    initialState,
    reducers: {
        setPointsOnMap: (state, payload: PayloadAction<{ x: number; y: number }[]>) => {
            state.coordinates = payload.payload;
        }
    }
});

export const { setPointsOnMap } = busOnMapSlice.actions;

export const selectBusPoint = (state: RootState) => state.busPointOnMap;

export const busOnMapReducer = busOnMapSlice.reducer;
