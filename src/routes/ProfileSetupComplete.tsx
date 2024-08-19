import { ButtonPrimary } from '@/components/Button.tsx';
import { useLinkClickHandler } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { Player } from '@lottiefiles/react-lottie-player';
import sparkles from '@/lottie/celebration_sparkles.json';
import styles from './ProfileSetupComplete.module.css';

export default function ProfileSetupComplete() {
  const handleClick = useLinkClickHandler('/');

  return (
    <section>
      <div className="flex h-full min-h-svh flex-col items-center justify-center py-12 gap-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="grid items-center justify-items-center h-[160px] sm:h-[280px]">
            {/*
              Sparkles animation

              Do not use @lottiefiles/dotlottie-react
              Bug: When screen resizes from portrait to widescreen, canvas will not grow back in size
            */}
            <Player
              loop
              autoplay
              src={sparkles}
              className={twMerge(styles.sparks, 'row-start-1 col-start-1 h-full')}
            />
            <svg viewBox="0 0 257 257" className={twMerge(styles.tick_circle, 'pulse row-start-1 col-start-1')}>
              <defs>
                <linearGradient id="a" x1="13.93" y1="69.88" x2="242.07" y2="186.12" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#fb5914" />
                  <stop offset="1" stopColor="#c42b0a" />
                </linearGradient>
                <filter id="b" filterUnits="userSpaceOnUse">
                  <feOffset dy="6.25" />
                  <feGaussianBlur result="blur" stdDeviation="3.13" />
                  <feFlood floodColor="#000" floodOpacity=".15" />
                  <feComposite in2="blur" operator="in" />
                  <feComposite in="SourceGraphic" />
                </filter>
              </defs>
              <circle cx="128" cy="128" r="128" fill="url(#a)" />
              <path
                style={{
                  fill: 'none',
                  filter: 'url(#b)',
                  stroke: '#fff',
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                  strokeWidth: '25.64px',
                }}
                d="m68.97 127.49 43.69 43.7 74.37-74.38"
                className={styles.tick}
              />
            </svg>
          </div>
          {/* <img src="/assets/svg/success-circle-large.svg" className="size-3/5 mb-3.5 pulse" alt="" /> */}
          <h1 className="text-2xl font-bold text-center text-primary-500">Complete</h1>
          <p className="text-neutral-400 text-sm my-3">Your profile is now set up</p>
        </div>
        <div>
          <ButtonPrimary onClick={handleClick} to="/" reloadDocument>Go to Home</ButtonPrimary>
        </div>
      </div>
    </section>
  );
}
