import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Utility function to setup an instance of user events for React Testing Library
// See: https://testing-library.com/docs/user-event/intro/#writing-tests-with-userevent
export default function renderWithTestUserEvent(jsx, options) {
  return {
    user: userEvent.setup(options),
    ...render(jsx),
  };
}
