import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoBlue from '../assets/images/usa-la-testa_logo-blue.png';

export default function Splash() {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('usalatesta_user_consent');
    if (hasConsented === 'true') {
      navigate('/home');
    }
  }, [navigate]);

  const handleStart = () => {
    if (isChecked) {
      localStorage.setItem('usalatesta_user_consent', 'true');
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between p-8 relative overflow-hidden">
      {/* Top Section with Logo */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mt-20">
        <img src={logoBlue} alt="USA LA TESTA" className="mb-12 w-48 object-contain" />
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-serif italic text-primary-blue">
            "Le responsabilità educano"
          </h1>
          <p className="text-gray-400 text-sm text-right w-full pr-12">
            (W. Phillips)
          </p>
        </div>
      </div>

      {/* Bottom Section with Form */}
      <div className="w-full max-w-md space-y-6 mb-8">
        <div className="flex items-start space-x-3">
          <div className="flex items-center h-6">
            <input
              id="consent"
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="w-5 h-5 border-2 border-primary-blue rounded text-primary-blue focus:ring-primary-blue"
            />
          </div>
          <label htmlFor="consent" className="text-sm text-primary-blue leading-tight">
            dichiaro di essere maggiorenne e di aver letto e accettato le informative sulla{' '}
            <a href="#" className="underline font-semibold">privacy policy</a>
          </label>
        </div>

        <button
          onClick={handleStart}
          disabled={!isChecked}
          className={`w-full py-4 rounded-full text-white font-bold text-lg transition-all duration-300 ${
            isChecked 
              ? 'bg-primary-blue shadow-lg hover:bg-blue-900 transform hover:-translate-y-1' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Iniziamo
        </button>
      </div>
    </div>
  );
}