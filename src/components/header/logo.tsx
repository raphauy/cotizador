import Image from "next/image";
import Link from "next/link";


export default async function Logo() {

  return (
    <Link href="/">
      <div className="text-2xl font-bold pl-3 flex py-2 gap-1 items-center">
        <Image src="/logo.png" width={30} height={30} alt="Logo" />  
        <p className="text-gray-400">Cotizador</p>
        <p className="text-[#268559] whitespace-nowrap dark:text-white">Aníbal Abbate</p>
      </div>
    </Link>
  )  
}
