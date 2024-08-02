import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { GridRenderCellParams } from '@mui/x-data-grid/models/params/gridCellParams';
import { BusType } from 'shared';
import {
    loadBussesAsync, repairBusAsync, resetBusListState, selectBusses, sellBusAsync
} from '../../../sharedSlices/BussesSlice';
import { BusModel } from 'shared/models/response/BusModel';
import { Button, Stack } from '@mui/material';
import SellIcon from '@mui/icons-material/Sell';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useState } from 'react';
import { selectGameContext } from '../../../sharedSlices/GameContextSlice';

export function Busses() {
    const dispatch = useAppDispatch();
    const busses = useAppSelector(selectBusses);
    const gameContext = useAppSelector(selectGameContext);

    const [ currentPage, setPage ] = useState(0);

    if (!busses.loaded) {
        const elementInPage = 10;

        dispatch(loadBussesAsync({
            offset: elementInPage * currentPage,
            limit: elementInPage
        }));
    }

    const setNextPage = (page: number) => {
        setPage(page);
        dispatch(resetBusListState({}));
    }

    const clamp = (value: number, max: number, min: number) => {
        if (value > max) {
            return max;
        }
        if (value < min) {
            return min;
        }
        return value;
    };

    const calculateSaleCost = (bus: BusModel) => {
        const wearRate = bus.currentWear / bus.maxWear;

        return Math.round(bus.maxCost * clamp(wearRate - 0.2, 1, 0) * 100) / 100;
    };

    const sellBus = (bus: BusModel) => {
        dispatch(sellBusAsync({
            busId: bus.id,
            price: calculateSaleCost(bus)
        }));
    };

    const repairBus = (bus: BusModel) => {
        dispatch(repairBusAsync(bus.id));
    };

    const columns: GridColDef[] = [
        { field: 'pictureUrl', headerName: 'Изображение', width: 250, renderCell: (params: GridRenderCellParams) => {
                return (<img width={200} height={150} src={"http://localhost:3080/static/" + params.row.pictureUrl} />);
            } },
        { field: 'busName', width: 200, headerName: 'Название' },
        { field: 'capacity', width: 125, headerName: 'Вместимость' },
        { field: 'type', width: 100, headerName: 'Тип', valueGetter: (params: GridValueGetterParams) => {
                const type: BusType = params.row.busType;

                switch (type) {
                    case BusType.Bus: {
                        return 'Автобус';
                    }
                    case BusType.ElectricBus: {
                        return 'Электробус';
                    }
                    case BusType.Trolleybus: {
                        return 'Троллейбус';
                    }
                    default: {
                        return 'Неизвестно';
                    }
                }
            } },
        { field: 'percentWear', width: 100, headerName: '% износа', valueGetter: (params: GridValueGetterParams) =>
                `${Math.round((1 - params.row.currentWear / params.row.maxWear) * 10000) / 100}` },
        { field: 'cost', width: 150, headerName: 'Цена продажи', valueGetter: (params: GridValueGetterParams) => `${calculateSaleCost(params.row as BusModel)}` },
        { field: 'repairCost', width: 175, headerName: 'Цена полного ремонта' },
        { field: 'repairTerm', width: 175, headerName: 'Срок ремонта в днях' },
        { field: 'status', width: 75, headerName: 'Статус', renderCell: (params: GridRenderCellParams) => {
            const bus = params.row as BusModel;

            if (bus.isRepairing) {
                return (<BuildIcon color="warning" />);
            }

            const wearInPercent = (1 - params.row.currentWear / params.row.maxWear);

            if (wearInPercent >= 0.8) {
                return (<ErrorOutlineIcon color="error" />);
            }

            return (<CheckCircleOutlineIcon color="success" />);
        } },
        { field: 'action', width: 250, headerName: 'Действие', renderCell: (params: GridRenderCellParams) => {
            const bus = params.row as BusModel;
            const wearInPercent = (1 - bus.currentWear / bus.maxWear);

            return (
                    <Stack direction="row" spacing={2}>
                        <Button variant="outlined" color="warning" onClick={() => { sellBus(bus) }} disabled={wearInPercent >= 0.8} startIcon={<SellIcon />}>
                            Продать
                        </Button>
                        <Button variant="contained" onClick={() => { repairBus(bus) }} endIcon={<BuildIcon />} disabled={bus.repairTerm == 0 || bus.isRepairing}>
                            Ремонтировать
                        </Button>
                    </Stack>
            );
        }}
    ];

    return (
        <div style={{ height: 800, width: '90%' }}>
            <DataGrid
                rows={busses.busses}
                columns={columns}
                page={currentPage}
                pageSize={10}
                rowCount={gameContext.countBusses}
                rowsPerPageOptions={[10]}
                paginationMode="server"
                pagination
                onPageChange={setNextPage}
                getRowHeight={() => 'auto'}
                getRowId={(row: BusModel) => row.id}
            />
        </div>
    );
}