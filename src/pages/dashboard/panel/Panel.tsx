import { BottomNavigation, BottomNavigationAction, Stack } from '@mui/material';
import BusAlertIcon from '@mui/icons-material/BusAlert';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import RoundaboutLeftIcon from '@mui/icons-material/RoundaboutLeft';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { SyntheticEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { loadDataAsync, selectGameContext } from '../../../sharedSlices/GameContextSlice';
import { useNavigate } from 'react-router-dom';

enum NavTab {
    Map,
    BusShop,
    Hire,
    ListEmployees,
    ListBusses,
    ListRoutes,
    Stats
}

export function Panel() {
    const navigate = useNavigate();

    const [selectedLabel, setSelectedLabel] = useState(0);

    const dispatch = useAppDispatch();
    const gameContext = useAppSelector(selectGameContext);

    if (!gameContext.init) {
        dispatch(loadDataAsync());
    }

    const setBottomNavigationValue = (_: SyntheticEvent, newValue: NavTab) => {
        setSelectedLabel(newValue);

        switch (newValue) {
            case NavTab.Map: {
                navigate('maps');
                break;
            }
            case NavTab.BusShop: {
                navigate('bus-shop');
                break;
            }
            case NavTab.Hire: {
                navigate('hire-drivers');
                break;
            }
            case NavTab.ListBusses: {
                navigate('busses');
                break;
            }
            case NavTab.ListRoutes: {
                navigate('routes');
                break;
            }
            case NavTab.ListEmployees: {
                navigate('drivers');
                break;
            }
            case NavTab.Stats: {
                break;
            }
        }
    }

    return (
        <Stack sx={{ mb: 2 }}>
            <Stack direction="row" spacing={2}>
                <p>Количество водителей: {gameContext.countDrivers}</p>
                <p>Количество автобусов: {gameContext.countBusses}</p>
                <p>Количество маршрутов: {gameContext.countRoutes}</p>
                <p>Счет: {gameContext.money} руб.</p>
                <p>Время: {gameContext.gameTime}</p>
            </Stack>

            <BottomNavigation
                showLabels
                value={selectedLabel}
                onChange={setBottomNavigationValue}
            >
                <BottomNavigationAction label="Карта" icon={<MapOutlinedIcon />} value={NavTab.Map} />
                <BottomNavigationAction label="Магазин автобусов" icon={<BusAlertIcon />} value={NavTab.BusShop} />
                <BottomNavigationAction label="Биржа вакансий" icon={<PersonAddAltIcon />} value={NavTab.Hire} />
                <BottomNavigationAction label="Автопарк" icon={<DirectionsBusIcon />} value={NavTab.ListBusses} />
                <BottomNavigationAction label="Список сотрудников" icon={<PeopleIcon />} value={NavTab.ListEmployees} />
                <BottomNavigationAction label="Список маршрутов" icon={<RoundaboutLeftIcon />} value={NavTab.ListRoutes} />
                <BottomNavigationAction label="Статистика" icon={<AnalyticsIcon />} value={NavTab.Stats} />
            </BottomNavigation>
        </Stack>
    );
}