import { createBrowserRouter } from 'react-router-dom';
import IndexPage from '@/routes/index.tsx';
import SignInPage from '@/routes/SignInPage.tsx';

export default createBrowserRouter(
  [
    {
      path: '/',
      element: <IndexPage />,
    },
    {
      path: '/signin',
      element: <SignInPage />,
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
    },
  },
);
