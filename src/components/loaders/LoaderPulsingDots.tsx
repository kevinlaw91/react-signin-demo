import style from './LoaderPulsingDots.module.css';

interface IDotsLoaderProps {
  className?: string;
}

export default function LoaderPulsingDots(props: IDotsLoaderProps) {
  const { className } = props;

  return (
    <div className={className || ''}>
      <div className={style.loader}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}

export { LoaderPulsingDots };
