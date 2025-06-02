import { FC } from 'react';
import Layout from './components/Layout';
import AppRoutes from './routes';

const App: FC = () => {
  return (
    <div>
        <Layout>
          <AppRoutes />
        </Layout>
    </div>
  )
}

export default App;