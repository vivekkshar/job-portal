import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetCompanies from "../../hooks/useGetCompanies";
import { useNavigate } from "react-router-dom";


const Companies = () => {
  useGetCompanies();

  const { companies } = useSelector((store) => store.company);
  const navigate = useNavigate();
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Companies</h1>

        <Link
          to="/admin/company/create"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          + New Company
        </Link>
      </div>

      <div className="grid gap-4">
        {companies.length === 0 ? (
          <p className="text-gray-500">No Companies Found</p>
        ) : (
          companies.map((company) => (
            <div
              key={company._id}
              className="bg-white shadow rounded-xl p-5 flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">{company.name}</h2>

                <p className="text-gray-500">{company.location}</p>
              </div>

              <button
              onClick={() => navigate(`/admin/company/${company._id}`)}
               className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Edit
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Companies;
