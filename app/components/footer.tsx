import Image from "next/image";

export default function Footer() {
  return (
    <div className="bottom-0 w-full bg-blue-600 flex items-center flex-col lg:flex-row lg:justify-between gap-4 px-4">
      <div className="flex flex-row gap-8 items-center justify-center mb-4">
       
      </div>
      <div className="flex flex-row gap-2 justify-center items-center mb-2">
        <p className="inline-block text-white">

          Made with
        </p>
        <Image
          src="/assets/icons/heart.png"
          width={30}
          height={30}
          alt="Heart Icon"
        />
        <p className="inline-block text-white">

          by Team NFT Gen
        </p>
      </div>
    </div>
  );
}
