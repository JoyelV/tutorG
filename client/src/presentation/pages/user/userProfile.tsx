import { useState } from 'react';
import ProfileDashboard from '../../components/common/ProfileDashboard';
import AccountSettings from '../../components/common/AccountSettings';
import Dashboard from '../../components/common/Dashboard';
import Navbar from '../../components/common/Navbar';
import WishlistPage from './WishlistPage';
import EnrolledCoursePage from './EnrolledCourses';
import PurchaseHistoryPage from './PurchaseHistoryPage';
import MyTutorsPage from '../instructor/MyTutorsPage';
import Message from './ChatUser';

export type Section = 'Dashboard' | 'Courses' | 'Teachers' | 'Message' | 'Wishlist' | 'Purchase History' | 'Settings';

const UserProfile = () => {
    const [currentSection, setCurrentSection] = useState<Section>('Dashboard');

    const handleSectionChange = (section: Section) => {
        setCurrentSection(section);
    };

    return (
        <div className="App font-sans text-gray-800 p-4">
            <Navbar />
            <ProfileDashboard onSectionChange={handleSectionChange} />

            <div className="mt-6">
                {currentSection === 'Dashboard' && <Dashboard />}
                {currentSection === 'Courses' &&  <EnrolledCoursePage />}
                {currentSection === 'Teachers' && <MyTutorsPage />}
                {currentSection === 'Message' && <Message />}
                {currentSection === 'Wishlist' && <WishlistPage />}
                {currentSection === 'Purchase History' && <PurchaseHistoryPage />}
                {currentSection === 'Settings' && <AccountSettings />}
            </div>
        </div>
    );
};

export default UserProfile;
