import { FieldErrors } from 'react-hook-form';
import { useAnimate } from 'framer-motion';
import { useEffect } from 'react';

/**
 * Animates a shaking effect on an element when there are validation errors.
 * @example
 * // Get errors from react-hook-form's useForm()
 * const { formState: { errors } } = useForm();
 * const elRef = useShakeOnValidationError(errors);
 *
 * // Pass ref to an element to apply the shake animation
 * <div ref={elRef} />
 */
export default function useShakeOnValidationError(errors: FieldErrors) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      void animate(
        scope.current,
        {
          x: [0, -8, 8, -8, 8, 0],
        },
        {
          ease: 'easeInOut',
          duration: 0.4,
        },
      )
        .then(() => void animate(scope.current, { x: 0 }));
    }
  }, [errors, animate, scope]);

  return scope;
}
