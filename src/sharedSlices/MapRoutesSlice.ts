import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { MapRouteCreateDto } from 'shared/models/MapRouteCreateDto';
import { MapRouteApi } from '../api/mapRoute.api';
import { MapRouteModel } from 'shared/models/MapRouteModel';
import { decCountRoutes, incCountRoutes } from './GameContextSlice';

interface MapRoutesContext {
    routes: MapRouteModel[];
    init: boolean;
}

const initialState: MapRoutesContext = {
    routes: [],
    init: false
};

export const loadMapRoutesAsync = createAsyncThunk(
    'mapRoutes/load',
    async (context: { offset: number, limit: number }, thunkApi) => {
        const response = await MapRouteApi.getRoutes(context.offset, context.limit);

        if (response) {
            return response;
        }

        return thunkApi.rejectWithValue(null);
    }
);

export const createMapRouteAsync = createAsyncThunk(
    'mapRoutes/create',
    async (context: MapRouteCreateDto, thunkApi) => {
        const status = await MapRouteApi.createRoute(context);

        if (status) {
            thunkApi.dispatch(incCountRoutes());

            return status;
        }

        return thunkApi.rejectWithValue(null);
    }
);

export const updateMapRouteAsync = createAsyncThunk(
    'mapRoutes/update',
    async (context: { model: MapRouteCreateDto, id: string }, thunkApi) => {
        const status = await MapRouteApi.updateRoute(context.id, context.model);

        if (status) {
            thunkApi.dispatch(incCountRoutes());

            return status;
        }

        return thunkApi.rejectWithValue(null);
    }
);

export const deleteMapRouteAsync = createAsyncThunk(
    'mapRoutes/delete',
    async (id: string, thunkApi) => {
        const status = await MapRouteApi.deleteRoute(id);

        if (status) {
            thunkApi.dispatch(decCountRoutes());

            return status;
        }

        return thunkApi.rejectWithValue(null);
    }
)

export const mapRoutesSlice = createSlice({
    name: 'mapRoutes',
    initialState,
    reducers: {
        resetMapRouteList: (state, payload) => {
            state.init = false;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(createMapRouteAsync.fulfilled, (state, payload) => {
                state.init = false;
            });

        builder
            .addCase(updateMapRouteAsync.fulfilled, (state, payload) => {
                state.init = false;
            });

        builder
            .addCase(loadMapRoutesAsync.fulfilled, (state, payload) => {
                state.init = true;
                state.routes = payload.payload;
            });

        builder
            .addCase(deleteMapRouteAsync.fulfilled, (state, payload) => {
                state.init = false;
            })
    }
});

export const { resetMapRouteList } = mapRoutesSlice.actions;

export const selectMapRoutes = (state: RootState) => state.mapRoutes;
export const selectMapRouteById = (id: string) => (state: RootState) => state.mapRoutes.routes.find(route => route.id === id);

export const mapRoutesReducer = mapRoutesSlice.reducer;

