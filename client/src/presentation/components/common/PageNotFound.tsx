import React from 'react';

function Pagenotfound() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-sky-600 bg-fixed bg-cover bg-bottom error-bg">
            <div className="container">
                <div className="row">
                    <div className="col-sm-8 offset-sm-2 text-gray-50 text-center -mt-52">
                        <div className="relative">
                            <h1 className="relative text-9xl tracking-tighter-less text-shadow font-sans font-bold">
                                <span>4</span><span>0</span><span>4</span>
                            </h1>
                            <span className="absolute top-0 -ml-12 text-white font-semibold">Uh-oh!</span>
                        </div>
                        <p className="text-white mt-2 mb-6">
                            Looks like you've ventured into the unknown...<br />
                            Don't worry, you're not lost (well, maybe a little).<br />
                        </p>
                        <p className="text-white mt-4">
                            Did you know?<br />
                            A "404 Not Found" error was named after a room at the CERN laboratories in Switzerland, where the web was born! Now you know more than just the error code!
                        </p>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pagenotfound;
