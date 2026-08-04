import { Bookmark } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">

      {/* Top */}<div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {job?.company?.name || "Company Name"}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            {job?.location || "Location"}
          </p>
        </div>

        <button className="p-2 rounded-full hover:bg-gray-100 transition">
          <Bookmark size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Title */}<div className="mt-5">
        <h2 className="text-2xl font-bold text-gray-900">
          {job?.title}
        </h2>

        <p className="text-gray-600 mt-3 line-clamp-3">
          {job?.description}
        </p>
      </div>

      {/* Badges */}<div className="flex flex-wrap gap-2 mt-5">
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          {job?.position} Position
        </span>

        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
          {job?.jobType}
        </span>

        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
          {job?.experience} Years
        </span>

        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
          ₹ {job?.salary} LPA
        </span>
      </div>

      {/* Footer */}<div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {job?.createdAt
            ? formatDistanceToNow(new Date(job.createdAt), {
                addSuffix: true,
              })
            : "Recently posted"}
        </p>

        <button
          onClick={() => navigate(`/jobs/${job._id}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition"
        >
          View Details
        </button>
      </div>

    </div>
  );
};

export default JobCard;