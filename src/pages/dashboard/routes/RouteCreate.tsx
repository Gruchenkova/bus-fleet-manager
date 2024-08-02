import { Button, IconButton, List, ListItem, ListItemText, ListSubheader, MenuItem, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { loadMapPointsAsync, selectMapPoints } from '../../../sharedSlices/MapPointsSlice';
import { useState } from 'react';
import { MapPoint } from 'shared/models/MapPointModel';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { createMapRouteAsync } from '../../../sharedSlices/MapRoutesSlice';

export function RouteCreate() {
    const dispatch = useAppDispatch();
    const mapPoints = useAppSelector(selectMapPoints);
    const navigate = useNavigate();

    const [currentMapPoint, setMapPoint] = useState<string | null>(null);
    const [currentName, setName] = useState<string | null>(null);
    const [selectedMapPoints, setMapPointsArray] = useState<MapPoint[]>([]);

    const handleChange = (setter: Function) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setter(event.target.value);
    }

    const addMapPoint = () => {
        const foundMapPoint = mapPoints.points.find(point => point.id === currentMapPoint);

        if (!foundMapPoint) {
            return;
        }

        setMapPointsArray(selectedMapPoints.concat([foundMapPoint]));
    };

    const createRoute = () => {
        dispatch(createMapRouteAsync({
            name: currentName as string,
            routes: selectedMapPoints.map(point => point.id)
        }));

        navigate('../routes');
    }

    if (!mapPoints.init) {
        dispatch(loadMapPointsAsync());
    }

    let mapRouteList = null;

    const deleteSelectedPoint = (pointId: string) => () => {
        setMapPointsArray(selectedMapPoints.filter(point => point.id !== pointId));
    };

    if (selectedMapPoints.length) {
        mapRouteList = (
            <div>
                <List
                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                            Маршрут
                        </ListSubheader>
                    }
                >
                    {selectedMapPoints.map(point => (<ListItem secondaryAction={
                        <IconButton onClick={deleteSelectedPoint(point.id)} edge="end" aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    }>
                        <ListItemText primary={point.name} />
                    </ListItem>))}
                </List>

                <Button onClick={createRoute} variant="outlined">Создать</Button>
            </div>
        );
    }

    return (
        <div>
            <h4>Создание маршрута</h4>

            <TextField onChange={handleChange(setName)} label="Номер маршрута" variant="outlined" />

            <br/><br/>

            <TextField onChange={handleChange(setMapPoint)} fullWidth select label="Выберите пункт" variant="outlined">
                {mapPoints.points.map(point => (<MenuItem key={point.id} value={point.id}>{point.name}</MenuItem>))}
            </TextField>

            <br/><br/>

            <Button onClick={addMapPoint} disabled={currentMapPoint == null} variant="outlined">Добавить пункт</Button>

            {mapRouteList}
        </div>
    );
}