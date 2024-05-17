import { ClientType } from "@prisma/client";
import { getColorDAO } from "./color-services";
import { calculateTotalWorkValue } from "./optional-colors-services";

async function main() {

    console.log("Initializing...")

    const workId= "clw201xdh000zb38szchwwv1z"
    const colorId= "cluwqj9x60002bv8i3pig2q8q"
    const color= await getColorDAO(colorId)
    console.log("color: ", color.name)
    const colorRossoId= "cluwqj9xk000abv8ifm28y5tb"
    const colorRosso= await getColorDAO(colorRossoId)
    console.log("colorRosso: ", colorRosso.name)
    const result= await calculateTotalWorkValue(workId, [colorRosso, color])
    console.log(result);
}

//main()