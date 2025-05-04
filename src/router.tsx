import { createBrowserRouter } from 'react-router';

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
    // Pass vite base public path to react router
    basename: import.meta.env.BASE_URL,
  },
);

export default router;
