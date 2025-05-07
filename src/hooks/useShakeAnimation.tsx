import { useAnimate } from 'motion/react';
import { useCallback } from 'react';

/**
 * Animates a shaking effect on an element
 * @example
 * const [shakeRef, playShakeAnimation] = useShakeAnimation();
 *
 * // Pass ref to an element to apply the shake animation
 * <div ref={shakeRef} />
 *
 * // Call playShakeAnimation() to trigger the shake animation
 * playShakeAnimation()
 */

export default function useShakeAnimation() {
  const [scope, animate] = useAnimate();
  const playAnimation = useCallback(() => {
    if (!scope.current) return;

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
  }, [scope, animate]);

  return [scope, playAnimation] as const;
}
