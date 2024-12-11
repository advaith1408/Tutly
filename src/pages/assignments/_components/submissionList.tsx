import SortBy from "./SortBy";

export const SubmissionList = ({
  assignmentId,
  assignment,
  submissions,
  searchParams,
  username,
}: {
  assignmentId: any;
  assignment: any;
  submissions: any;
  searchParams: any;
  username: any;
}) => {
  const sortBy = searchParams?.sortBy || "username";

  submissions = submissions.sort((a: any, b: any) => {
    if (sortBy == "username") {
      return a.enrolledUser.username.localeCompare(b.enrolledUser.username);
    } else if (sortBy == "points") {
      return b.points.length - a.points.length;
    } else if (sortBy == "submissionCount") {
      return a.submissionCount - b.submissionCount;
    } else if (sortBy == "submissionIndex") {
      return a.submissionIndex - b.submissionIndex;
    } else if (sortBy == "submissionDate") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
  });

  return (
    <div className="max-h-[90vh] overflow-y-scroll">
      <SortBy assignmentId={assignmentId} searchParams={searchParams} />
      <div className="border-b p-2">
        <p className="text-sm font-semibold">Submissions (max:{assignment?.maxSubmissions} )</p>
        <p className="text-xs text-slate-600">
          {submissions.filter((submission: any) => submission?.points.length == 0).length}{" "}
          un-evaluated / {submissions.length} total
        </p>
      </div>
      <div>
        {Array.isArray(submissions) &&
          submissions.map((singleSubmission: any, index) => {
            if (!singleSubmission) return null;
            let hrefLink = username
              ? `/assignments/${assignmentId}/evaluate?username=${singleSubmission.enrolledUser.username}&submissionId=${singleSubmission.id}`
              : `/assignments/${assignmentId}/evaluate?submissionId=${singleSubmission.id}`;

            const sortBy = searchParams?.sortBy;

            if (sortBy) {
              if (username) {
                hrefLink = `/assignments/${assignmentId}/evaluate?username=${singleSubmission.enrolledUser.username}&submissionId=${singleSubmission.id}&sortBy=${sortBy}`;
              } else {
                hrefLink = `/assignments/${assignmentId}/evaluate?submissionId=${singleSubmission.id}&sortBy=${sortBy}`;
              }
            }

            return (
              <a key={index} href={hrefLink}>
                <div
                  className={`cursor-pointer border-b p-2 hover:bg-gray-100 hover:text-blue-500 ${singleSubmission.id == searchParams?.submissionId && "bg-gray-100 text-blue-500"} ${singleSubmission.points.length > 0 && "text-green-500"} `}
                >
                  <p className="text-sm">
                    {singleSubmission.enrolledUser.username}
                    {singleSubmission.submissionCount > 1 &&
                      ` (${singleSubmission.submissionIndex}/${singleSubmission.submissionCount})`}
                  </p>
                  <p className="text-xs text-slate-600">
                    {singleSubmission.enrolledUser.user.name}
                  </p>
                </div>
              </a>
            );
          })}
      </div>
    </div>
  );
};
