import { FC} from 'react';
import Header from '../Header';
import Footer from '../Footer';


interface LayoutProps{
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({children}) =>  {
  return (
    <div className='bg-[#0F172A] min-h-screen'>
      <Header/>
      <main>
        {children}
      </main>
      <Footer/>
    </div>
  )
}

export default Layout;