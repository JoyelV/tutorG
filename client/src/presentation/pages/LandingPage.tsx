import HeroSection from '../components/common/HeroSection';
import Topics from '../components/common/Topics';
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
            <RecentlyAddedCourses />
            <BecomeInstructor />
            <TopInstructors />
            <TrustedCompanies />
            <HeroSection2 />
        </div>
    );
}

export default App;
