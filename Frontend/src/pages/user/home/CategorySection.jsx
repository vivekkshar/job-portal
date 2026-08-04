const categories = [
  "Frontend",
  "Backend",
  "Full Stack",
  "UI/UX",
  "Data Science",
  "DevOps",
];

const CategorySection = () => {
  return (
    <section className="max-w-7xl mx-auto py-16">

      <h2 className="text-3xl font-bold text-center mb-10">
        Popular Categories
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">

        {categories.map((category) => (
          <div
            key={category}
            className="border rounded-lg p-5 text-center cursor-pointer hover:bg-blue-600 hover:text-white transition"
          >
            {category}
          </div>
        ))}

      </div>
    </section>
  );
};

export default CategorySection;