import style from './DotsLoader.module.css';

interface IDotsLoaderProps {
  className?: string;
}

export default function DotsLoader(props: IDotsLoaderProps) {
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
