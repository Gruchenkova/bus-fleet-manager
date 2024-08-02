import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BusOnSaleWithBought } from 'shared/models/BusOnSaleModel';
import { RootState } from '../app/store';
import { BusOnSaleApi } from '../api/busOnSale.api';
import { decrementMoney, incCountBusses } from './GameContextSlice';

interface BusOnShop {
    busses: BusOnSaleWithBought[];
    lastUpdate: Date | null;
}

const initialState: BusOnShop = {
    busses: [],
    lastUpdate: null
};

export const loadBusShopAsync = createAsyncThunk(
    'busOnShop/update',
    async (_, { rejectWithValue }) => {
        const data = await BusOnSaleApi.getBussesOnSale();

        if (data) {
            return data;
        } else {
            return rejectWithValue(null);
        }
    }
);

export const buyBusAsync = createAsyncThunk(
    'busOnShop/buy',
    async (context: {busId: string, cost: number}, { rejectWithValue, dispatch }) => {
        const status = await BusOnSaleApi.buyBus(context.busId);

        if (status) {
            dispatch(decrementMoney(context.cost));
            dispatch(incCountBusses());

            return context.busId;
        } else {
            return rejectWithValue(null);
        }
    }
)

export const busOnShopSlice = createSlice({
    name: 'busOnShop',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loadBusShopAsync.fulfilled, (state, action) => {
                state.busses = action.payload;
                state.lastUpdate = new Date();
            });

        builder
            .addCase(buyBusAsync.fulfilled, (state, action) => {
                state.busses = state.busses.map(bus => {
                    if (bus.busOnSaleId == action.payload) {
                        return {
                            ...bus,
                            bought: true
                        };
                    }

                    return {
                        ...bus
                    };
                });
            });
    }
});

export const {} = busOnShopSlice.actions;

export const selectBusOnShop = (state: RootState) => state.busOnShop;

export const busOnShopReducer = busOnShopSlice.reducer;
