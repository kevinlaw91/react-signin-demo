import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Go to home page if back is not available
      navigate('/');
    }
  };

  return (
    <>
      <Helmet>
        <title>404 Not Found</title>
      </Helmet>
      <section className="flex justify-center items-center py-8 px-4 mx-auto max-w-screen-xl min-h-svh lg:py-16 lg:px-6">
        <div className="max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-neutral-600">404</h1>
          <p className="mb-4 text-lg text-gray-500">Sorry, the page you are looking for doesn&apos;t exist.</p>
          <div className="flex my-4 justify-center gap-2">
            {
              window.history.length > 1 && (
                <div>
                  <button className="inline-flex gap-1 bg-white border border-neutral-500 hover:border-neutral-400 focus:ring-4 focus:outline-none focus:ring-neutral-300 font-medium rounded-lg text-sm text-neutral-500 hover:text-neutral-400 px-5 py-2.5 text-center" onClick={handleClick}>
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                    </svg>
                    <span>Go back</span>
                  </button>
                </div>
              )
            }
            <div>
              <Link to="/" className="inline-flex text-white bg-neutral-500 hover:bg-neutral-400 focus:ring-4 focus:outline-none focus:ring-neutral-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Back to Home</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
