import Image from "next/image";
import vulvaVLogo from "../public/vulvatorious_v_logo.png";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-black">
      <Image
        src={vulvaVLogo}
        alt=""
        className="invert max-v-screen max-h-screen w-auto h-auto"
      />
    </div>
  );
}
