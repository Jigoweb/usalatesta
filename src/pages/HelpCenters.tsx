import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, MapPin, Phone, Globe } from 'lucide-react';
import centersData from '../dati/C_17_bancheDati_32_0_0_file.json';

// Since the JSON import might be strict, let's define the shape of the raw data if needed
// or just trust the import. The raw data has keys like "__EMPTY_2" etc.
// Based on the read output:
// __EMPTY_3: Regione
// __EMPTY_9: Comune
// __EMPTY_6: SerD (Name)
// __EMPTY_7: Indirizzo
// __EMPTY_11: Telefono
// __EMPTY_13: Email
// We need to skip the first few rows which are headers.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rawCenters = (centersData as any[]).slice(3).map((row: any) => ({
  id: row.__EMPTY_5 + row.__EMPTY_6, // ASL + SerD code as ID
  region: row.__EMPTY_3,
  city: row.__EMPTY_9,
  name: `SerD ${row.__EMPTY_6?.trim()}`,
  address: row.__EMPTY_7,
  phone: row.__EMPTY_11,
  email: row.__EMPTY_13,
  province: row.__EMPTY_10
})).filter(c => c.region && c.city); // Filter out empty rows

export default function HelpCenters() {
  const navigate = useNavigate();
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');

  const regions = useMemo(() => {
    return Array.from(new Set(rawCenters.map(c => c.region))).sort();
  }, []);

  const cities = useMemo(() => {
    if (!region) return [];
    return Array.from(new Set(rawCenters.filter(c => c.region === region).map(c => c.city))).sort();
  }, [region]);

  const filteredCenters = useMemo(() => {
    if (!region) return [];
    return rawCenters.filter(c => 
      c.region === region && 
      (!city || c.city === city)
    );
  }, [region, city]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="p-4 flex items-center bg-white shadow-sm sticky top-0 z-10">
        <button onClick={() => navigate('/support')} className="mr-4">
          <ChevronLeft className="text-primary-blue" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Regione</label>
            <div className="relative">
              <select
                value={region}
                onChange={(e) => {
                  setRegion(e.target.value);
                  setCity('');
                }}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary-blue"
              >
                <option value="">Seleziona regione</option>
                {regions.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronLeft className="rotate-270 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comune</label>
            <div className="relative">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!region}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary-blue disabled:opacity-50"
              >
                <option value="">Tutti i comuni</option>
                {cities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronLeft className="rotate-270 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {region && (
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Risultati ({filteredCenters.length})
            </h2>
          )}
          
          {filteredCenters.map((center, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-primary-blue text-lg mb-2">{center.name}</h3>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start">
                  <MapPin size={16} className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                  <span>{center.address}, {center.city} ({center.province})</span>
                </div>
                
                {center.phone && (
                  <div className="flex items-center">
                    <Phone size={16} className="mr-2 text-gray-400 flex-shrink-0" />
                    <a href={`tel:${center.phone}`} className="text-blue-600 hover:underline">{center.phone}</a>
                  </div>
                )}
                
                {center.email && center.email !== '--------' && (
                  <div className="flex items-center">
                    <Globe size={16} className="mr-2 text-gray-400 flex-shrink-0" />
                    <a href={`mailto:${center.email}`} className="text-blue-600 hover:underline truncate">{center.email}</a>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {region && filteredCenters.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nessun centro trovato per i filtri selezionati.
            </div>
          )}
          
          {!region && (
            <div className="text-center py-12 text-gray-400 flex flex-col items-center">
              <Search size={48} className="mb-4 opacity-20" />
              <p>Seleziona una regione per iniziare la ricerca</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}