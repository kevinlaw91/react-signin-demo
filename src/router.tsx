import { createBrowserRouter } from 'react-router-dom';

// Show nothing during hydration
const hydrateFallbackComponent = () => null;

const router = createBrowserRouter(
  [
    {
      path: '/',
      lazy: () => import('@/routes/IndexPage'),
      HydrateFallback: hydrateFallbackComponent,
    },
    {
      path: '/signin',
      lazy: () => import('@/routes/SignInPage'),
      HydrateFallback: hydrateFallbackComponent,
    },
    {
      path: '/signup',
      lazy: () => import('@/routes/SignUpPage'),
      HydrateFallback: hydrateFallbackComponent,
    },
    {
      path: '/setup',
      lazy: () => import('@/routes/ProfileSetupPage'),
      HydrateFallback: hydrateFallbackComponent,
    },
    {
      // 404 page
      path: '*',
      lazy: () => import('@/routes/NotFoundPage'),
      HydrateFallback: hydrateFallbackComponent,
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
