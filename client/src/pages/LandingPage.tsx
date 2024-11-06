import HeroSection from '../components/HeroSection';
import Topics from '../components/Topics';
import BestSellingCourses from '../components/BestSellingCourses';
import RecentlyAddedCourses from '../components/RecentlyAddedCourses';
import BecomeInstructor from '../components/BecomeInstructor';
import TopInstructors from '../components/TopInstructors';
import TrustedCompanies from '../components/TrustedCompanies';


function App() {
    return (
        <div className="App font-sans text-gray-800">
            <HeroSection />
            <Topics />
            <BestSellingCourses />
            <RecentlyAddedCourses />
            <BecomeInstructor />
            <TopInstructors />
            <TrustedCompanies />
        </div>
    );
}

export default App;
