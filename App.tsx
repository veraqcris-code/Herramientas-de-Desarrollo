import "./App.css";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Header from "./components/Header";
import CiudadList from "./components/CiudadList";
import CiudadForm from "./components/CiudadForm";
import Login from "./components/Login";
import RutaProtegida from "./components/RutaProtegida";

function Layout() {
  return (
    <>
      <Header />
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<RutaProtegida />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/ciudades" replace />} />
          <Route path="/ciudades" element={<CiudadList />} />
          <Route path="/nuevo" element={<CiudadForm />} />
          <Route path="/editar/:id" element={<CiudadForm />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;