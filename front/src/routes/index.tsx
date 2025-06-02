import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import About from '../pages/About';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import Tarefa from '../components/TarefaPage/TarefaPage.tsx';
import MyAccount from '../pages/MyAccount/index.tsx';
import LoginPage from '../pages/LoginPage/index.tsx';
import PrivateRoute from '../components/PrivateRoute';

const AppRoutes: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login-register" element={<LoginPage />} />
      <Route path="/home" element={
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      } />
      <Route path="/tarefa" element={
        <PrivateRoute>
          <Tarefa selectedDate={new Date()} onClose={() => { console.log('Fechando Tarefa via PrivateRoute wrapper'); }} />
        </PrivateRoute>
      } />
      <Route path="/about" element={
        <PrivateRoute>
          <About />
        </PrivateRoute>
      } />
      <Route path="/my-account" element={
        <PrivateRoute>
          <MyAccount />
        </PrivateRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;