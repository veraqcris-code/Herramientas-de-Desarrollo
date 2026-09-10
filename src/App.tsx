import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import VistaClima from './components/VistaClima';

function App() {
  return (
    <>
      <Header />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<VistaClima />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;