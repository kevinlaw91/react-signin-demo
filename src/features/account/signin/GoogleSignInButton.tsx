import { ReactElement, useCallback, useContext } from 'react';
import { decodeJwt } from 'jose';
import { SessionContext } from '@/contexts/SessionContext';
import { useNavigate } from 'react-router';
import srcGoogleLogoSvg from '/assets/svg/logo-google.svg';

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
        credential: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzMTQxNTkyNjUzNTg5NzkzMjM4IiwiZW1haWwiOiJHb29nbGVVc2VyQGV4YW1wbGUuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWV9.CW0m8eA-2O024AefPgBrrc42Z4fk4-d-W3tbUTznPEA',
      });
    }, 1000);
  });
}

export function GoogleSignInButton(): ReactElement {
  const navigate = useNavigate();
  const { updateSessionUser } = useContext(SessionContext);

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
      email: 'GoogleUser@example.com', // The user's email address
      email_verified: true,
      ...
    }
    */
    const jwtPayload = decodeJwt<{ email: string }>(response.credential);
    const { email } = jwtPayload;

    const demoUserAccount = {
      id: 'google', // User id within our app
      email: 'GoogleUser@example.com', // Registered email address of the user
    };

    const match = (email === demoUserAccount.email) ? demoUserAccount : null;

    if (match) {
      // Already registered
      localStorage.setItem('SESSION_USER_ID', demoUserAccount.id);

      // Save username to local storage
      const calculatedUsername = demoUserAccount.email.split('@')[0];
      localStorage.setItem('demo:username', calculatedUsername);

      // Change app's state to signed in
      updateSessionUser({
        id: match.id,
        username: calculatedUsername,
      });
      // Redirect to home page
      void navigate('/', { replace: true });
    } else {
      // Not a registered user or profile not complete
      // Redirect to setup
      void navigate('/setup', { replace: true });
    }
    return;
  }, [navigate, updateSessionUser]);

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
      className="inline-flex items-center justify-center w-full h-12 gap-3 px-5 py-3 font-semibold text-neutral-600 border border-neutral-200 rounded-xl bg-gray-200/50 hover:bg-gray-400/20 outline-hidden focus:ring-2 ring-primary ring-offset-1 duration-150"
      aria-label="Continue with Google"
      onClick={handleClick}
    >
      <img src={srcGoogleLogoSvg} height="24" width="24" alt="Google logo" />
      <span>Continue with Google</span>
    </button>
  );
}
