import { Panel } from '../panel/Panel';
import { Stack } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { io } from "socket.io-client";
import { useAppDispatch } from '../../../app/hooks';
import { setMoney, setTime } from '../../../sharedSlices/GameContextSlice';
import { setPointsOnMap } from '../../../sharedSlices/BusOnMapSlice';

function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.pop()?.split(';')?.shift();
}


export function Main() {
    const dispatch = useAppDispatch();

    const socket = io("http://localhost:3080");

    const token = getCookie('accessToken');

    socket.once('connect', () => {
        socket.on('setTime', (data) => {
            dispatch(setTime(data.time));
            dispatch(setMoney(data.money));
        });

        socket.on('setMapPoints', (data) => {
            dispatch(setPointsOnMap(data.coordinates ?? []));
        });

        socket.emit('ping', { token });
    });

    if (!socket.connected) {
        socket.connect();
    }

    return (
        <Stack alignItems="center">
            <Panel />

            <Outlet />
        </Stack>
    );
}