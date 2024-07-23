import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { LoaderPulsingDotsLinear } from '@/components/loaders/LoaderPulsingDots.tsx';
import { Icon } from '@iconify-icon/react';

interface IButton {
  /**
   * Icon rendered on the left side
   */
  leftIcon?: string | ReactNode;
  /**
   * Icon rendered on the right side
   */
  rightIcon?: string | ReactNode;
  /**
   * Icon rendered in center along with text or on button edges
   * @default true
   */
  iconCentered?: boolean;
  children?: ReactNode;
  className?: string;
  [key: string]: unknown;
}

export function Button({ children, leftIcon, rightIcon, iconCentered = true, className, ...otherProps }: IButton) {
  if (typeof leftIcon === 'string') {
    leftIcon = <Icon icon={leftIcon} className="h-full text-white" height="unset" />;
  }

  if (typeof rightIcon === 'string') {
    rightIcon = <Icon icon={rightIcon} className="h-full text-white" height="unset" />;
  }

  return (
    <button
      type="button"
      className={twMerge('flex items-stretch justify-center font-semibold rounded-xl text-neutral-800 focus:outline focus:outline-2 outline-primary-600 transition duration-150', className)}
      {...otherProps}
    >
      <span className={twMerge('flex w-full items-stretch justify-items-stretch gap-3 mx-4 my-3', iconCentered ? 'justify-center' : 'justify-between')}>
        {
          leftIcon && (<span className="flex h-full min-w-6 shrink-0 items-center aspect-square">{leftIcon}</span>)
        }
        {children}
        {
          rightIcon && (<span className="flex h-full min-w-6 shrink-0 items-center aspect-square">{rightIcon}</span>)
        }
      </span>
    </button>
  );
}

export function ButtonBusy({ className, ...otherProps }: IButton) {
  return (
    <Button
      className={twMerge('bg-neutral-200 text-neutral-50', className)}
      disabled
      {...otherProps}
    >
      <LoaderPulsingDotsLinear className="w-[48px] h-full inline-block" />
    </Button>
  );
}

/**
 * Factory to create custom buttons
 * @param name Display name of the custom button
 * @param classNames Classes to inject to the custom button
 */
function createCustomButton(name: string, classNames: string) {
  const btn = function ({ children, className, ...otherProps }: IButton) {
    return (
      <Button
        className={twMerge(classNames, className)}
        {...otherProps}
      >
        {children}
      </Button>
    );
  };

  btn.displayName = name;
  return btn;
}

export const ButtonPrimary = createCustomButton('ButtonPrimary', 'bg-primary hover:bg-primary-500 outline-white text-white');
