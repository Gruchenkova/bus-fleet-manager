import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { MapPoint } from 'shared/models/MapPointModel';
import { MapPointApi } from '../api/mapPoint.api';

interface MapPointsContext {
    points: MapPoint[];
    init: boolean;
}

export const loadMapPointsAsync = createAsyncThunk(
    'mapPoints/load',
    async (_, { rejectWithValue }) => {
        const points = await MapPointApi.getPoints();

        if (points) {
            return points;
        } else {
            return rejectWithValue(null);
        }
    }
)

const initialState: MapPointsContext = {
    points: [],
    init: false
};

export const mapPointsSlice = createSlice({
    name: 'mapPoints',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loadMapPointsAsync.fulfilled, (state, payload) => {
                state.init = true;
                state.points = payload.payload;
            })
    }
});

export const selectMapPoints = (state: RootState) => state.mapPoints;

export const mapPointsReducer = mapPointsSlice.reducer;
