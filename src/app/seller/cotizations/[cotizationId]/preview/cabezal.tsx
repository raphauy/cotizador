"use client";

import Image from "next/image";

export default function Cabezal() {
  return (
    <header className="pt-6 pb-1 text-gray-800">
        <div className="h-2 bg-verde-abbate mb-4"/>

        <div className="mx-auto flex justify-between items-center">
            <div className="flex items-center w-72 min-h-[60px] pt-4">
                <Image 
                  src="/logo4.jpeg" 
                  width={280} 
                  height={60} 
                  alt="logo"
                  priority
                  style={{ height: 'auto' }}
                />
            </div>
            <div className="flex space-x-4 text-[10px]">
                <div>
                    <h2 className="font-semibold">MONTEVIDEO</h2>
                    <p>Av. Italia 3577</p>
                    <p>Tel: 2507 3757</p>
                    <p>ventas@anibalabbate.com</p>
                </div>
                <div>
                    <h2 className="font-semibold">PUNTA DEL ESTE</h2>
                    <p>Av. Italia Parada 4 1/2</p>
                    <p>Tel: 4248 7756</p>
                    <p>puntadeleste@anibalabbate.com</p>
                </div>
            </div>
        </div>
    </header>
  )
}
