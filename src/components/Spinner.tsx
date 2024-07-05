import style from './Spinner.module.css';

interface ISpinnerProps {
  className?: string;
}

export default function Spinner(props: ISpinnerProps) {
  const { className } = props;

  return (
    <div className={`${style.spinner} ${className}`}>
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
