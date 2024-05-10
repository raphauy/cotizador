import { WorkDialog } from "@/app/admin/works/work-dialogs"
import { getFullCotizationDAO } from "@/services/cotization-services"
import { getUserDAO } from "@/services/user-services"
import CotizationDisplay from "./cotization-display"

type Props= {
  params: {
    cotizationId: string
  }
  searchParams: {
    workId: string
  }
}
export default async function CotizationPage({ params, searchParams }: Props) {
  const cotization= await getFullCotizationDAO(params.cotizationId)  
  if (!cotization)
    return <div>Presupuesto no encontrado</div>

  const workId= searchParams.workId
  const work= cotization.works.find(w => w.id === workId)

  const creator= await getUserDAO(cotization.creatorId)
  const seller= await getUserDAO(cotization.sellerId)
    
  return (
    <div className="w-full flex flex-col items-end">
      <div className="flex flex-col w-full pt-4 gap-2">
        <CotizationDisplay cotization={cotization} creatorName={creator.name} sellerName={seller.name} selectedWorkId={workId} />

        {cotization.works.length === 0 && 
          <div className="flex items-center justify-center">
            <WorkDialog cotizationId={cotization.id} />
          </div>
        }
        

        {/* <p className={cn("text-xl mt-10 font-bold flex items-center gap-4 lg:hidden")}>
          Editor de trabajos:
        </p>

        <EditDisplay work={work} cotizationId={cotization.id} showDialog={cotization.works.length === 0} /> */}
      </div>
    </div>
  )
}
