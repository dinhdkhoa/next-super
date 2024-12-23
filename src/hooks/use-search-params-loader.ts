import { ReadonlyURLSearchParams } from "next/navigation";
import { useState } from "react";

export const useSeachParamsLoader = () => {
    const [seachParams, setSeachParams] = useState<ReadonlyURLSearchParams | null>(null);

    return {params: seachParams, onParamsReceived: setSeachParams};
}