import { ReactNode, ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { LoaderPulsingDotsLinear } from '@/components/loaders/LoaderPulsingDots.tsx';
import { Icon } from '@iconify-icon/react';
import { Link, type LinkProps } from 'react-router-dom';

interface IButtonBaseProps {
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

interface IButton extends IButtonBaseProps, ComponentPropsWithoutRef<'button'> {}

interface ILinkButton extends IButtonBaseProps, LinkProps {}

type IButtonProps = IButton | ILinkButton;

export function Button(props: IButtonProps) {
  const {
    children,
    className,
    leftIcon,
    rightIcon,
    iconCentered = true,
    ...remainingProps
  } = props;

  const contents = (
    <span className={twMerge('flex w-full items-stretch justify-items-stretch gap-3 mx-4 my-3', iconCentered ? 'justify-center' : 'justify-between')}>
      {typeof leftIcon === 'string' && (
        <span className="flex h-full min-w-6 shrink-0 items-center aspect-square">
          <Icon icon={leftIcon} className="h-full text-current" height="unset" />
        </span>
      )}
      {children}
      {typeof rightIcon === 'string' && (
        <span className="flex h-full min-w-6 shrink-0 items-center aspect-square">
          <Icon icon={rightIcon} className="h-full text-current" height="unset" />
        </span>
      )}
    </span>
  );

  const mergedClassName = twMerge('flex items-stretch justify-center font-semibold rounded-xl text-neutral-800 focus:outline focus:outline-2 outline-current transition duration-150', className);

  if ('to' in remainingProps) {
    return (
      <Link className={mergedClassName}{...remainingProps as ILinkButton}>{contents}</Link>
    );
  } else {
    return (
      <button className={mergedClassName}{...remainingProps}>{contents}</button>
    );
  }
}

export function ButtonBusy({ className, ...otherProps }: IButtonProps) {
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
 * @param variantClasses Classes to inject to the custom button
 */
function createCustomButton(name: string, variantClasses: string) {
  const btn = function ({ children, className, ...otherProps }: IButtonProps) {
    return (
      <Button
        className={twMerge(variantClasses, className)}
        {...otherProps}
      >
        {children}
      </Button>
    );
  };

  btn.displayName = name;
  return btn;
}

export const ButtonPrimary = createCustomButton('ButtonPrimary', 'bg-primary hover:bg-primary-500 outline-offset-1 outline-primary text-white');
export const ButtonOutline = createCustomButton('ButtonOutline', 'border-2 border-current focus:outline-neutral-500 focus:outline-1 focus:border-neutral-500');
