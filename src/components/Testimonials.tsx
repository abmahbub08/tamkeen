import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import type { Swiper as SwiperType } from "swiper";
import { AiFillStar } from "react-icons/ai";

interface Testimonial {
  user: User;
  rating: string;
  review: string;
}

const Testimonials = ({ testimonials }: { testimonials: Testimonial[] }) => {
  // Explicitly type the swiperRef with SwiperType
  const swiperRef = useRef<SwiperType | null>(null);

  const handleMouseEnter = () => {
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.stop();
    }
  };

  const handleMouseLeave = () => {
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.start();
    }
  };

  return (
    <div
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="mb-16">
        <span className="text-sm text-gray-500 font-medium text-center block mb-2">
          TESTIMONIAL
        </span>
        <h2 className="text-4xl text-center font-bold text-primary">
          What Customers Say about us
        </h2>
      </div>

      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        slidesPerView={1}
        spaceBetween={32}
        loop={true}
        centeredSlides={false}
        modules={[Autoplay]}
        pagination={{
          el: ".swiper-pagination",
          clickable: true,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 32,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 32,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 32,
          },
        }}
      >
        {testimonials?.map((testimonial, index) => (
          <SwiperSlide key={index}>
            <div className="group bg-white border border-solid border-gray-300 rounded-xl p-6 transition-all duration-500 w-full mx-auto hover:border-primary hover:shadow-sm active:border-primary">
              <div className="flex items-center mb-4 space-x-2">
                <div className="flex">
                  {Array(5)
                    .fill(0)
                    .map((_, index) =>
                      index < (parseInt(testimonial?.rating) || 0) ? (
                        <AiFillStar
                          key={index}
                          className="text-yellow-500 h-5 w-5"
                        />
                      ) : (
                        <AiFillStar
                          key={index}
                          className="text-gray-300 h-5 w-5"
                        />
                      )
                    )}
                </div>
                <p className="text-base text-primary">{testimonial?.rating}</p>
              </div>

              {/* <p className="text-base text-gray-600 leading-6 transition-all duration-500 pb-8 group-hover:text-gray-800 slide_active:text-gray-800">
                  {testimonial.user.review}
                </p> */}

              <div className="flex items-center gap-5 border-t border-solid border-gray-200 pt-5">
                {/* <img
                  className="rounded-full h-10 w-10"
                  src={testimonial.user.image}
                  alt="avatar"
                /> */}
                <div>
                  <h5 className="text-gray-900 font-medium transition-all duration-500 mb-1">
                    {testimonial.user.name}
                  </h5>
                  <span className="text-sm leading-4 text-gray-500">
                    {testimonial.review}
                  </span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Testimonials;
