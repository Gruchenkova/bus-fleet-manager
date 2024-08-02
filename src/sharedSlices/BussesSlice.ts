import { BusModel } from 'shared/models/response/BusModel';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BusApi } from '../api/bus.api';
import { RootState } from '../app/store';
import { decCountBusses, incrementMoney } from './GameContextSlice';

interface BussesData {
    busses: BusModel[];
    limit: number;
    offset: number;
    loaded: boolean;
}

const initialState: BussesData = {
    busses: [],
    limit: 10,
    offset: 0,
    loaded: false
};

export const loadBussesAsync = createAsyncThunk(
    'busses/fetch',
    async (context: { offset: number, limit: number }, { rejectWithValue }) => {
        const data = await BusApi.getBusses(context.limit, context.offset);

        if (data) {
            return {
                busses: data,
                ...context
            };
        } else {
            return rejectWithValue(null);
        }
    }
)

export const sellBusAsync = createAsyncThunk(
    'busses/sell',
    async (context: { busId: string, price: number }, { rejectWithValue, dispatch }) => {
        const response = await BusApi.sellBus(context.busId);

        if (response) {
            dispatch(decCountBusses());
            dispatch(incrementMoney(context.price));

            return context;
        } else {
            return rejectWithValue(null);
        }
    }
);

export const repairBusAsync = createAsyncThunk(
    'busses/repair',
    async (busId: string, { rejectWithValue, dispatch }) => {
        const response = await BusApi.repairBus(busId);

        if (response) {
            return busId;
        } else {
            return rejectWithValue(null);
        }
    }
);

export const bussesSlice = createSlice({
    name: 'busses',
    initialState,
    reducers: {
        resetBusListState: (state, payload) => {
            state.loaded = false;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(loadBussesAsync.fulfilled, (state, action) => {
                state.busses = action.payload.busses;
                state.limit = action.payload.limit;
                state.offset = action.payload.offset;
                state.loaded = true;
            });

        builder
            .addCase(sellBusAsync.fulfilled, (state, action) => {
                state.busses = state.busses.filter(bus => bus.id != action.payload.busId);
            });

        builder
            .addCase(repairBusAsync.fulfilled, (state, action) => {
                state.busses = state.busses.map(bus => {
                    if (bus.id == action.payload) {
                        return {
                            ...bus,
                            isRepairing: true
                        };
                    }

                    return { ...bus };
                })
            });
    }
});

export const { resetBusListState } = bussesSlice.actions;

export const selectBusses = (state: RootState) => state.busses;

export const bussesReducer = bussesSlice.reducer;
