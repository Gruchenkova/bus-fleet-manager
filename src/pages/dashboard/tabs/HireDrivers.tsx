import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { hireDriverAsync, loadDriverShopAsync, selectDriverOnShop } from '../../../sharedSlices/DriverOnShopSlice';
import { DateTime } from 'luxon';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { GridRenderCellParams } from '@mui/x-data-grid/models/params/gridCellParams';
import { DriverOnSaleWithHired, DriverRank } from 'shared';
import { Button } from '@mui/material';

export function HireDrivers() {
    const dispatch = useAppDispatch();
    const driverOnShop = useAppSelector(selectDriverOnShop);

    if (!driverOnShop.lastUpdate || driverOnShop.lastUpdate < DateTime.now().minus({ minutes: 15 }).toJSDate()) {
        dispatch(loadDriverShopAsync());
    }

    const hireDriver = (driverId: string, salary: number) => {
        dispatch(hireDriverAsync({
            driverId, salary
        }));
    }

    const columns: GridColDef[] = [
        { field: 'name', width: 150, headerName: 'Фамилия и имя', renderCell: (params: GridRenderCellParams) => {
                return (<p>{ params.row.surname } { params.row.firstname }</p>)
            } },
        { field: 'salary', width: 150, headerName: 'Зарплата' },
        { field: 'experience', width: 150, headerName: 'Стаж' },
        { field: 'driverRank', width: 150, headerName: 'Класс', valueGetter: (params: GridValueGetterParams) => {
                const driverRank: DriverRank = params.row.driverRank;

                switch (driverRank) {
                    case DriverRank.Third: {
                        return 'Третий';
                    }
                    case DriverRank.Second: {
                        return 'Второй';
                    }
                    case DriverRank.First: {
                        return 'Третий';
                    }
                    default: {
                        return 'Неизвестно';
                    }
                }
            } },
        { field: 'action', width: 150, headerName: 'Действие', renderCell: (params: GridRenderCellParams) => {
                const hired = params.row.hired;
                const salary = params.row.salary;

                if (hired) {
                    return (<Button sx={{ mt: 2, mb: 2 }} variant="outlined" disabled>Сотрудник нанят</Button>)
                }

                return (<Button sx={{ mt: 2, mb: 2 }} variant="outlined" onClick={() => {
                        hireDriver(params.row.driverId, salary);
                    }
                }
                >Нанять</Button>)
            }}
    ];

    return (
        <div style={{ height: 800, width: '80%' }}>
            <DataGrid
                rows={driverOnShop.drivers}
                columns={columns}
                getRowHeight={() => 'auto'}
                getRowId={(row: DriverOnSaleWithHired) => row.driverId}
            />
        </div>
    );
}