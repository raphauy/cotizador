import { OptionalColorsBox, OptionalColorsBoxDialog } from "@/app/admin/works/optional-works-box";
import { DeleteWorkDialog, DuplicateWorkDialog, WorkDialog } from "@/app/admin/works/work-dialogs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "@/components/ui/menubar";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

type Props= {
    workId: string
    cotizationId: string
    workName: string
    isEditable: boolean
}
export default function WorkMenu({ workId, cotizationId, workName, isEditable }: Props) {
    return (
        <Menubar className="border-0 bg-white">
            <MenubarMenu>
                <MenubarTrigger className="px-1 border-0 cursor-pointer"><DotsVerticalIcon className="h-5 w-5" /></MenubarTrigger>
                <MenubarContent className="p-4 text-muted-foreground">
                    {
                        !isEditable && 
                        <MenubarItem className="w-full px-0.5">
                            Este trabajo ya no se puede modificar
                        </MenubarItem>
                    }

                    { isEditable && 
                    <>
                    <MenubarItem className="w-full px-0.5">
                        <Link href={`/seller/cotizations/${cotizationId}/${workId}`}>
                            <div className="flex items-center gap-3.5 hover:cursor-pointer text-base hover:text-green-600">
                                <ExternalLink size={23} />
                                <p>Editar trabajo</p>
                            </div>                             
                        </Link>
                    </MenubarItem>
                    <MenubarSeparator />

                    <MenubarItem asChild className="hover:bg-green-100">
                        <WorkDialog id={workId} cotizationId={cotizationId} />
                    </MenubarItem>
                    <MenubarSeparator />

                    <MenubarItem asChild>
                        <OptionalColorsBoxDialog workId={workId} />
                    </MenubarItem>
                    <MenubarSeparator />

                    <MenubarItem asChild>
                        <DuplicateWorkDialog id={workId} description={`Al acepar se duplicará el trabajo ${workName} en este mismo presupuesto`} />
                    </MenubarItem>
                    <MenubarSeparator />
                    
                    <MenubarItem asChild>
                        <DeleteWorkDialog id={workId} description={`Seguro que quieres eliminar el trabajo ${workName}?`} />
                    </MenubarItem>
                    </>
                    }
                </MenubarContent>
            </MenubarMenu>
        </Menubar>

    );
}