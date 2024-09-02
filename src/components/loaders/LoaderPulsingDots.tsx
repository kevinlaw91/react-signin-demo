import { twMerge } from 'tailwind-merge';
import style from '@/components/loaders/LoaderPulsingDots.module.css';

interface ILoaderPulsingDotsLinearProps {
  className?: string;
}

export function LoaderPulsingDotsLinear(props: ILoaderPulsingDotsLinearProps) {
  return (
    <div {...props}>
      <div className={style.linear}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}

interface ILoaderPulsingDotsCircularProps {
  className?: string;
}

export function LoaderPulsingDotsCircular(props: ILoaderPulsingDotsCircularProps) {
  const { className } = props;

  return (
    <div className={twMerge(style.circular, className)}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
