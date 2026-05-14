export interface KonsumerCenter {
  type: 'konsumer';
  id: string;
  region: string;
  city: string;
  province: string;
  name: string;
  address: string;
  cap: string;
  phone: string;
  phoneGreen: string;
  email: string;
}

export const konsumerCenters: KonsumerCenter[] = [
  {
    type: 'konsumer',
    id: 'konsumer-lazio-roma-1',
    region: 'LAZIO',
    city: 'ROMA',
    province: 'ROMA',
    name: 'Sportello "Non dipendo, scelgo!" – Konsumer Italia',
    address: 'Via Mamoiada, 16',
    cap: '00132',
    phone: '06 89020610',
    phoneGreen: '800 661 501',
    email: 'info@konsumer.it',
  },
  {
    type: 'konsumer',
    id: 'konsumer-lazio-roma-2',
    region: 'LAZIO',
    city: 'ROMA',
    province: 'ROMA',
    name: 'Sportello "Non dipendo, scelgo!" – Konsumer Italia',
    address: 'Viale della Primavera, 4 – int. 69',
    cap: '00172',
    phone: '06 89020610',
    phoneGreen: '800 661 501',
    email: 'info@konsumer.it',
  },
  {
    type: 'konsumer',
    id: 'konsumer-marche-civitanova',
    region: 'MARCHE',
    city: 'CIVITANOVA MARCHE',
    province: 'CIVITANOVA MARCHE',
    name: 'Sportello "Non dipendo, scelgo!" – Konsumer Italia',
    address: 'Via Vincenzo Breda, 18',
    cap: '62012',
    phone: '06 89020610',
    phoneGreen: '800 661 501',
    email: 'info@konsumer.it',
  },
  {
    type: 'konsumer',
    id: 'konsumer-molise-termoli',
    region: 'MOLISE',
    city: 'TERMOLI',
    province: 'CAMPOBASSO',
    name: 'Sportello "Non dipendo, scelgo!" – Konsumer Italia',
    address: 'Via Mario Pagano, 44',
    cap: '86039',
    phone: '06 89020610',
    phoneGreen: '800 661 501',
    email: 'info@konsumer.it',
  },
  {
    type: 'konsumer',
    id: 'konsumer-campania-napoli',
    region: 'CAMPANIA',
    city: 'NAPOLI',
    province: 'NAPOLI',
    name: 'Sportello "Non dipendo, scelgo!" – Konsumer Italia',
    address: 'Via Don Luigi Guanella, 20',
    cap: '80145',
    phone: '06 89020610',
    phoneGreen: '800 661 502',
    email: 'info@konsumer.it',
  },
  {
    type: 'konsumer',
    id: 'konsumer-liguria-recco',
    region: 'LIGURIA',
    city: 'RECCO',
    province: 'GENOVA',
    name: 'Sportello "Non dipendo, scelgo!" – Konsumer Italia',
    address: 'Via Filippo da Recco, 21',
    cap: '16026',
    phone: '06 89020610',
    phoneGreen: '800 661 503',
    email: 'info@konsumer.it',
  },
  {
    type: 'konsumer',
    id: 'konsumer-abruzzo-teramo',
    region: 'ABRUZZO',
    city: 'TERAMO',
    province: 'TERAMO',
    name: 'Sportello "Non dipendo, scelgo!" – Konsumer Italia',
    address: 'Strada Statale 81, nr. 83',
    cap: '64100',
    phone: '06 89020610',
    phoneGreen: '800 661 504',
    email: 'info@konsumer.it',
  },
  {
    type: 'konsumer',
    id: 'konsumer-lombardia-varese',
    region: 'LOMBARDIA',
    city: 'VARESE',
    province: 'VARESE',
    name: 'Sportello "Non dipendo, scelgo!" – Konsumer Italia',
    address: 'Via Valgan, 29',
    cap: '21100',
    phone: '06 89020610',
    phoneGreen: '800 661 505',
    email: 'info@konsumer.it',
  },
];
