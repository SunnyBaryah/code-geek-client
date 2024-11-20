import { Submission } from "../../interfaces/Submission.ts";
import submissionService from "../../services/submission.ts";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store.ts";
import { toast } from "react-toastify";
import { setSubmissions } from "@/store/submissionsSlice.ts";
import { Skeleton } from "../ui/skeleton.tsx";
export default function Submissions() {
  const prob_id: number = Number(useParams().problemId);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Submission[]>();
  const dispatch = useDispatch();
  const stateData = useSelector(
    (state: RootState) => state.submissions.submissions
  );

  function formatDate(isoDate: string): string {
    const date = new Date(isoDate);

    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };

    return new Intl.DateTimeFormat("en-US", options).format(date);
  }
  useEffect(() => {
    const fetchSubmissions = async () => {
      let dataToDisplay;
      if (stateData.length > 0) {
        console.log("State Data : ", stateData);
        dataToDisplay = stateData;
        setData(dataToDisplay);
      } else {
        dataToDisplay = await submissionService.getSubmission(prob_id);
        if (!dataToDisplay) {
          toast.error("Error while fetching submissions");
        } else {
          dispatch(setSubmissions(dataToDisplay.data.data));
          setData(dataToDisplay.data.data);
        }
      }
      // console.log(allSubmissions?.data.data);
      setLoading(false);
      // console.log(submissions);
    };
    fetchSubmissions();
  }, [prob_id]);
  return loading === true ? (
    <div className="flex flex-col justify-center items-center gap-4 my-2">
      <Skeleton className="bg-gray-700 w-[90%] h-[35px]" />
      <Skeleton className="bg-gray-700 w-[90%] h-[35px]" />
    </div>
  ) : data && data.length > 0 ? (
    <div className="flex flex-col w-full border-t-2 border-gray-900 max-h-[50vh] lg:max-h-[77vh] overflow-auto">
      <div className="flex justify-between w-full px-4 py-2 border-b border-gray-600">
        <h1 className="font-bold">Status</h1>
        <h3 className="font-bold">Submit Date</h3>
      </div>
      {data.map((submission: Submission, index: number) => {
        // console.log(submission);
        return (
          <div
            key={index}
            className="flex justify-between w-full px-4 py-4 border-b border-gray-600"
          >
            <h1
              className={`${
                submission.status === "Wrong Answer"
                  ? "text-red-600"
                  : "text-green-600"
              } font-semibold`}
            >
              {submission.status}
            </h1>
            <h3>{formatDate(submission.createdAt)}</h3>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="flex justify-center py-4">
      <h1 className="text-2xl">No Submissions!</h1>
    </div>
  );
}
