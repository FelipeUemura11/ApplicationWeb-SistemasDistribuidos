import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import About from '../pages/About';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import Tarefa from '../components/TarefaPage/TarefaPage.tsx';
import MyAccount from '../pages/MyAccount/index.tsx';
import LoginPage from '../pages/LoginPage/index.tsx';

const AppRoutes: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/tarefa" element={<Tarefa/>} />
      <Route path="/about" element={<About/>} />
      <Route path="/my-account" element={<MyAccount/>} />
      <Route path="/login-register" element={<LoginPage/>} />
      <Route path="*" element={<NotFound/>} />
    </Routes>
  )
}

export default AppRoutes;