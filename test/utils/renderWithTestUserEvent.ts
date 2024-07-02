import { ReactNode } from 'react';
import { render } from '@testing-library/react';
import userEvent, { type Options } from '@testing-library/user-event';

// Utility function to set up an instance of user events for React Testing Library
// See: https://testing-library.com/docs/user-event/intro/#writing-tests-with-userevent
export default function renderWithTestUserEvent(jsx: ReactNode, options: Options) {
  return {
    user: userEvent.setup(options),
    ...render(jsx),
  };
}
