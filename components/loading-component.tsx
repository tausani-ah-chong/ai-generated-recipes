import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import { FunctionComponent } from "react";

type LoadingComponentProps = {
  progressText: string;
}

const LoadingComponent: FunctionComponent<LoadingComponentProps> = (props) => {
  const { progressText } = props;

  return (
    <div className='py-36 space-y-5'>
      <div className='text-center'>
        <CircularProgress />
      </div>
      <p className="font-sans italic text-center text-slate-400">
        {progressText}
      </p>
    </div>
  )
}

export default LoadingComponent;
