import { cleanup, screen } from '@testing-library/react';
import {HelmetProvider} from "react-helmet-async";
import renderWithTestUserEvent from 'test/utils/renderWithTestUserEvent.ts';
import { describe, it, expect, vi, afterEach } from 'vitest';
import ProfileSetupUsername from '@/routes/ProfileSetupUsername.tsx';

describe('ProfileSetupUsername', () => {
  describe('check availability', () => {

    afterEach(() => {
      cleanup();
    });

    describe('using available username', async () => {
      const { user } = renderWithTestUserEvent(
        <HelmetProvider>
          <ProfileSetupUsername />
        </HelmetProvider>
      );

      const textbox = screen.getByRole('textbox');
      expect(textbox).toBeInTheDocument();
      // Simulate form submission
      await user.type(textbox, 'available_username');
      await user.click(screen.getByRole('button', { name: /check/i }));

      it('should show available', async () => {
        expect(await screen.findByText(/is available/i)).toBeInTheDocument();
      })
    });

    describe('using taken username', async () => {
      const { user } = renderWithTestUserEvent(
        <HelmetProvider>
          <ProfileSetupUsername />
        </HelmetProvider>
      );

      const textbox = screen.getByRole('textbox');
      expect(textbox).toBeInTheDocument();
      // Simulate form submission
      await user.type(textbox, 'taken');
      await user.click(screen.getByRole('button', { name: /check/i }));

      it('should show taken', async () => {
        expect(await screen.findByText(/taken/i)).toBeInTheDocument();
      })
    })
  });
});
