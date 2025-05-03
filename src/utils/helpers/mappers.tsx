import { ReactNode } from "react";
import { FaPlaystation, FaXbox } from "react-icons/fa";
import { FaComputer } from "react-icons/fa6";

export const toPlatformIcon = (platform: string, size: number, color: string) : ReactNode => {
    switch (platform) {
        case "xbox":
            return <FaXbox fontSize={size} color={color}/>
        case "playstation":
            return <FaPlaystation fontSize={size} color={color}/>
        default:
            return <FaComputer fontSize={size} color={color}/>
    }
}