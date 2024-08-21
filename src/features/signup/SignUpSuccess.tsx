import { Player } from '@lottiefiles/react-lottie-player';
import animation from '@/features/signup/verify_email_sent.lottie.json';
import { ButtonPrimary } from '@/components/Button.tsx';

export default function SignUpSuccess() {
  return (
    <div className="flex h-full min-h-svh flex-col items-center justify-center py-12 gap-12">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="grid items-center justify-items-center h-[160px]">
          <Player
            loop={false}
            keepLastFrame
            autoplay
            src={animation}
            className="h-32"
          />
        </div>
        <h1 className="text-2xl font-bold text-center text-primary-500">Verify Email</h1>
        <p className="text-neutral-400 text-sm my-3">Please check your email to verify your account</p>
        <p className="text-neutral-400 text-sm my-3">
          It can take a few minutes to arrive in your inbox.
          <br />
          Remember to check your spam or junk folder too.
        </p>
      </div>
      <div>
        <ButtonPrimary to="/setup" reloadDocument>Go to Home</ButtonPrimary>
      </div>
    </div>
  );
}
