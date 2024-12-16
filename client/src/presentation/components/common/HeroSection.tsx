import { assets } from '../../../assets/assets_user/assets';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="flex flex-col md:flex-row flex-wrap bg-white rounded-lg px-1 md:px-3 lg:px-6">
            {/* Left Side */}
            <div className="md:w-1/2 flex flex-col items-center justify-center gap-2 py-10 md:py-[10vw] text-black">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight md:leading-tight lg:leading-tight text-center">
            Connect with Us
                </h2>
                <div className="md:w-1/2 flex flex-col items-center justify-center gap-2">
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
                    src={assets.appointment_img} 
                    alt="Connect with Us"
                />
            </div>
        </section>
    );
};

export default HeroSection;
