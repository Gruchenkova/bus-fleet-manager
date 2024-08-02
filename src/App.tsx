import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { Login } from './pages/auth/login/Login';
import { Main } from './pages/dashboard/main/Main';
import { BusShop } from './pages/dashboard/tabs/BusShop';
import { Maps } from './pages/dashboard/tabs/Maps';
import { HireDrivers } from './pages/dashboard/tabs/HireDrivers';
import { Busses } from './pages/dashboard/tabs/Busses';
import { ListRoutes } from './pages/dashboard/tabs/ListRoutes';
import { RouteCreate } from './pages/dashboard/routes/RouteCreate';
import { RouteUpdate } from './pages/dashboard/routes/RouteUpdate';
import { Drivers } from './pages/dashboard/tabs/Drivers';
import { DriverEdit } from './pages/dashboard/drivers/DriverEdit';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='login' element={<Login/>} />
          <Route path='dashboard' element={<Main/>}>
            <Route path='maps' element={<Maps />} />
            <Route path='bus-shop' element={<BusShop />} />
            <Route path='hire-drivers' element={<HireDrivers />} />
            <Route path='busses' element={<Busses />} />
            <Route path='drivers' element={<Drivers />} />
            <Route path='drivers-update/:id' element={<DriverEdit />} />
            <Route path='routes' element={<ListRoutes />} />
            <Route path='route-create' element={<RouteCreate />} />
            <Route path='route-update/:id' element={<RouteUpdate />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
