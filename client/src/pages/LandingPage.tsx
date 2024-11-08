import HeroSection from '../components/HeroSection';
import Topics from '../components/Topics';
import ImageCard from '../components/ImageCard';
import RecentlyAddedCourses from '../components/RecentlyAddedCourses';
import BecomeInstructor from '../components/BecomeInstructor';
import TopInstructors from '../components/TopInstructors';
import TrustedCompanies from '../components/TrustedCompanies';


function App() {
    return (
        <div className="App font-sans text-gray-800">
            <HeroSection />
            <Topics />
            <ImageCard />
            <RecentlyAddedCourses />
            <BecomeInstructor />
            <TopInstructors />
            <TrustedCompanies />
        </div>
    );
}

export default App;
