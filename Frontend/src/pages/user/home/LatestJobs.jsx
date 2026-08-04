import { useSelector } from "react-redux";
import JobCard from "../../../components/job/JobCard";

const LatestJobs = () => {
  const { jobs } = useSelector((store) => store.job);

  return (
    <section className="max-w-7xl mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-10">
        Latest Jobs
      </h2>

      {jobs.length === 0 ? (
        <p className="text-center text-gray-500">
          No Jobs Available
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.slice(0, 6).map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </section>
  );
};

export default LatestJobs;