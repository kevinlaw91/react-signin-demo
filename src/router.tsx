import { createBrowserRouter } from 'react-router-dom';
import IndexPage from '@/routes/root.tsx';

export default createBrowserRouter([
  {
    path: '/',
    element: <IndexPage />,
  },
]);
