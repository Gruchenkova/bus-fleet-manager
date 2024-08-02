import { DriverOnSaleWithHired } from 'shared';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { decrementMoney, incCountDrivers } from './GameContextSlice';
import { RootState } from '../app/store';
import { DriverOnSaleApi } from '../api/driverOnSale.api';

interface DriverOnShop {
    drivers: DriverOnSaleWithHired[];
    lastUpdate: Date | null;
}

const initialState: DriverOnShop = {
    drivers: [],
    lastUpdate: null
};

export const loadDriverShopAsync = createAsyncThunk(
    'driverOnShop/update',
    async (_, { rejectWithValue }) => {
        const data = await DriverOnSaleApi.getDriversOnSale();

        if (data) {
            return data;
        } else {
            return rejectWithValue(null);
        }
    }
);

export const hireDriverAsync = createAsyncThunk(
    'driverOnShop/hire',
    async (context: {driverId: string, salary: number}, { rejectWithValue, dispatch }) => {
        const status = await DriverOnSaleApi.hireDriver(context.driverId);

        if (status) {
            dispatch(decrementMoney(context.salary));
            dispatch(incCountDrivers());

            return context.driverId;
        } else {
            return rejectWithValue(null);
        }
    }
)

export const driverOnShopSlice = createSlice({
    name: 'driverOnShop',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loadDriverShopAsync.fulfilled, (state, action) => {
                state.drivers = action.payload;
                state.lastUpdate = new Date();
            });

        builder
            .addCase(hireDriverAsync.fulfilled, (state, action) => {
                state.drivers = state.drivers.map(driver => {
                    if (driver.driverId == action.payload) {
                        return {
                            ...driver,
                            hired: true
                        };
                    }

                    return {
                        ...driver
                    };
                });
            });
    }
});

export const {} = driverOnShopSlice.actions;

export const selectDriverOnShop = (state: RootState) => state.driverOnShop;

export const driverOnShopReducer = driverOnShopSlice.reducer;
