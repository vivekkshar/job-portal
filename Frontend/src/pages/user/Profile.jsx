import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="max-w-5xl mx-auto py-10">
      <div className="bg-white rounded-xl shadow p-8">
        <div className="flex items-center gap-6">
          <img
            src={
              user?.profile?.profilePhoto ||
              "https://ui-avatars.com/api/?name=User"
            }
            alt=""
            className="w-28 h-28 rounded-full object-cover"
          />

          <div>
            <h1 className="text-3xl font-bold">{user?.fullName}</h1>

            <p className="text-gray-600">{user?.email}</p>

            <p className="text-gray-600">{user?.profile?.phoneNumber}</p>
          </div>
          <button
            onClick={() => navigate("/profile/edit")}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
