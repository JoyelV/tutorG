import { assets } from '../assets/assets_user/assets';

const TrustedCompanies = () => {
    const companies = [
        { name: "Netflix", logo: assets.netflixLogo },
        { name: "YouTube", logo: assets.youtubeLogo },
        { name: "Google", logo: assets.googleLogo },
        { name: "Lenovo", logo: assets.lenovoLogo },
        { name: "Slack", logo: assets.slackLogo },
        { name: "Verizon", logo: assets.verizonLogo },
        { name: "Lexmark", logo: assets.lexmarkLogo },
        { name: "Microsoft", logo: assets.microsoftLogo },
    ];

    return (
        <section className="p-8 bg-white flex flex-col lg:flex-row items-center justify-center">
            {/* Left Text Section */}
            <div className="mb-8 lg:mb-0 lg:mr-12 text-center lg:text-left max-w-sm">
                <h3 className="text-3xl font-bold mb-2">6.3k Trusted Companies</h3>
                <p className="text-gray-600">Empowering innovation with industry leaders worldwide. Trusted by thousands of top brands to drive growth and excellence.</p>
            </div>
    
            {/* Right Logos Section */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {companies.map((company, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm p-4 w-36 h-24"
                    >
                        <img
                            src={company.logo}
                            alt={`${company.name} logo`}
                            className="w-full h-full object-contain"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
    
};

export default TrustedCompanies;
