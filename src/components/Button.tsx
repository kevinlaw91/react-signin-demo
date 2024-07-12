import clsx from 'clsx';
import { LoaderPulsingDotsLinear } from '@/components/loaders/LoaderPulsingDots.tsx';

interface IButton {
  children?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export function Button({ children, className, ...otherProps }: IButton) {
  return (
    <button
      type="button"
      className={clsx('px-5 py-3 font-medium rounded-xl outline-none focus:ring-2 ring-offset-1 transition duration-150', className)}
      {...otherProps}
    >
      {children}
    </button>
  );
}

export function ButtonBusy({ className, ...otherProps }: IButton) {
  return (
    <Button
      className={clsx('bg-neutral-200 text-neutral-50', className)}
      disabled
      {...otherProps}
    >
      <LoaderPulsingDotsLinear className="w-[48px] h-full inline-block" />
    </Button>
  );
};

/**
 * Factory to create custom buttons
 * @param name Display name of the custom button
 * @param classNames Classes to inject to the custom button
 */
function createCustomButton(name: string, classNames: string) {
  const btn = function ({ children, className, ...otherProps }: IButton) {
    return (
      <Button
        className={clsx(classNames, className)}
        {...otherProps}
      >
        {children}
      </Button>
    );
  };

  btn.displayName = name;
  return btn;
}

export const ButtonPrimary = createCustomButton('ButtonPrimary', 'bg-primary hover:bg-primary-500 ring-primary text-white');
