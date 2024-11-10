import { useState } from 'react';
import ProfileDashboard from '../../components/ProfileDashboard';
import AccountSettings from '../../components/AccountSettings';
import Dashboard from '../../components/Dashboard'

type Section = 'Dashboard' | 'Courses' | 'Teachers' | 'Message' | 'Wishlist' | 'Purchase History' | 'Settings'

const UserProfile = () => {
    const [currentSection, setCurrentSection] = useState<Section>('Dashboard');

    const handleSectionChange = (section: Section) => {
        setCurrentSection(section);
    };

    return (
        <div className="App font-sans text-gray-800 p-4">
            <ProfileDashboard onSectionChange={handleSectionChange} />

            <div className="mt-6">
                {currentSection === 'Dashboard' && <Dashboard />}
                {currentSection === 'Courses' && <div>Courses Content</div>}
                {currentSection === 'Teachers' && <div>Teachers Content</div>}
                {currentSection === 'Message' && <div>Message Content</div>}
                {currentSection === 'Wishlist' && <div>Wishlist Content</div>}
                {currentSection === 'Purchase History' && <div>Purchase History Content</div>}
                {currentSection === 'Settings' && <AccountSettings />}
            </div>
        </div>
    );
};

export default UserProfile;
