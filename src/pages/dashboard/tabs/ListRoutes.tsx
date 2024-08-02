import { Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
    deleteMapRouteAsync, loadMapRoutesAsync, resetMapRouteList, selectMapRoutes
} from '../../../sharedSlices/MapRoutesSlice';
import { useState } from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { MapRouteModel } from 'shared/models/MapRouteModel';
import { selectGameContext } from '../../../sharedSlices/GameContextSlice';
import { GridRenderCellParams } from '@mui/x-data-grid/models/params/gridCellParams';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export function ListRoutes() {
    const dispatch = useAppDispatch();
    const mapRoutes = useAppSelector(selectMapRoutes);
    const gameContext = useAppSelector(selectGameContext);

    const [ currentPage, setPage ] = useState(0);

    const navigate = useNavigate();

    if (!mapRoutes.init) {
        const elementInPage = 10;

        dispatch(loadMapRoutesAsync({
            offset: elementInPage * currentPage,
            limit: elementInPage
        }));
    }

    const setNextPage = (page: number) => {
        setPage(page);
        dispatch(resetMapRouteList({}));
    }

    const deleteMapRoute = (id: string) => {
        dispatch(deleteMapRouteAsync(id));
    }

    const navigateToUpdateRoute = (id: string) => {
        navigate(`../route-update/${id}`);
    };

    const columns: GridColDef[] = [
        { field: 'name', width: 200, headerName: 'Название' },
        { field: 'points', width: 800, headerName: 'Маршрут', valueGetter: (params: GridValueGetterParams) => {
                const point = params.row.points as { address: string }[];

                return point.map(point => point.address).join(" - ");
            }
        },
        { field: 'action', width: 400, headerName: 'Действие', renderCell: (params: GridRenderCellParams) => {
                const mapRoute = params.row as MapRouteModel;

                return (
                    <Stack direction="row" spacing={2}>
                        <Button variant="outlined" color="warning" startIcon={<EditIcon />} onClick={() => navigateToUpdateRoute(mapRoute.id)}>
                            Редактировать
                        </Button>
                        <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => deleteMapRoute(mapRoute.id)}>
                            Удалить
                        </Button>
                    </Stack>
                );
            }
        }
    ];

    const navigateToCreateRoute = () => {
        navigate('../route-create');
    };

    return (
        <div style={{ height: 800, width: '90%' }}>
            <Button onClick={navigateToCreateRoute} variant="outlined">Создать маршрут</Button>

            <br/>
            <br/>

            <DataGrid
                rows={mapRoutes.routes}
                columns={columns}
                page={currentPage}
                pageSize={10}
                rowCount={gameContext.countRoutes}
                rowsPerPageOptions={[10]}
                paginationMode="server"
                pagination
                onPageChange={setNextPage}
                getRowId={(row: MapRouteModel) => row.id}
            />
        </div>
    );
}