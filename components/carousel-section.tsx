import Image from 'next/image';

const CarouselSection = ({ prop }: { prop: string }) => {
  return (
    <div
      className="flex items-center justify-center p-10"
      style={{
        background: 'linear-gradient(26.61deg, #05303B 0.93%, #2B7C7E 101.37%)',
      }}
    >
      <div className="text-center text-white max-w-md ">
        <Image
          rel="preload"
          src={`${prop}`}
          alt={`${prop}`}
          width={750}
          height={850}
          className="mx-auto hidden md:block"
        />
      </div>
    </div>
  );
};

export default CarouselSection;
