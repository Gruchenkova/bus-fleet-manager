import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { buyBusAsync, loadBusShopAsync, selectBusOnShop } from '../../../sharedSlices/BusOnShopSlice';
import { DateTime } from 'luxon';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { BusOnSaleWithBought } from 'shared/models/BusOnSaleModel';
import { GridRenderCellParams } from '@mui/x-data-grid/models/params/gridCellParams';
import { BusType } from 'shared';
import { Button } from '@mui/material';

export function BusShop() {
    const dispatch = useAppDispatch();
    const busOnShop = useAppSelector(selectBusOnShop);

    if (!busOnShop.lastUpdate || busOnShop.lastUpdate < DateTime.now().minus({ minutes: 15 }).toJSDate()) {
        dispatch(loadBusShopAsync());
    }

    const buyBus = (busId: string, cost: number) => {
        dispatch(buyBusAsync({
            busId, cost
        }));
    }

    const columns: GridColDef[] = [
        { field: 'pictureUrl', headerName: 'Изображение', width: 250, renderCell: (params: GridRenderCellParams) => {
                return (<img width={200} height={150} src={"http://localhost:3080/static/" + params.row.pictureUrl} />);
            } },
        { field: 'name', width: 150, headerName: 'Название' },
        { field: 'capacity', width: 150, headerName: 'Вместимость' },
        { field: 'type', width: 150, headerName: 'Тип', valueGetter: (params: GridValueGetterParams) => {
                const type: BusType = params.row.type;

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
        { field: 'percentWear', width: 150, headerName: '% износа', valueGetter: (params: GridValueGetterParams) =>
                `${Math.round((1 - params.row.currentWear / params.row.maxWear) * 10000) / 100}` },
        { field: 'cost', width: 150, headerName: 'Цена' },
        { field: 'action', width: 150, headerName: 'Действие', renderCell: (params: GridRenderCellParams) => {
                    const bought = params.row.bought;
                    const cost = params.row.cost;

                    if (bought) {
                        return (<Button variant="outlined" disabled>Транспорт куплен</Button>)
                    }

                    return (<Button variant="outlined" onClick={() => {
                        buyBus(params.row.busOnSaleId, cost);
                    }
                }
                >Купить</Button>)
            }}
    ];

    return (
        <div style={{ height: 800, width: '80%' }}>
            <DataGrid
                rows={busOnShop.busses}
                columns={columns}
                getRowHeight={() => 'auto'}
                getRowId={(row: BusOnSaleWithBought) => row.busOnSaleId}
            />
        </div>
    );
}