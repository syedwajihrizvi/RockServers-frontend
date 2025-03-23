
import { Dots } from "react-activity";
import "react-activity/dist/library.css";

export const Skeleton = ({customClass}: {customClass?: string}) => {
  return (
    <div className={`skeleton${customClass ? ` ${customClass}` : ''}`}>
        <Dots color="white"/>
    </div>
  )
}
