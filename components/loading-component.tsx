import LinearProgress from "@mui/material/LinearProgress";
import { FunctionComponent } from "react";

type LoadingComponentProps = {
  progressText: string;
}

const LoadingComponent: FunctionComponent<LoadingComponentProps> = (props) => {
  const { progressText } = props;

  return (
    <div className='justify-center min-w-min items-center flex-col space-y-5'>
      <div>
        <LinearProgress sx={{ textAlign: 'center' }} />
      </div>
      <p className="font-sans italic text-slate-500">
        {progressText}
      </p>
      <p className="text-slate-500 font-sans italic">
        ...please allow a couple minutes
      </p>
    </div>
  )
}

export default LoadingComponent;
