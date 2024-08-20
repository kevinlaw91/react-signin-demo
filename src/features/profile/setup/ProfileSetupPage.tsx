import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperClass from 'swiper';
import 'swiper/css';
import { ProfileSetupStep } from '@/features/profile/setup/ProfileSetupWizard.ts';
import ProfileSetupUsername from '@/features/profile/setup/ProfileSetupUsername.tsx';
import ProfileSetupProfilePicture from '@/features/profile/setup/ProfileSetupProfilePicture.tsx';
import ProfileSetupComplete from '@/features/profile/setup/ProfileSetupComplete.tsx';
import { IndeterminateProgressBar } from '@/components/IndeterminateProgressBar.tsx';

export default function ProfileSetupPage() {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [hideLoader, setHideLoader] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setHideLoader(true);
      swiperRef.current?.slideTo(ProfileSetupStep.STEP_USERNAME);
    }, 2400);
  }, []);

  return (
    <section className="isolate min-h-svh min-w-svw bg-neutral-100 bg-[url('/assets/images/bg-gradient-subtle-light.jpg')] bg-cover bg-no-repeat">
      <Swiper
        onSwiper={swiper => swiperRef.current = swiper}
        spaceBetween={0}
        slidesPerView={1}
        allowTouchMove={false}
        centeredSlides
        centeredSlidesBounds
        initialSlide={ProfileSetupStep.STEP_VERIFY}
      >
        <SwiperSlide>
          <section className="flex justify-center items-center min-h-svh mx-auto md:w-96 max-w-md md:max-w-sm">
            { !hideLoader && <IndeterminateProgressBar className="h-[4px] w-[400px] max-w-[40svw]" />}
          </section>
        </SwiperSlide>
        <SwiperSlide>
          {/* STEP_USERNAME */}
          <ProfileSetupUsername />
        </SwiperSlide>
        <SwiperSlide>
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
