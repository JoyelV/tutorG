import { assets } from '../../../assets/assets_user/assets';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="flex flex-col md:flex-row flex-wrap bg-white rounded-lg px-6 md:px-10 lg:px-20">
            {/* Left Side */}
            <div className="md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px] text-black">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight md:leading-tight lg:leading-tight">
                    Connect with Us
                </h2>
                <div className="flex flex-col md:flex-row items-center gap-3 text-sm font-light">
                    <p>
                        Want to chat? We’d love to hear from you! <br className="hidden sm:block" />
                        Get in touch with our Customer Success Team<br className="hidden sm:block" />
                        to inquire about speaking events, advertising rates, <br className="hidden sm:block" />
                        or just say hello. Get in touch with our team easily.
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/contact')}
                    variant="contained"
                    color="warning"
                    sx={{ fontWeight: 'bold', textTransform: 'none', mt: 2 }}
                >
                    Know More
                </Button>
            </div>
            
            {/* Right Side */}
            <div className="md:w-1/2 relative">
                <img
                    className="w-full md:absolute bottom-0 h-auto rounded-lg"
                    src={assets.appointment_img} // Replace with the correct path for the hero image
                    alt="Connect with Us"
                />
            </div>
        </section>
    );
};

export default HeroSection;
