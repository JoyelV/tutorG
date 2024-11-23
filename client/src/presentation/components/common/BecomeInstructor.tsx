import { assets } from '../../../assets/assets_user/assets';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const BecomeInstructor: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="flex flex-col md:flex-row flex-wrap bg-white rounded-lg px-6 md:px-10 lg:px-20">
            {/* Left Side */}
            <div className="md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px] text-black">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight md:leading-tight lg:leading-tight">
                    Start teaching with us and inspire others
                </h2>
                <div className="flex flex-col md:flex-row items-center gap-3 text-sm font-light">
                    <p>
                        Become an instructor & start teaching with 26k certified <br className="hidden sm:block" />instructors. Create a success story with 67.1k Students <br className="hidden sm:block" /> — Grow yourself with 71 countries.<br className="hidden sm:block" />
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/instructor')}
                    variant="contained"
                    color="warning"
                    sx={{ fontWeight: 'bold', textTransform: 'none', mt: 2 }}
                >
                    Get Started
                </Button>
            </div>

            {/* Right Side */}
            <div className="md:w-1/2 relative">
                <img
                    className="w-9/12 md:absolute bottom-0 h-auto rounded-lg"
                    src={assets.InstuctorImage} 
                    alt="Connect with Us"
                />
            </div>
        </section>
    );
};

export default BecomeInstructor;
