import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, MapPin, Phone, Mail } from 'lucide-react';
import centersData from '../dati/C_17_bancheDati_32_0_0_file.json';
import { konsumerCenters } from '../dati/konsumerData';

// ─── SerD data ────────────────────────────────────────────────────────────────
// Raw JSON fields: __EMPTY_3=Regione, __EMPTY_9=Comune, __EMPTY_6=SerD code,
// __EMPTY_7=Indirizzo, __EMPTY_10=Provincia, __EMPTY_11=Telefono, __EMPTY_13=Email

interface Center {
  type: 'serd' | 'konsumer';
  id: string;
  region: string;
  city: string;
  province: string;
  name: string;
  address: string;
  cap?: string;
  phone?: string;
  phoneGreen?: string;
  email?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serdCenters: Center[] = (centersData as any[]).slice(3).map((row: any) => ({
  type: 'serd' as const,
  id: `${row.__EMPTY_5}${row.__EMPTY_6}`,
  region: row.__EMPTY_3,
  city: row.__EMPTY_9,
  province: row.__EMPTY_10,
  name: `SerD ${row.__EMPTY_6?.trim()}`,
  address: row.__EMPTY_7,
  cap: String(row.__EMPTY_8 ?? ''),
  phone: row.__EMPTY_11,
  email: row.__EMPTY_13,
})).filter((c: Center) => c.region && c.city);

const allCenters: Center[] = [
  ...serdCenters,
  ...konsumerCenters.map(k => ({ ...k, type: 'konsumer' as const })),
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function HelpCenters() {
  const navigate = useNavigate();
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    document.getElementById('root')?.scrollTo(0, 0);
  }, []);

  const regions = useMemo(
    () => Array.from(new Set(allCenters.map(c => c.region))).sort(),
    []
  );

  const cities = useMemo(() => {
    if (!region) return [];
    return Array.from(
      new Set(allCenters.filter(c => c.region === region).map(c => c.city))
    ).sort();
  }, [region]);

  const filteredCenters = useMemo(() => {
    if (!region) return [];
    return allCenters.filter(
      c => c.region === region && (!city || c.city === city)
    );
  }, [region, city]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="p-4 flex items-center bg-white shadow-sm sticky top-0 z-50">
        <button onClick={() => navigate('/support')} className="mr-4">
          <ChevronLeft className="text-primary-blue" />
        </button>
      </div>

      <div className="p-4 space-y-4 pt-4">
        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Regione</label>
            <div className="relative">
              <select
                value={region}
                onChange={(e) => { setRegion(e.target.value); setCity(''); }}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary-blue"
              >
                <option value="">Seleziona regione</option>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
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
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronLeft className="rotate-270 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {region && (
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Risultati ({filteredCenters.length})
            </h2>
          )}

          {filteredCenters.map((center, idx) => {
            const isKonsumer = center.type === 'konsumer';
            const fullAddress = `${center.address}, ${center.city} (${center.province})`;
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

            return (
              <div
                key={idx}
                className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border-l-4 ${
                  isKonsumer ? 'border-l-emerald-500' : 'border-l-primary-blue'
                }`}
              >
                {/* Badge strip */}
                <div className="px-5 pt-4 pb-2 flex items-start gap-2">
                  <div className="flex-1">
                    <span
                      className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${
                        isKonsumer
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {isKonsumer ? 'Konsumer' : 'SerD'}
                    </span>
                    <h3 className="font-bold text-gray-800 text-base leading-snug">
                      {center.name}
                    </h3>
                  </div>
                </div>

                <div className="px-5 pb-4 space-y-1">
                  {/* Numero verde (Konsumer only) */}
                  {isKonsumer && center.phoneGreen && (
                    <a
                      href={`tel:${center.phoneGreen.replace(/\s/g, '')}`}
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <Phone size={18} className="mr-3 text-emerald-600 flex-shrink-0" />
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wide">Numero Verde</div>
                        <div className="text-sm font-semibold text-emerald-700">{center.phoneGreen}</div>
                      </div>
                    </a>
                  )}

                  {/* Telefono */}
                  {center.phone && (
                    <a
                      href={`tel:${center.phone.replace(/\s/g, '')}`}
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <Phone size={18} className="mr-3 text-primary-blue flex-shrink-0" />
                      <span className="text-sm text-gray-700 font-medium">{center.phone}</span>
                    </a>
                  )}

                  {/* Email */}
                  {center.email && center.email !== '--------' && (
                    <a
                      href={`mailto:${center.email.trim()}`}
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <Mail size={18} className="mr-3 text-primary-blue flex-shrink-0" />
                      <span className="text-sm text-gray-700 truncate flex-1">{center.email.trim()}</span>
                    </a>
                  )}

                  {/* Divider */}
                  {(center.phone || center.email) && (
                    <div className="border-t border-gray-100 my-1" />
                  )}

                  {/* Indirizzo → Google Maps */}
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <MapPin size={18} className="mr-3 mt-0.5 text-primary-blue flex-shrink-0" />
                    <span className="text-sm text-gray-700 flex-1">{fullAddress}</span>
                  </a>
                </div>
              </div>
            );
          })}

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
