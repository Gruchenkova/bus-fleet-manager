import { DriverModel } from 'shared/models/response/DriverModel';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { DriverApi } from '../api/driver.api';
import { decCountDrivers } from './GameContextSlice';
import { resetRefInfo } from './refInfoSlice';

interface DriversData {
    drivers: DriverModel[],
    init: boolean;
}

const initialState: DriversData = {
    drivers: [],
    init: false
};

export const loadDriversAsync = createAsyncThunk(
    'employees/load',
    async (context: { offset: number, limit: number }, { rejectWithValue }) => {
        const data = await DriverApi.getDrivers(context.limit, context.offset);

        if (data) {
            return data;
        }

        return rejectWithValue(null);
    }
);

export const fireDriverAsync = createAsyncThunk(
    'employees/fire',
    async (driverId: string, { rejectWithValue, dispatch }) => {
        const data = await DriverApi.fireDriver(driverId);

        if (data) {
            dispatch(decCountDrivers());
            return driverId;
        }

        return rejectWithValue(null);
    }
);

export const updateDriverAsync = createAsyncThunk(
    'employees/update',
    async (context: { driverId: string, busId: string, mapRouteId: string }, thunkApi) => {
        const status = await DriverApi.updateDriver(context.driverId, {
            busId: context.busId,
            mapRouteId: context.mapRouteId
        });

        if (status) {
            thunkApi.dispatch(resetRefInfo());

            return status;
        }

        return thunkApi.rejectWithValue(null);
    }
);

export const driverSlice = createSlice({
    name: 'drivers',
    initialState,
    reducers: {
        resetDriverListState: (state) => {
            state.init = false;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(loadDriversAsync.fulfilled, (state, action) => {
                state.init = true;
                state.drivers = action.payload;
            });

        builder
            .addCase(fireDriverAsync.fulfilled, (state, action) => {
                state.init = false;
            });

        builder
            .addCase(updateDriverAsync.fulfilled, (state, _) => {
                state.init = false;
            });
    }
});

export const { resetDriverListState } = driverSlice.actions;

export const selectDrivers = (state: RootState) => state.drivers;

export const driverReducer = driverSlice.reducer;
