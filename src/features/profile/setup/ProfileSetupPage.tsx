import { useContext, useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperClass from 'swiper';
import { Manipulation } from 'swiper/modules';
import 'swiper/css';
import ProfileSetupUsername from '@/features/profile/setup/ProfileSetupUsername.tsx';
import ProfileSetupProfilePicture from '@/features/profile/setup/ProfileSetupProfilePicture.tsx';
import ProfileSetupComplete from '@/features/profile/setup/ProfileSetupComplete.tsx';
import { IndeterminateProgressBar } from '@/components/IndeterminateProgressBar.tsx';
import { SessionContext } from '@/contexts/SessionContext.tsx';

export default function ProfileSetupPage() {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [hideLoader, setHideLoader] = useState(false);
  const { updateSessionUser } = useContext(SessionContext);

  useEffect(() => {
    let usernameStepCompleted = false;
    updateSessionUser({ id: '1234' });

    if (sessionStorage.getItem('user:1234:username')) {
      usernameStepCompleted = true;
    }

    // Username already set, skip this step
    if (usernameStepCompleted) {
      const stepUsernameIndex = swiperRef.current?.slides.findIndex((el, index) => {
        if (el.getAttribute('data-slide-key') === 'username') return index;
      });

      if (typeof stepUsernameIndex !== 'undefined') {
        swiperRef.current?.removeSlide(stepUsernameIndex);
        swiperRef.current?.update();
      }
    }

    const timer = setTimeout(() => {
      setHideLoader(true);
      swiperRef.current?.slideNext();
    }, 2400);

    return () => {
      clearTimeout(timer);
    };
  }, [updateSessionUser]);

  return (
    <section className="isolate min-h-svh min-w-svw bg-neutral-100 bg-[url('/assets/images/bg-gradient-subtle-light.jpg')] bg-cover bg-no-repeat">
      <Swiper
        modules={[Manipulation]}
        onSwiper={swiper => swiperRef.current = swiper}
        spaceBetween={0}
        slidesPerView={1}
        allowTouchMove={false}
        centeredSlides
        centeredSlidesBounds
      >
        <SwiperSlide>
          <section className="flex justify-center items-center min-h-svh mx-auto md:w-96 max-w-md md:max-w-sm">
            { !hideLoader && <IndeterminateProgressBar className="h-[4px] w-[400px] max-w-[40svw]" /> }
          </section>
        </SwiperSlide>
        <SwiperSlide data-slide-key="username">
          {/* STEP_USERNAME */}
          <ProfileSetupUsername />
        </SwiperSlide>
        <SwiperSlide className="h-auto">
          {/* STEP_PROFILE_PICTURE */}
          <ProfileSetupProfilePicture />
        </SwiperSlide>
        <SwiperSlide>
          {/* STEP_COMPLETE */}
          <ProfileSetupComplete />
        </SwiperSlide>
      </Swiper>
    </section>
  );
}
