import { cleanup, render } from '@testing-library/react/pure';
import { HelmetProvider } from 'react-helmet-async';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import ProfileSetupUsername from '@/features/profile/setup/ProfileSetupUsername.tsx';
import userEvent from '@testing-library/user-event';
import * as Profile from '@/services/profile.ts';

const useSwiper = vi.hoisted(() => vi.fn());
const useSwiperSlide = vi.hoisted(() => vi.fn());

describe('ProfileSetupUsername', () => {
  beforeAll(() => {
    vi.mock(import('swiper/react'), async (importOriginal) => {
      const mod = await importOriginal();
      return {
        ...mod,
        useSwiper,
        useSwiperSlide,
      };
    });

    useSwiperSlide.mockReturnValue({
      isActive: true,
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('username registered', () => {
    let user;
    let container;

    beforeAll(async () => {
      user = userEvent.setup();

      useSwiper.mockReturnValue({
        on: vi.fn(),
        off: vi.fn(),
      });

      container = render(
        <HelmetProvider>
          <ProfileSetupUsername />
        </HelmetProvider>,
      );

      // Simulate form submission
      const textbox = container.getByRole('textbox');
      // Note: usernames with odd lengths are 'taken'
      await user.type(textbox, 'usernametaken');
      await user.click(container.getByRole('button', { name: /check/i }));
    });

    afterAll(cleanup);

    it('should show username taken', async () => {
      expect(await container.findByText(/already taken/i)).toBeInTheDocument();
    });

    it('should still show error even when retry', async () => {
      // Still show error even when retry
      await user.click(container.getByRole('button', { name: /check/i }));
      expect(await container.findByText(/already taken/i)).toBeInTheDocument();
    });
  });

  describe('username available', () => {
    let user;
    let container;
    let apiCall;

    // Wizard context
    let nextStepFn;

    beforeAll(async () => {
      user = userEvent.setup();

      nextStepFn = vi.fn();
      useSwiper.mockReturnValue({
        on: vi.fn(),
        off: vi.fn(),
        slideNext: nextStepFn,
      });

      container = render(
        <HelmetProvider>
          <ProfileSetupUsername />
        </HelmetProvider>,
      );

      apiCall = vi.spyOn(Profile, 'saveUsername');

      // Simulate form submission
      const textbox = container.getByRole('textbox');
      // Note: usernames with even lengths are 'taken'
      await user.type(textbox, 'username');
      await user.click(container.getByRole('button', { name: /check/i }));
    });

    afterAll(() => {
      apiCall.mockRestore();
    });

    it('should show username available', async () => {
      expect(await container.findByText(/is available/i)).toBeInTheDocument();
    });

    it('should show confirm button', async () => {
      expect(await container.findByRole('button', { name: /confirm/i })).toBeInTheDocument();
    });

    it('should submit form when pressed', async () => {
      await user.click(await container.findByRole('button', { name: /confirm/i }));
      expect(apiCall).toHaveBeenCalled();
      await vi.waitUntil(
        () => apiCall.mock.results[0],
        { timeout: 2000 },
      );

      await expect(apiCall.mock.results[0].value).resolves.toBeDefined();
    });

    it('should return success', async () => {
      await vi.waitUntil(
        () => apiCall.mock.results[0],
        { timeout: 2000 },
      );
      await expect(apiCall.mock.results[0].value).resolves.toBeDefined();
    });

    it('should trigger a signal to proceed to the next step', () => {
      expect(nextStepFn).toBeCalled();
    });
  });
});
