import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { loadRefInfoAsync, selectRefInfo } from '../../../sharedSlices/refInfoSlice';
import { Button, MenuItem, TextField } from '@mui/material';
import { useState } from 'react';
import { updateDriverAsync } from '../../../sharedSlices/DriverSlice';

export function DriverEdit() {
    const { id } = useParams() as { id: string };

    const dispatch = useAppDispatch();
    const refInfoContext = useAppSelector(selectRefInfo);

    if (!refInfoContext.init) {
        dispatch(loadRefInfoAsync());
    }

    const [selectedMapRoute, setMapRoute] = useState<string>();
    const [selectedBus, setBus] = useState<string>();

    const navigate = useNavigate();

    const handleChange = (setter: Function) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setter(event.target.value);
    }

    const updateDriver = () => {
        dispatch(updateDriverAsync({
            driverId: id,
            mapRouteId: selectedMapRoute as string,
            busId: selectedBus as string
        }));

        navigate('../drivers');
    };

    return (
        <div>
            <h4>Редактирование водителя</h4>

            <TextField fullWidth onChange={handleChange(setMapRoute)} select label="Выберите маршрут" variant="outlined">
                {refInfoContext.refInfo?.routes.map(route => (<MenuItem key={route.id} value={route.id}>{route.name}</MenuItem>))}
            </TextField>

            <br/>
            <br/>

            <TextField fullWidth onChange={handleChange(setBus)} select label="Выберите автобус" variant="outlined">
                {refInfoContext.refInfo?.busses.map(bus => (<MenuItem key={bus.id} value={bus.id}>{bus.name}</MenuItem>))}
            </TextField>

            <br/>
            <br/>

            <Button onClick={updateDriver} variant="outlined">Сохранить</Button>
        </div>
    );
}