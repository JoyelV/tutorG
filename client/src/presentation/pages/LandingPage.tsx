import HeroSection from '../components/common/HeroSection';
import Topics from '../components/common/Topics';
import ImageCard from '../components/common/ImageCard';
import RecentlyAddedCourses from '../components/common/RecentlyAddedCourses';
import BecomeInstructor from '../components/common/BecomeInstructor';
import TopInstructors from '../components/common/TopInstructors';
import TrustedCompanies from '../components/common/TrustedCompanies';
import HeroSection2 from '../components/common/HeroSection2';
import Navbar from '../components/common/Navbar';


function App() {
    return (
        <div className="App font-sans text-gray-800">
        <Navbar />
            <HeroSection />
            <Topics />
            <div className="mt-10 w-full flex justify-center items-center p-10 font-bold text-3xl text-sky-600">
            Best Selling Courses
           </div>
            <ImageCard />
            <RecentlyAddedCourses />
            <BecomeInstructor />
            <TopInstructors />
            <TrustedCompanies />
            <HeroSection2 />
        </div>
    );
}

export default App;
