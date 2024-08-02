import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameApi } from '../api/game.api';
import { RootState } from '../app/store';

export interface GameContextState {
    countDrivers: number;
    countBusses: number;
    countRoutes: number;
    money: number;
    gameTime: string;

    init: boolean;
}

const initialState: GameContextState = {
    countBusses: 0,
    countDrivers: 0,
    countRoutes: 0,
    money: 0,
    gameTime: '00:00',
    init: false
};

export const loadDataAsync = createAsyncThunk(
    'context/load',
    async (_, { rejectWithValue }) => {
        const gameData = await GameApi.getPlayerScore();

        if (gameData) {
            return gameData;
        } else {
            return rejectWithValue(null);
        }
    }
)

export const gameContextSlice = createSlice({
    name: 'gameContext',
    initialState,
    reducers: {
        decrementMoney: (state: GameContextState, action: PayloadAction<number>) => {
            state.money = Math.round((state.money - action.payload) * 100) / 100;
        },
        incrementMoney: (state: GameContextState, action: PayloadAction<number>) => {
            state.money = Math.round((state.money + action.payload) * 100) / 100;
        },
        incCountBusses: (state: GameContextState) => {
            state.countBusses += 1;
        },
        incCountDrivers: (state: GameContextState) => {
            state.countDrivers += 1;
        },
        decCountDrivers: (state: GameContextState) => {
            state.countDrivers -= 1;
        },
        decCountBusses: (state: GameContextState) => {
            state.countBusses -= 1;
        },
        incCountRoutes: (state: GameContextState) => {
            state.countRoutes += 1;
        },
        decCountRoutes: (state: GameContextState) => {
            state.countRoutes -= 1;
        },
        setTime: (state, payload: PayloadAction<string>) => {
            state.gameTime = payload.payload;
        },
        setMoney: (state, payload: PayloadAction<number>) => {
            state.money = payload.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(loadDataAsync.fulfilled, (state, action) => {
                state.countBusses = action.payload.countBusses;
                state.countDrivers = action.payload.countDrivers;
                state.money = action.payload.money;
                state.gameTime = action.payload.gameTime;
                state.countRoutes = action.payload.countRoutes;

                state.init = true;
            });
    }
});

export const { setTime, setMoney, decrementMoney, incCountBusses, incCountDrivers, decCountDrivers, decCountBusses, incrementMoney, incCountRoutes, decCountRoutes } = gameContextSlice.actions;

export const selectGameContext = (state: RootState) => state.gameContext;

export const gameContextReducer = gameContextSlice.reducer;
