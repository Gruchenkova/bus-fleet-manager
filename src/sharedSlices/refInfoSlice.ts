import { ReferenceInfo } from 'shared/models/response/referenceInfo';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { MapRouteApi } from '../api/mapRoute.api';
import { decCountRoutes } from './GameContextSlice';
import { RefInfoApi } from '../api/refInfo.api';

interface RefInfoContext {
    init: boolean;
    refInfo?: ReferenceInfo;
}

const initialState: RefInfoContext = {
    init: false
};

export const loadRefInfoAsync = createAsyncThunk(
    'refInfo/load',
    async (_, thunkApi) => {
        const data = await RefInfoApi.getRefInfo();

        if (data) {
            return data;
        }

        return thunkApi.rejectWithValue(null);
    }
);

export const refInfoSlice = createSlice({
    name: 'refInfo',
    initialState,
    reducers: {
        resetRefInfo: (state) => {
            state.init = false;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(loadRefInfoAsync.fulfilled, (state, action) => {
                state.init = true;
                state.refInfo = action.payload;
            });
    }
});

export const { resetRefInfo } = refInfoSlice.actions;

export const selectRefInfo = (state: RootState) => state.refInfo;

export const refInfoReducer = refInfoSlice.reducer;
