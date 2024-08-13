import { ReactElement, useCallback, useContext } from 'react';
import { decodeJwt } from 'jose';
import { UserSessionContext, AuthenticatedUser } from '@/contexts/UserSessionContext';
import { useNavigate } from 'react-router-dom';

// Improvement: Implement custom button using GSI
// Google disallow using custom button to trigger GSI
// We can overlay the rendered button on top of your custom button
// Then set opacity to 0.0001

// Google sign in CredentialResponse
type CredentialResponse = {
  // Base64-encoded JSON Web Token (JWT)
  credential: string;
};

// Emulate sign in with Google callback.
function mockCredentialResponse(): Promise<CredentialResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Google will return CredentialResponse to the callback
      resolve({
        credential: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzMTQxNTkyNjUzNTg5NzkzMjM4IiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWV9.3YqxhAifZHg4kN11IX5mg9v9lVOLg9VkUThYURlZxEo',
      });
    }, 1000);
  });
}

export default function GoogleSignInButton(): ReactElement {
  const navigate = useNavigate();
  const { setActiveUser } = useContext(UserSessionContext);

  const callback = useCallback((response: CredentialResponse) => {
    // To implement callback
    // See: https://developers.google.com/identity/gsi/web/guides/overview
    //
    // After the user press the "Sign In with Google" button
    // Callback will be fired with the ID token
    // Decode the ID token (JWT) to get user profile and email info
    // Send the ID token to your backend server for verification with Google

    /*
    Decode the jwt
    Sample decoded jwt payload:
    {
      sub: '3141592653589793238', // The unique ID of the user's Google Account
      email: 'test@example.com', // The user's email address
      email_verified: true,
      ...
    }
    */
    const jwtPayload = decodeJwt(response.credential);
    const { email } = jwtPayload;

    const demoUserAccount = {
      id: '1234', // User id of our app
      email: 'test@example.com', // Registered email address of the user
    };

    const match = (email === demoUserAccount.email) ? demoUserAccount : null;

    if (match) {
      // Already registered
      // Change app's state to signed in
      setActiveUser({ id: match.id });
      // Redirect to home page
      navigate('/', { replace: true });
    } else {
      // Not a registered user
      // Ideally we go to profile setup page, but we don't have that yet,
      // so we just redirect to home

      // Pretend user completed profile setup
      const newAccount: AuthenticatedUser = {
        id: '1234',
      };

      // Change app's state to signed in
      setActiveUser({ id: newAccount.id });
      // Redirect to home page
      navigate('/', { replace: true });
    }
    return;
  }, [navigate, setActiveUser]);

  // Mock Google Sign In popup authorization
  const handleClick = useCallback(async () => {
    // Emulate user authorization steps
    const response = await mockCredentialResponse();
    // Send ID token to callback
    callback(response);
  }, [callback]);

  return (
    <button
      type="button"
      className="inline-flex items-center justify-center w-full h-12 gap-3 px-5 py-3 font-semibold text-neutral-600 border border-neutral-200 rounded-xl hover:bg-gray-200/50 outline-none focus:ring-2 ring-primary ring-offset-1 duration-150"
      aria-label="Continue with Google"
      onClick={handleClick}
    >
      <img src="/assets/svg/logo-google.svg" height="24" width="24" alt="Google logo" />
      <span>Continue with Google</span>
    </button>
  );
}
