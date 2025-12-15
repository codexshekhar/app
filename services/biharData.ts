import { SoilType } from '../types';

interface BlockData {
  lat: number;
  lon: number;
}

interface DistrictData {
  defaultSoil: SoilType;
  blocks: Record<string, BlockData>;
}

// Complete list of 38 Districts in Bihar with major blocks/coordinates.
export const BIHAR_DATA: Record<string, DistrictData> = {
  "Araria": {
    defaultSoil: SoilType.ALLUVIAL,
    blocks: {
      "Araria Sadar": { lat: 26.15, lon: 87.51 },
      "Forbesganj": { lat: 26.30, lon: 87.26 },
      "Jokihat": { lat: 26.13, lon: 87.61 },
      "Raniganj": { lat: 26.08, lon: 87.35 },
      "Narpatganj": { lat: 26.38, lon: 87.43 }
    }
  },
  "Arwal": {
    defaultSoil: SoilType.CLAY,
    blocks: {
      "Arwal Sadar": { lat: 25.24, lon: 84.67 },
      "Karpi": { lat: 25.20, lon: 84.75 },
      "Kurtha": { lat: 25.22, lon: 84.82 },
      "Kaler": { lat: 25.18, lon: 84.58 }
    }
  },
  "Aurangabad": {
    defaultSoil: SoilType.CLAY,
    blocks: {
      "Aurangabad Sadar": { lat: 24.75, lon: 84.37 },
      "Daudnagar": { lat: 25.03, lon: 84.40 },
      "Barun": { lat: 24.84, lon: 84.22 },
      "Rafiganj": { lat: 24.81, lon: 84.64 },
      "Obra": { lat: 24.97, lon: 84.38 }
    }
  },
  "Banka": {
    defaultSoil: SoilType.SANDY_LOAM,
    blocks: {
      "Banka Sadar": { lat: 24.88, lon: 86.92 },
      "Amarpur": { lat: 25.03, lon: 86.90 },
      "Katoriya": { lat: 24.63, lon: 86.72 },
      "Belhar": { lat: 24.93, lon: 86.60 },
      "Chandan": { lat: 24.58, lon: 86.68 },
      "Bounsi": { lat: 24.80, lon: 87.02 }
    }
  },
  "Begusarai": {
    defaultSoil: SoilType.ALLUVIAL,
    blocks: {
      "Begusarai Sadar": { lat: 25.41, lon: 86.13 },
      "Barauni": { lat: 25.45, lon: 86.00 },
      "Teghra": { lat: 25.48, lon: 85.95 },
      "Bakhri": { lat: 25.56, lon: 86.23 },
      "Cheria Bariarpur": { lat: 25.65, lon: 86.18 }
    }
  },
  "Bhagalpur": {
    defaultSoil: SoilType.LOAM,
    blocks: {
      "Bhagalpur Sadar": { lat: 25.24, lon: 87.01 },
      "Sultanganj": { lat: 25.29, lon: 86.73 },
      "Kahalgon": { lat: 25.26, lon: 87.24 },
      "Pirpainti": { lat: 25.31, lon: 87.42 },
      "Naugachhia": { lat: 25.38, lon: 87.09 },
      "Bihpur": { lat: 25.43, lon: 86.97 }
    }
  },
  "Bhojpur": {
    defaultSoil: SoilType.ALLUVIAL,
    blocks: {
      "Ara Sadar": { lat: 25.55, lon: 84.66 },
      "Bihiya": { lat: 25.54, lon: 84.46 },
      "Jagdishpur": { lat: 25.47, lon: 84.42 },
      "Piro": { lat: 25.33, lon: 84.41 },
      "Shahpur": { lat: 25.62, lon: 84.48 }
    }
  },
  "Buxar": {
    defaultSoil: SoilType.ALLUVIAL,
    blocks: {
      "Buxar Sadar": { lat: 25.56, lon: 83.97 },
      "Dumraon": { lat: 25.55, lon: 84.15 },
      "Rajpur": { lat: 25.43, lon: 83.95 },
      "Brahmpur": { lat: 25.61, lon: 84.30 },
      "Nawanagar": { lat: 25.38, lon: 84.22 }
    }
  },
  "Darbhanga": {
    defaultSoil: SoilType.ALLUVIAL,
    blocks: {
      "Darbhanga Sadar": { lat: 26.15, lon: 85.89 },
      "Benipur": { lat: 26.06, lon: 86.08 },
      "Jale": { lat: 26.29, lon: 85.73 },
      "Keoti": { lat: 26.21, lon: 85.85 },
      "Manigachhi": { lat: 26.22, lon: 86.18 }
    }
  },
  "East Champaran": {
    defaultSoil: SoilType.ALLUVIAL,
    blocks: {
      "Motihari": { lat: 26.64, lon: 84.91 },
      "Raxaul": { lat: 26.97, lon: 84.84 },
      "Areraj": { lat: 26.55, lon: 84.66 },
      "Dhaka": { lat: 26.67, lon: 85.17 },
      "Kesaria": { lat: 26.35, lon: 84.87 }
    }
  },
  "Gaya": {
    defaultSoil: SoilType.RED_YELLOW,
    blocks: {
      "Gaya Town": { lat: 24.79, lon: 85.00 },
      "Bodh Gaya": { lat: 24.69, lon: 84.99 },
      "Manpur": { lat: 24.78, lon: 85.03 },
      "Sherghati": { lat: 24.56, lon: 84.79 },
      "Tekari": { lat: 24.93, lon: 84.83 },
      "Belaganj": { lat: 25.01, lon: 84.98 }
    }
  },
  "Gopalganj": {
    defaultSoil: SoilType.ALLUVIAL,
    blocks: {
      "Gopalganj Sadar": { lat: 26.47, lon: 84.44 },
      "Barauli": { lat: 26.40, lon: 84.58 },
      "Hathua": { lat: 26.35, lon: 84.30 },
      "Kuchaikote": { lat: 26.54, lon: 84.36 },
      "Bhorey": { lat: 26.44, lon: 84.11 }
    }
  },
  "Jamui": {
    defaultSoil: SoilType.SANDY_LOAM,
    blocks: {
      "Jamui Sadar": { lat: 24.92, lon: 86.22 },
      "Jhajha": { lat: 24.77, lon: 86.37 },
      "Sono": { lat: 24.66, lon: 86.33 },
      "Sikandra": { lat: 24.97, lon: 86.04 },
      "Khaira": { lat: 24.87, lon: 86.13 }
    }
  },
  "Jehanabad": {
    defaultSoil: SoilType.CLAY,
    blocks: {
      "Jehanabad Sadar": { lat: 25.15, lon: 84.98 },
      "Makhdumpur": { lat: 25.08, lon: 85.00 },
      "Kako": { lat: 25.13, lon: 85.08 },
      "Ghoshi": { lat: 25.12, lon: 85.17 }
    }
  },
  "Kaimur": {
    defaultSoil: SoilType.RED_YELLOW,
    blocks: {
      "Bhabua": { lat: 25.04, lon: 83.61 },
      "Mohania": { lat: 25.17, lon: 83.62 },
      "Ramgarh": { lat: 25.32, lon: 83.66 },
      "Chainpur": { lat: 25.03, lon: 83.50 },
      "Adhaura": { lat: 24.69, lon: 83.62 }
    }
  },
  "Katihar": {
    defaultSoil: SoilType.ALLUVIAL,
    blocks: {
      "Katihar Sadar": { lat: 25.54, lon: 87.57 },
      "Manihari": { lat: 25.33, lon: 87.62 },
      "Barsoi": { lat: 25.68, lon: 87.90 },
      "Korha": { lat: 25.57, lon: 87.42 },
      "Kadwa": { lat: 25.55, lon: 87.75 }
    }
  },
  "Khagaria": {
    defaultSoil: SoilType.ALLUVIAL,
    blocks: {
      "Khagaria Sadar": { lat: 25.50, lon: 86.48 },
      "Gogri": { lat: 25.43, lon: 86.58 },
      "Mansi": { lat: 25.55, lon: 86.57 },
      "Parbatta": { lat: 25.38, lon: 86.72 },
      "Alauli": { lat: 25.65, lon: 86.37 }
    }
  },
  "Kishanganj": {
    defaultSoil: SoilType.ALLUVIAL,
    blocks: {
      "Kishanganj Sadar": { lat: 26.10, lon: 87.94 },
      "Bahadurganj": { lat: 26.24, lon: 87.82 },
      "Thakurganj": { lat: 26.44, lon: 88.13 },
      "Kochadhaman": { lat: 26.04, lon: 87.82 }
    }
  },
  "Lakhisarai": {
    defaultSoil: SoilType.CLAY,
    blocks: {
      "Lakhisarai Sadar": { lat: 25.17, lon: 86.09 },
      "Barahiya": { lat: 25.29, lon: 86.03 },
      "Suryagarha": { lat: 25.23, lon: 86.23 },
      "Halsi": { lat: 25.07, lon: 86.08 }
    }
  },
  "Madhepura": {
    defaultSoil: SoilType.ALLUVIAL,
    blocks: {
      "Madhepura Sadar": { lat: 25.92, lon: 86.79 },
      "Murliganj": { lat: 25.89, lon: 86.99 },
      "Singheshwar": { lat: 25.99, lon: 86.79 },
      "Uda Kishanganj": { lat: 25.69, lon: 86.93 }
    }
  },
  "Madhubani": {
    defaultSoil: SoilType.ALLUVIAL,
    blocks: {
      "Madhubani Sadar": { lat: 26.34, lon: 86.07 },
      "Jhanjharpur": { lat: 26.26, lon: 86.28 },
      "Benipatti": { lat: 26.45, lon: 85.90 },
      "Jainagar": { lat: 26.58, lon: 86.13 },
      "Rajnagar": { lat: 26.40, lon: 86.18 }
    }
  },
  "Munger": {
    defaultSoil: SoilType.LOAM,
    blocks: {
      "Munger Sadar": { lat: 25.37, lon: 86.47 },
      "Jamalpur": { lat: 25.31, lon: 86.49 },
      "Tarapur": { lat: 25.13, lon: 86.63 },
      "Kharagpur": { lat: 25.12, lon: 86.55 }
    }
  },
  "Muzaffarpur": {
    defaultSoil: SoilType.ALLUVIAL,
    blocks: {
      "Muzaffarpur Sadar": { lat: 26.12, lon: 85.39 },
      "Kanti": { lat: 26.20, lon: 85.29 },
      "Motipur": { lat: 26.26, lon: 85.19 },
      "Sakra": { lat: 26.04, lon: 85.50 },
      "Bochahan": { lat: 26.15, lon: 85.45 },
      "Paroo": { lat: 26.06, lon: 85.07 }
    }
  },
  "Nalanda": {
    defaultSoil: SoilType.CLAY,
    blocks: {
      "Bihar Sharif": { lat: 25.19, lon: 85.51 },
      "Rajgir": { lat: 25.02, lon: 85.41 },
      "Harnaut": { lat: 25.36, lon: 85.53 },
      "Islampur": { lat: 25.14, lon: 85.20 },
      "Hilsa": { lat: 25.31, lon: 85.27 },
      "Asthawan": { lat: 25.21, lon: 85.62 }
    }
  },
  "Nawada": {
    defaultSoil: SoilType.SANDY_LOAM,
    blocks: {
      "Nawada Sadar": { lat: 24.88, lon: 85.53 },
      "Rajauli": { lat: 24.65, lon: 85.49 },
      "Hisua": { lat: 24.90, lon: 85.41 },
      "Warisaliganj": { lat: 25.01, lon: 85.62 },
      "Pakribarawan": { lat: 24.97, lon: 85.74 }
    }
  },
  "Patna": {
    defaultSoil: SoilType.ALLUVIAL,
    blocks: {
      "Patna Sadar": { lat: 25.61, lon: 85.13 },
      "Danapur": { lat: 25.62, lon: 85.04 },
      "Phulwari Sharif": { lat: 25.57, lon: 85.07 },
      "Bihta": { lat: 25.56, lon: 84.87 },
      "Masaurhi": { lat: 25.35, lon: 85.03 },
      "Barh": { lat: 25.48, lon: 85.71 },
      "Bakhtiyarpur": { lat: 25.46, lon: 85.52 }
    }
  },
  "Purnia": {
    defaultSoil: SoilType.ALLUVIAL,
    blocks: {
      "Purnia East": { lat: 25.77, lon: 87.47 },
      "Kasba": { lat: 25.85, lon: 87.52 },
      "Banmankhi": { lat: 25.88, lon: 87.16 },
      "Dhamdaha": { lat: 25.71, lon: 87.19 },
      "Rupauli": { lat: 25.55, lon: 87.18 }
    }
  },
  "Rohtas": {
    defaultSoil: SoilType.CLAY,
    blocks: {
      "Sasaram": { lat: 24.95, lon: 84.01 },
      "Dehri": { lat: 24.91, lon: 84.18 },
      "Bikramganj": { lat: 25.20, lon: 84.24 },
      "Nokha": { lat: 25.10, lon: 84.13 },
      "Chenari": { lat: 24.91, lon: 83.84 }
    }
  },
  "Saharsa": {
    defaultSoil: SoilType.ALLUVIAL,
    blocks: {
      "Saharsa Sadar": { lat: 25.88, lon: 86.60 },
      "Simri Bakhtiyarpur": { lat: 25.80, lon: 86.67 },
      "Kahra": { lat: 25.89, lon: 86.58 },
      "Sonbarsa": { lat: 25.73, lon: 86.78 }
    }
  },
  "Samastipur": {
    defaultSoil: SoilType.ALLUVIAL,
    blocks: {
      "Samastipur Sadar": { lat: 25.86, lon: 85.78 },
      "Dalsinghsarai": { lat: 25.67, lon: 85.83 },
      "Rosera": { lat: 25.76, lon: 86.03 },
      "Pusa": { lat: 25.96, lon: 85.67 },
      "Mohiuddinagar": { lat: 25.58, lon: 85.73 }
    }
  },
  "Saran": {
    defaultSoil: SoilType.ALLUVIAL,
    blocks: {
      "Chapra": { lat: 25.77, lon: 84.73 },
      "Sonepur": { lat: 25.69, lon: 85.16 },
      "Revelganj": { lat: 25.78, lon: 84.66 },
      "Marhaura": { lat: 25.96, lon: 84.86 },
      "Dighwara": { lat: 25.73, lon: 85.00 }
    }
  },
  "Sheikhpura": {
    defaultSoil: SoilType.LOAM,
    blocks: {
      "Sheikhpura Sadar": { lat: 25.13, lon: 85.85 },
      "Barbigha": { lat: 25.22, lon: 85.73 },
      "Ariari": { lat: 25.07, lon: 85.87 }
    }
  },
  "Sheohar": {
    defaultSoil: SoilType.ALLUVIAL,
    blocks: {
      "Sheohar Sadar": { lat: 26.51, lon: 85.29 },
      "Piprarhi": { lat: 26.50, lon: 85.20 },
      "Tariyani": { lat: 26.46, lon: 85.34 }
    }
  },
  "Sitamarhi": {
    defaultSoil: SoilType.ALLUVIAL,
    blocks: {
      "Sitamarhi Sadar": { lat: 26.59, lon: 85.48 },
      "Dumra": { lat: 26.56, lon: 85.50 },
      "Belsand": { lat: 26.43, lon: 85.39 },
      "Pupri": { lat: 26.47, lon: 85.79 },
      "Runni Saidpur": { lat: 26.38, lon: 85.48 }
    }
  },
  "Siwan": {
    defaultSoil: SoilType.ALLUVIAL,
    blocks: {
      "Siwan Sadar": { lat: 26.22, lon: 84.36 },
      "Maharajganj": { lat: 26.10, lon: 84.50 },
      "Mairwa": { lat: 26.24, lon: 84.23 },
      "Darauli": { lat: 26.12, lon: 84.09 }
    }
  },
  "Supaul": {
    defaultSoil: SoilType.ALLUVIAL,
    blocks: {
      "Supaul Sadar": { lat: 26.12, lon: 86.59 },
      "Triveniganj": { lat: 26.25, lon: 86.83 },
      "Birpur": { lat: 26.52, lon: 87.01 },
      "Nirmali": { lat: 26.32, lon: 86.54 }
    }
  },
  "Vaishali": {
    defaultSoil: SoilType.ALLUVIAL,
    blocks: {
      "Hajipur": { lat: 25.68, lon: 85.21 },
      "Lalganj": { lat: 25.86, lon: 85.18 },
      "Mahua": { lat: 25.81, lon: 85.39 },
      "Mahnar": { lat: 25.66, lon: 85.47 },
      "Vaishali": { lat: 25.99, lon: 85.12 }
    }
  },
  "West Champaran": {
    defaultSoil: SoilType.ALLUVIAL,
    blocks: {
      "Bettiah": { lat: 26.80, lon: 84.50 },
      "Bagaha": { lat: 27.09, lon: 84.09 },
      "Narkatiaganj": { lat: 27.10, lon: 84.45 },
      "Ramnagar": { lat: 27.16, lon: 84.32 },
      "Chanpatia": { lat: 26.91, lon: 84.53 }
    }
  }
};