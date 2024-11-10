import HeroSection from '../components/HeroSection';
import Topics from '../components/Topics';
import ImageCard from '../components/ImageCard';
import RecentlyAddedCourses from '../components/RecentlyAddedCourses';
import BecomeInstructor from '../components/BecomeInstructor';
import TopInstructors from '../components/TopInstructors';
import TrustedCompanies from '../components/TrustedCompanies';
import HeroSection2 from '../components/HeroSection2';


function App() {
    return (
        <div className="App font-sans text-gray-800">
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
