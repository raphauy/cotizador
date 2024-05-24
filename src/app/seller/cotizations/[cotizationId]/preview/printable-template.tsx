'use client';

import { CotizationDAO } from '@/services/cotization-services';
import { forwardRef } from 'react';
import PrintableCotization from './printable-cotization';


type Props= {
    cotization: CotizationDAO
}

const PrintableTemplate = forwardRef<HTMLDivElement, Props>(({ cotization }, ref) => {

  return (
    <div className="h-0 overflow-hidden">
      <div ref={ref} className="w-full">
        <PrintableCotization cotization={cotization} />
      </div>
    </div>
  )
});
PrintableTemplate.displayName = 'PrintableTemplate';

export { PrintableTemplate };