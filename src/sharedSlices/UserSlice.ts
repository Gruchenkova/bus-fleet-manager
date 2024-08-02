import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { HttpClient } from '../utils/httpClient';

export interface UserState {
    name: string;
    authorized: boolean;
}

const initialState: UserState = {
    name: '',
    authorized: false
};

export const loginAsync = createAsyncThunk(
    'user/login',
    async (context: { login: string, password: string }, { rejectWithValue }) => {
        const response = await HttpClient.post({
            url: 'http://localhost:3080/api/auth',
            data: context
        });

        if (!response.successResponse) {
            return rejectWithValue(null);
        }
    }
);

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.name = action.meta.arg.login;
                state.authorized = true;
            });
    }
});

export const {} = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export const userReducer = userSlice.reducer;
