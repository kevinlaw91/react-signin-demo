import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter(
  [
    {
      path: '/',
      lazy: () => import('@/routes/IndexPage'),
    },
    {
      path: '/signin',
      lazy: () => import('@/routes/SignInPage'),
    },
    {
      path: '/signup',
      lazy: () => import('@/routes/SignUpPage'),
    },
    {
      path: '/setup',
      lazy: () => import('@/routes/ProfileSetupPage'),
    },
    {
      // 404 page
      path: '*',
      lazy: () => import('@/routes/NotFoundPage'),
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
