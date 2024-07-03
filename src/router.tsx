import { createBrowserRouter } from 'react-router-dom';
import IndexPage from '@/routes/index.tsx';
import SignInPage from '@/routes/SignInPage.tsx';
import SignUpPage from '@/routes/SignUpPage.tsx';
import NotFoundPage from '@/routes/NotFoundPage.tsx';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <IndexPage />,
    },
    {
      path: '/signin',
      element: <SignInPage />,
    },
    {
      path: '/signup',
      element: <SignUpPage />,
    },
    {
      // 404 page
      path: '*',
      element: <NotFoundPage />,
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

export default router;
