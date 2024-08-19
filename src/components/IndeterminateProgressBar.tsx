import { twMerge } from 'tailwind-merge';
import twConfig from '@/utils/twConfig.ts';
import styles from '@/components/IndeterminateProgressBar.module.css';

export function IndeterminateProgressBar({
  className,
  progressValueColor = twConfig.theme.colors.primary.DEFAULT,
  progressBarColor = '#eee',
}: {
  className?: string;
  // Progress bar fill color, defaults to theme primary color
  progressValueColor?: string;
  // Progress bar background color, defaults to #eee
  progressBarColor?: string;
}) {
  return (
    <div
      role="progressbar"
      className={twMerge(styles.progressbar, className)}
      style={{
        '--progress-value-fill': progressValueColor,
        '--progress-bar-fill': progressBarColor,
      }}
    />
  );
}
