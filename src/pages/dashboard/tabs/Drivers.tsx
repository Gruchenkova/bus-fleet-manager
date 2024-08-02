import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectGameContext } from '../../../sharedSlices/GameContextSlice';
import { useState } from 'react';
import {
    fireDriverAsync, loadDriversAsync, resetDriverListState, selectDrivers
} from '../../../sharedSlices/DriverSlice';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { GridRenderCellParams } from '@mui/x-data-grid/models/params/gridCellParams';
import { DriverRank } from 'shared';
import { DriverModel } from 'shared/models/response/DriverModel';
import { Button, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { useNavigate } from 'react-router-dom';

export function Drivers() {
    const dispatch = useAppDispatch();
    const drivers = useAppSelector(selectDrivers);
    const gameContext = useAppSelector(selectGameContext);
    const navigate = useNavigate();

    const [ currentPage, setPage ] = useState(0);

    if (!drivers.init) {
        const elementInPage = 10;

        dispatch(loadDriversAsync({
            offset: elementInPage * currentPage,
            limit: elementInPage
        }));
    }

    const setNextPage = (page: number) => {
        setPage(page);
        dispatch(resetDriverListState());
    }

    const fireDriver = (id: string) => {
        dispatch(fireDriverAsync(id));
    }

    const editDriver = (id: string) => {
        navigate(`../drivers-update/${id}`);
    }

    const columns: GridColDef[] = [
        { field: 'name', width: 150, headerName: 'Фамилия и имя' },
        { field: 'passport', width: 150, headerName: 'Номер паспорта' },
        { field: 'salary', width: 150, headerName: 'Зарплата' },
        { field: 'experience', width: 150, headerName: 'Стаж' },
        { field: 'driverRank', width: 150, headerName: 'Класс', valueGetter: (params: GridValueGetterParams) => {
                const driverRank: DriverRank = params.row.rank;

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
        { field: 'bus', width: 150, headerName: 'Автобус' },
        { field: 'route', width: 150, headerName: 'Маршрут' },
        { field: 'action', width: 400, headerName: 'Действие', renderCell: (params: GridRenderCellParams) => {
                const driver = params.row as DriverModel;

                return (
                    <Stack direction="row" spacing={2}>
                        <Button variant="outlined" color="warning" startIcon={<EditIcon />} onClick={() => editDriver(driver.id)}>
                            Редактировать
                        </Button>
                        <Button variant="contained" color="error" startIcon={<PersonOffIcon />} onClick={() => fireDriver(driver.id)}>
                            Уволить
                        </Button>
                    </Stack>
                );
            }}
    ];

    return (
        <div style={{ height: 800, width: '90%' }}>
            <DataGrid
                rows={drivers.drivers}
                columns={columns}
                page={currentPage}
                pageSize={10}
                rowCount={gameContext.countDrivers}
                rowsPerPageOptions={[10]}
                paginationMode="server"
                pagination
                onPageChange={setNextPage}
                getRowHeight={() => 'auto'}
                getRowId={(row: DriverModel) => row.id}
            />
        </div>
    );
}