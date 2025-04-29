import { ComponentPropsWithRef, ReactNode, Ref } from 'react';
import { twMerge } from 'tailwind-merge';
import { LoaderPulsingDotsLinear } from '@/components/loaders/LoaderPulsingDots.tsx';
import { Icon } from '@iconify-icon/react';
import { Link } from 'react-router';

interface IconButtonProps {
  // Icon rendered on the left side
  leftIcon?: string | ReactNode;
  // Icon rendered on the right side
  rightIcon?: string | ReactNode;
  /**
   * Icon rendered in center along with text or on button edges
   * @default true
   */
  iconCentered?: boolean;
}

interface ButtonProps extends IconButtonProps, ComponentPropsWithRef<'button'> {}

interface LinkButtonProps extends IconButtonProps, ComponentPropsWithRef<typeof Link> {}

export const Button = (props: ButtonProps | LinkButtonProps) => {
  const {
    ref,
    children,
    className,
    leftIcon,
    rightIcon,
    iconCentered = true,
    ...remainingProps
  } = props;

  const iconLeft = (typeof leftIcon === 'string')
    ? <Icon icon={leftIcon} className="h-full text-current" height="unset" />
    : (leftIcon ?? undefined)
  ;

  const iconRight = (typeof rightIcon === 'string')
    ? <Icon icon={rightIcon} className="h-full text-current" height="unset" />
    : (rightIcon ?? undefined)
  ;

  const contents = (
    <span className={twMerge('flex w-full items-stretch justify-items-stretch gap-3 mx-4 my-3', iconCentered ? 'justify-center' : 'justify-between')}>
      {iconLeft && (
        <span className="flex h-full min-w-6 shrink-0 items-center aspect-square">
          {iconLeft}
        </span>
      )}
      {children}
      {iconRight && (
        <span className="flex h-full min-w-6 shrink-0 items-center aspect-square">
          {iconLeft}
        </span>
      )}
    </span>
  );

  const mergedClassName = twMerge('flex items-stretch justify-center font-semibold rounded-xl text-neutral-800 focus:outline focus:outline-2 outline-current transition duration-150', className);

  if ('to' in remainingProps) {
    return (
      <Link
        ref={props.ref as Ref<HTMLAnchorElement>}
        className={mergedClassName}
        {...remainingProps}
      >
        {contents}
      </Link>
    );
  } else {
    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        className={mergedClassName}
        {...remainingProps}
      >
        {contents}
      </button>
    );
  }
};

Button.displayName = 'Button';

export function ButtonBusy({ className, ...otherProps }: ButtonProps | LinkButtonProps) {
  const btnClasses = twMerge('bg-neutral-200 text-neutral-50', className);
  const loadingAnimation = <LoaderPulsingDotsLinear className="w-[48px] h-full inline-block" />;

  if ('to' in otherProps) {
    return <Button className={btnClasses} {...otherProps}>{loadingAnimation}</Button>;
  } else {
    return <Button className={btnClasses} {...otherProps} disabled>{loadingAnimation}</Button>;
  }
}

/**
 * Factory to create custom buttons
 * @param name Display name of the custom button
 * @param variantClasses Classes to inject to the custom button
 */
function createCustomButton(name: string, variantClasses: string) {
  const btn = (props: ButtonProps | LinkButtonProps) => {
    const { ref, children, className, ...otherProps } = props;

    if ('to' in otherProps) {
      return (
        <Button
          ref={ref as Ref<HTMLAnchorElement>}
          className={twMerge(variantClasses, className)}
          {...otherProps}
        >
          {children}
        </Button>
      );
    } else {
      return (
        <Button
          ref={ref as Ref<HTMLButtonElement>}
          className={twMerge(variantClasses, className)}
          {...otherProps}
        >
          {children}
        </Button>
      );
    }
  };

  btn.displayName = name;
  return btn;
}

export const ButtonPrimary = createCustomButton('ButtonPrimary', 'bg-primary hover:bg-primary-500 outline-offset-1 outline-primary text-white');
export const ButtonOutline = createCustomButton('ButtonOutline', 'border-2 border-current focus:outline-neutral-500 focus:outline focus:border-neutral-500');
