import HeroSection from "./HeroSection";
import SearchBar from "./SearchBar";
import CategorySection from "./CategorySection";
import LatestJobs from "./LatestJobs";
import CTASection from "./CTASection";
import useGetAllJobs from "../../../hooks/useGetAllJobs";



const Home = () => {
  useGetAllJobs();
  
  return (
    <>
   
      <HeroSection />
      <SearchBar />
      <CategorySection />
      <LatestJobs />
      <CTASection />
      
    </>
  );
};

export default Home;