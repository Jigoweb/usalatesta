import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, Phone, MapPin } from 'lucide-react';
import numeroVerdeImg from '../assets/images/immagine-numero.png';
import manualePdf from '../dati/Codice-di-Gioco-Responsabile.pdf';

export default function Support() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="p-4 flex items-center bg-white shadow-sm">
        <button onClick={() => navigate('/home')} className="mr-4">
          <ChevronLeft className="text-primary-blue" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Manual Download */}
        <div className="bg-gradient-to-r from-primary-blue to-blue-700 rounded-2xl p-6 text-white shadow-lg">
          <h2 className="text-xl font-bold mb-2">Manuale informativo</h2>
          <p className="text-blue-100 text-sm mb-4">Scarica la guida completa al gioco responsabile</p>
          <a 
            href={manualePdf} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm"
          >
            <Download size={18} className="mr-2" />
            Scarica PDF
          </a>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Cerchi aiuto?</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <a href="tel:800558822" className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                <Phone size={20} />
              </div>
              <span className="text-sm font-bold text-gray-800">Telefono Verde</span>
              <span className="text-xs text-green-600 font-bold">800 55 88 22</span>
            </a>
            
            <a href="tel:112" className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-2">
                <Phone size={20} />
              </div>
              <span className="text-sm font-bold text-gray-800">Emergenza</span>
              <span className="text-xs text-red-600 font-bold">112</span>
            </a>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-center">
            <img src={numeroVerdeImg} alt="Numero Verde Nazionale" className="max-h-24 object-contain" />
          </div>
        </div>

        {/* Centers Banner */}
        <div 
          onClick={() => navigate('/support/centers')}
          className="bg-secondary-orange rounded-2xl p-6 text-white shadow-lg cursor-pointer transform transition-transform hover:-translate-y-1 relative overflow-hidden"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-1">Centri di aiuto</h2>
              <p className="text-orange-100 text-sm">Trova il centro più vicino a te</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <MapPin size={24} />
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}