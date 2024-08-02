import { Button, IconButton, List, ListItem, ListItemText, ListSubheader, MenuItem, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { loadMapPointsAsync, selectMapPoints } from '../../../sharedSlices/MapPointsSlice';
import { useState } from 'react';
import { MapPoint } from 'shared/models/MapPointModel';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router-dom';
import { selectMapRouteById, updateMapRouteAsync } from '../../../sharedSlices/MapRoutesSlice';

export function RouteUpdate() {
    const { id } = useParams() as { id: string };

    const dispatch = useAppDispatch();
    const mapPoints = useAppSelector(selectMapPoints);
    const mapRoute = useAppSelector(selectMapRouteById(id))
    const navigate = useNavigate();

    if (!mapPoints.init) {
        dispatch(loadMapPointsAsync());
    }

    const initMapPoints = () => {
        if (!mapRoute) {
            return [];
        }

        return mapRoute.points.map(currentPoint => mapPoints.points.find(point => point.id === currentPoint.pointId)) as MapPoint[];
    }

    const [currentMapPoint, setMapPoint] = useState<string | null>(null);
    const [currentName, setName] = useState<string | null>(mapRoute?.name ?? null);
    const [selectedMapPoints, setMapPointsArray] = useState<MapPoint[]>(initMapPoints());

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

    const updateRoute = () => {
        dispatch(updateMapRouteAsync({
            model: {
                name: currentName as string,
                routes: selectedMapPoints.map(point => point.id)
            },
            id
        }));

        navigate('../routes');
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

                <Button onClick={updateRoute} variant="outlined">Обновить</Button>
            </div>
        );
    }

    return (
        <div>
            <h4>Редактирование маршрута</h4>

            <TextField value={currentName} onChange={handleChange(setName)} label="Номер маршрута" variant="outlined" />

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