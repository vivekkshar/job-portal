
import { useEffect, useState } from "react";
import API from "../../services/axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  MapPin,
  Briefcase,
  IndianRupee,
  Users,
} from "lucide-react";

import { formatDistanceToNow } from "date-fns";

import useGetSingleJob from "../../hooks/useGetSingleJob";

const JobDetails = () => {
  const { id } = useParams();

  const [applying, setApplying] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] =
    useState(true);

  useGetSingleJob(id);

  const { singleJob, loading } = useSelector(
    (store) => store.job
  );

  // Check whether user already applied
  useEffect(() => {
    const checkApplication = async () => {
      try {
        const res = await API.get(
          "/application/myapplications"
        );

        if (res.data.success) {
          const applications = res.data.applications || [];

          const applied = applications.some(
            (application) =>
              application.job?._id === id ||
              application.job === id
          );

          setAlreadyApplied(applied);
        }
      } catch (error) {
        console.log(
          "Application check error:",
          error.response?.data?.message
        );
      } finally {
        setCheckingApplication(false);
      }
    };

    checkApplication();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-semibold">
          Loading...
        </h1>
      </div>
    );
  }

  if (!singleJob) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-semibold">
          Job Not Found
        </h1>
      </div>
    );
  }

  // Apply Job
  const applyJobHandler = async () => {
    if (alreadyApplied) {
      toast.error("You have already applied for this job");
      return;
    }

    try {
      setApplying(true);

      const res = await API.post(
        `/applications/apply/${singleJob._id}`
      );

      if (res.data.success) {
        toast.success(res.data.message);

        // Immediately update button
        setAlreadyApplied(true);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Application Failed"
      );
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-8">

          <div className="flex flex-col md:flex-row justify-between gap-8">

            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                {singleJob.title}
              </h1>

              <p className="text-xl text-gray-600 mt-2">
                {singleJob.company?.name}
              </p>

              <div className="flex flex-wrap gap-3 mt-6">

                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  {singleJob.jobType}
                </span>

                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                  {singleJob.experience} Years Exp.
                </span>

                <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                  ₹{" "}
                  {(singleJob.salary / 100000).toFixed(1)} LPA
                </span>

              </div>
            </div>

            {/* Apply Button */}
            <div className="flex items-start">

              <button
                onClick={applyJobHandler}
                disabled={
                  applying ||
                  alreadyApplied ||
                  checkingApplication
                }
                className={`px-8 py-3 rounded-xl font-semibold text-white transition ${
                  alreadyApplied
                    ? "bg-green-600 cursor-not-allowed"
                    : checkingApplication
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {checkingApplication
                  ? "Checking..."
                  : applying
                  ? "Applying..."
                  : alreadyApplied
                  ? "✓ Already Applied"
                  : "Apply Now"}
              </button>

            </div>

          </div>
        </div>

        {/* Job Information */}
        <div className="bg-white rounded-2xl shadow-md p-8 mt-8">

          <h2 className="text-2xl font-bold mb-6">
            Job Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="flex items-center gap-3">
              <MapPin className="text-blue-600" />

              <div>
                <p className="font-semibold">
                  Location
                </p>

                <p>{singleJob.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Briefcase className="text-green-600" />

              <div>
                <p className="font-semibold">
                  Position
                </p>

                <p>{singleJob.position}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <IndianRupee className="text-purple-600" />

              <div>
                <p className="font-semibold">
                  Salary
                </p>

                <p>
                  ₹{" "}
                  {(singleJob.salary / 100000).toFixed(1)} LPA
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="text-orange-600" />

              <div>
                <p className="font-semibold">
                  Vacancies
                </p>

                <p>{singleJob.vacancies}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-md p-8 mt-8">

          <h2 className="text-2xl font-bold mb-4">
            Job Description
          </h2>

          <p className="text-gray-700 leading-8">
            {singleJob.description ||
              "No description provided."}
          </p>

        </div>

        {/* Requirements */}
        <div className="bg-white rounded-2xl shadow-md p-8 mt-8">

          <h2 className="text-2xl font-bold mb-4">
            Requirements
          </h2>

          <div className="flex flex-wrap gap-3">

            {singleJob.requirements?.length > 0 ? (
              singleJob.requirements.map(
                (skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                )
              )
            ) : (
              <p className="text-gray-500">
                No requirements added.
              </p>
            )}

          </div>
        </div>

        {/* Company */}
        <div className="bg-white rounded-2xl shadow-md p-8 mt-8">

          <h2 className="text-2xl font-bold mb-4">
            Company Information
          </h2>

          <div className="space-y-3">

            <div>
              <p className="font-semibold">
                Company Name
              </p>

              <p>
                {singleJob.company?.name ||
                  "N/A"}
              </p>
            </div>

            <div>
              <p className="font-semibold">
                Location
              </p>

              <p>
                {singleJob.company?.location ||
                  "N/A"}
              </p>
            </div>

            <div>
              <p className="font-semibold">
                Posted
              </p>

              <p>
                {singleJob.createdAt
                  ? formatDistanceToNow(
                      new Date(singleJob.createdAt),
                      {
                        addSuffix: true,
                      }
                    )
                  : "N/A"}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default JobDetails;
