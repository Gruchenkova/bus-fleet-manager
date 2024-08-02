import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { userReducer } from '../sharedSlices/UserSlice';
import { gameContextReducer } from '../sharedSlices/GameContextSlice';
import { busOnShopReducer } from '../sharedSlices/BusOnShopSlice';
import { driverOnShopReducer } from '../sharedSlices/DriverOnShopSlice';
import { bussesReducer } from '../sharedSlices/BussesSlice';
import { mapPointsReducer } from '../sharedSlices/MapPointsSlice';
import { mapRoutesReducer } from '../sharedSlices/MapRoutesSlice';
import { driverReducer } from '../sharedSlices/DriverSlice';
import { refInfoReducer } from '../sharedSlices/refInfoSlice';
import { busOnMapReducer } from '../sharedSlices/BusOnMapSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    gameContext: gameContextReducer,
    busOnShop: busOnShopReducer,
    driverOnShop: driverOnShopReducer,
    busses: bussesReducer,
    mapPoints: mapPointsReducer,
    mapRoutes: mapRoutesReducer,
    drivers: driverReducer,
    refInfo: refInfoReducer,
    busPointOnMap: busOnMapReducer
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
