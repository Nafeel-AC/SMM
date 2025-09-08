import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import { firebaseDb } from '../../lib/firebase-db';
import './RequirementsFormPage.css';

const RequirementsFormPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    niche: [''], // max 5
    location: [''], // max 3 - now stores as "Country, State" or "Country"
    comments: [''], // max 5
    dms: [''], // max 3
    max_following: '',
    hashtags: [''], // max 10
    account_targets: [''] // max 5
  });
  const [locationSelections, setLocationSelections] = useState([{ country: '', state: '' }]);
  const { user, fetchUserProfile } = useFirebaseAuth();
  const navigate = useNavigate();

  const nicheOptions = [
    'Fashion & Beauty',
    'Fitness & Health',
    'Food & Cooking',
    'Travel & Lifestyle',
    'Technology',
    'Business & Entrepreneurship',
    'Education',
    'Entertainment',
    'Art & Design',
    'Sports',
    'Gaming',
    'Parenting',
    'Pets & Animals',
    'Home & Garden',
    'Automotive',
    'Finance',
    'Real Estate',
    'Other'
  ];

  // Country and State/Province data
  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
    'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
    'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
    'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
    'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador',
    'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
    'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
    'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
    'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea North', 'Korea South',
    'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein',
    'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania',
    'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar',
    'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia', 'Norway',
    'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
    'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe',
    'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
    'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan',
    'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
    'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela',
    'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
  ];

  const statesByCountry = {
    'United States': [
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
      'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
      'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
      'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
      'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
      'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
      'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ],
    'Canada': [
      'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
      'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island',
      'Quebec', 'Saskatchewan', 'Yukon'
    ],
    'Australia': [
      'Australian Capital Territory', 'New South Wales', 'Northern Territory', 'Queensland',
      'South Australia', 'Tasmania', 'Victoria', 'Western Australia'
    ],
    'United Kingdom': [
      'England', 'Scotland', 'Wales', 'Northern Ireland'
    ],
    'India': [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
      'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
      'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
      'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
      'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry'
    ],
    'Germany': [
      'Baden-Württemberg', 'Bavaria', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg', 'Hesse',
      'Lower Saxony', 'Mecklenburg-Vorpommern', 'North Rhine-Westphalia', 'Rhineland-Palatinate',
      'Saarland', 'Saxony', 'Saxony-Anhalt', 'Schleswig-Holstein', 'Thuringia'
    ],
    'France': [
      'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Brittany', 'Centre-Val de Loire',
      'Corsica', 'Grand Est', 'Hauts-de-France', 'Île-de-France', 'Normandy', 'Nouvelle-Aquitaine',
      'Occitanie', 'Pays de la Loire', 'Provence-Alpes-Côte d\'Azur'
    ],
    'Italy': [
      'Abruzzo', 'Aosta Valley', 'Apulia', 'Basilicata', 'Calabria', 'Campania', 'Emilia-Romagna',
      'Friuli-Venezia Giulia', 'Lazio', 'Liguria', 'Lombardy', 'Marche', 'Molise', 'Piedmont',
      'Sardinia', 'Sicily', 'South Tyrol', 'Trentino', 'Tuscany', 'Umbria', 'Veneto'
    ],
    'Spain': [
      'Andalusia', 'Aragon', 'Asturias', 'Balearic Islands', 'Basque Country', 'Canary Islands',
      'Cantabria', 'Castile and León', 'Castile-La Mancha', 'Catalonia', 'Ceuta', 'Extremadura',
      'Galicia', 'La Rioja', 'Madrid', 'Melilla', 'Murcia', 'Navarre', 'Valencia'
    ],
    'Japan': [
      'Hokkaido', 'Aomori', 'Iwate', 'Miyagi', 'Akita', 'Yamagata', 'Fukushima', 'Ibaraki',
      'Tochigi', 'Gunma', 'Saitama', 'Chiba', 'Tokyo', 'Kanagawa', 'Niigata', 'Toyama',
      'Ishikawa', 'Fukui', 'Yamanashi', 'Nagano', 'Gifu', 'Shizuoka', 'Aichi', 'Mie',
      'Shiga', 'Kyoto', 'Osaka', 'Hyogo', 'Nara', 'Wakayama', 'Tottori', 'Shimane',
      'Okayama', 'Hiroshima', 'Yamaguchi', 'Tokushima', 'Kagawa', 'Ehime', 'Kochi',
      'Fukuoka', 'Saga', 'Nagasaki', 'Kumamoto', 'Oita', 'Miyazaki', 'Kagoshima', 'Okinawa'
    ],
    'Brazil': [
      'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal', 'Espírito Santo',
      'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará', 'Paraíba',
      'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul',
      'Rondônia', 'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
    ],
    'Mexico': [
      'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 'Chihuahua',
      'Coahuila', 'Colima', 'Durango', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'Mexico City',
      'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo',
      'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
    ],
    'Argentina': [
      'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes', 'Entre Ríos',
      'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro',
      'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego',
      'Tucumán'
    ],
    'China': [
      'Anhui', 'Beijing', 'Chongqing', 'Fujian', 'Gansu', 'Guangdong', 'Guangxi', 'Guizhou',
      'Hainan', 'Hebei', 'Heilongjiang', 'Henan', 'Hong Kong', 'Hubei', 'Hunan', 'Inner Mongolia',
      'Jiangsu', 'Jiangxi', 'Jilin', 'Liaoning', 'Macau', 'Ningxia', 'Qinghai', 'Shaanxi',
      'Shandong', 'Shanghai', 'Shanxi', 'Sichuan', 'Tianjin', 'Tibet', 'Xinjiang', 'Yunnan', 'Zhejiang'
    ],
    'Russia': [
      'Adygea', 'Altai', 'Altai Krai', 'Amur', 'Arkhangelsk', 'Astrakhan', 'Bashkortostan', 'Belgorod',
      'Bryansk', 'Buryatia', 'Chechnya', 'Chelyabinsk', 'Chukotka', 'Chuvashia', 'Dagestan', 'Ingushetia',
      'Irkutsk', 'Ivanovo', 'Jewish Autonomous Oblast', 'Kabardino-Balkaria', 'Kaliningrad', 'Kalmykia',
      'Kaluga', 'Kamchatka', 'Karachay-Cherkessia', 'Karelia', 'Kemerovo', 'Khabarovsk', 'Khakassia',
      'Khanty-Mansi', 'Kirov', 'Komi', 'Kostroma', 'Krasnodar', 'Krasnoyarsk', 'Kurgan', 'Kursk',
      'Leningrad', 'Lipetsk', 'Magadan', 'Mari El', 'Mordovia', 'Moscow', 'Moscow Oblast', 'Murmansk',
      'Nenets', 'Nizhny Novgorod', 'North Ossetia', 'Novgorod', 'Novosibirsk', 'Omsk', 'Orenburg',
      'Oryol', 'Penza', 'Perm', 'Primorsky', 'Pskov', 'Rostov', 'Ryazan', 'Sakha', 'Sakhalin',
      'Samara', 'Saratov', 'Smolensk', 'Stavropol', 'Sverdlovsk', 'Tambov', 'Tatarstan', 'Tomsk',
      'Tula', 'Tver', 'Tyumen', 'Udmurtia', 'Ulyanovsk', 'Vladimir', 'Volgograd', 'Vologda',
      'Voronezh', 'Yamalo-Nenets', 'Yaroslavl', 'Zabaykalsky'
    ],
    'South Africa': [
      'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga',
      'North West', 'Northern Cape', 'Western Cape'
    ],
    'Nigeria': [
      'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
      'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Federal Capital Territory',
      'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
      'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
      'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
    ],
    'Pakistan': [
      'Azad Jammu and Kashmir', 'Balochistan', 'Gilgit-Baltistan', 'Islamabad', 'Khyber Pakhtunkhwa',
      'Punjab', 'Sindh'
    ],
    'Bangladesh': [
      'Barisal', 'Chittagong', 'Dhaka', 'Khulna', 'Rajshahi', 'Rangpur', 'Sylhet'
    ],
    'Turkey': [
      'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya',
      'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik',
      'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum',
      'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir',
      'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul',
      'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale',
      'Kırklareli', 'Kırşehir', 'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa',
      'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize',
      'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Şanlıurfa', 'Şırnak', 'Tekirdağ',
      'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
    ],
    'Egypt': [
      'Alexandria', 'Aswan', 'Asyut', 'Beheira', 'Beni Suef', 'Cairo', 'Dakahlia', 'Damietta',
      'Faiyum', 'Gharbia', 'Giza', 'Ismailia', 'Kafr el-Sheikh', 'Luxor', 'Matruh', 'Minya',
      'Monufia', 'New Valley', 'North Sinai', 'Port Said', 'Qalyubia', 'Qena', 'Red Sea',
      'Sharqia', 'Sohag', 'South Sinai', 'Suez'
    ],
    'Saudi Arabia': [
      'Al Bahah', 'Northern Borders', 'Al Jawf', 'Al Madinah', 'Al Qasim', 'Eastern Province',
      'Asir', 'Hail', 'Jizan', 'Makkah', 'Najran', 'Riyadh', 'Tabuk'
    ],
    'United Arab Emirates': [
      'Abu Dhabi', 'Ajman', 'Dubai', 'Fujairah', 'Ras al-Khaimah', 'Sharjah', 'Umm al-Quwain'
    ],
    'Indonesia': [
      'Aceh', 'Bali', 'Bangka Belitung', 'Banten', 'Bengkulu', 'Central Java', 'Central Kalimantan',
      'Central Sulawesi', 'East Java', 'East Kalimantan', 'East Nusa Tenggara', 'Gorontalo',
      'Jakarta', 'Jambi', 'Lampung', 'Maluku', 'North Kalimantan', 'North Maluku', 'North Sulawesi',
      'North Sumatra', 'Papua', 'Riau', 'Riau Islands', 'South East Sulawesi', 'South Kalimantan',
      'South Sulawesi', 'South Sumatra', 'West Java', 'West Kalimantan', 'West Nusa Tenggara',
      'West Papua', 'West Sulawesi', 'West Sumatra', 'Yogyakarta'
    ],
    'Thailand': [
      'Amnat Charoen', 'Ang Thong', 'Bangkok', 'Bueng Kan', 'Buri Ram', 'Chachoengsao', 'Chai Nat',
      'Chaiyaphum', 'Chanthaburi', 'Chiang Mai', 'Chiang Rai', 'Chonburi', 'Chumphon', 'Kalasin',
      'Kamphaeng Phet', 'Kanchanaburi', 'Khon Kaen', 'Krabi', 'Lampang', 'Lamphun', 'Loei',
      'Lopburi', 'Mae Hong Son', 'Maha Sarakham', 'Mukdahan', 'Nakhon Nayok', 'Nakhon Pathom',
      'Nakhon Phanom', 'Nakhon Ratchasima', 'Nakhon Sawan', 'Nakhon Si Thammarat', 'Nan', 'Narathiwat',
      'Nong Bua Lamphu', 'Nong Khai', 'Nonthaburi', 'Pathum Thani', 'Pattani', 'Phang Nga', 'Phatthalung',
      'Phayao', 'Phetchabun', 'Phetchaburi', 'Phichit', 'Phitsanulok', 'Phra Nakhon Si Ayutthaya',
      'Phrae', 'Phuket', 'Prachinburi', 'Prachuap Khiri Khan', 'Ranong', 'Ratchaburi', 'Rayong',
      'Roi Et', 'Sa Kaeo', 'Sakon Nakhon', 'Samut Prakan', 'Samut Sakhon', 'Samut Songkhram',
      'Saraburi', 'Satun', 'Sing Buri', 'Sisaket', 'Songkhla', 'Sukhothai', 'Suphan Buri',
      'Surat Thani', 'Surin', 'Tak', 'Trang', 'Trat', 'Ubon Ratchathani', 'Udon Thani', 'Uthai Thani',
      'Uttaradit', 'Yala', 'Yasothon'
    ],
    'Malaysia': [
      'Johor', 'Kedah', 'Kelantan', 'Kuala Lumpur', 'Labuan', 'Melaka', 'Negeri Sembilan',
      'Pahang', 'Penang', 'Perak', 'Perlis', 'Putrajaya', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu'
    ],
    'Philippines': [
      'Abra', 'Agusan del Norte', 'Agusan del Sur', 'Aklan', 'Albay', 'Antique', 'Apayao', 'Aurora',
      'Basilan', 'Bataan', 'Batanes', 'Batangas', 'Benguet', 'Biliran', 'Bohol', 'Bukidnon',
      'Bulacan', 'Cagayan', 'Camarines Norte', 'Camarines Sur', 'Camiguin', 'Capiz', 'Catanduanes',
      'Cavite', 'Cebu', 'Compostela Valley', 'Cotabato', 'Davao del Norte', 'Davao del Sur',
      'Davao Occidental', 'Davao Oriental', 'Dinagat Islands', 'Eastern Samar', 'Guimaras', 'Ifugao',
      'Ilocos Norte', 'Ilocos Sur', 'Iloilo', 'Isabela', 'Kalinga', 'La Union', 'Laguna', 'Lanao del Norte',
      'Lanao del Sur', 'Leyte', 'Maguindanao', 'Marinduque', 'Masbate', 'Metro Manila', 'Misamis Occidental',
      'Misamis Oriental', 'Mountain Province', 'Negros Occidental', 'Negros Oriental', 'Northern Samar',
      'Nueva Ecija', 'Nueva Vizcaya', 'Occidental Mindoro', 'Oriental Mindoro', 'Palawan', 'Pampanga',
      'Pangasinan', 'Quezon', 'Quirino', 'Rizal', 'Romblon', 'Samar', 'Sarangani', 'Siquijor',
      'Sorsogon', 'South Cotabato', 'Southern Leyte', 'Sultan Kudarat', 'Sulu', 'Surigao del Norte',
      'Surigao del Sur', 'Tarlac', 'Tawi-Tawi', 'Zambales', 'Zamboanga del Norte', 'Zamboanga del Sur',
      'Zamboanga Sibugay'
    ],
    'Vietnam': [
      'An Giang', 'Ba Ria-Vung Tau', 'Bac Giang', 'Bac Kan', 'Bac Lieu', 'Bac Ninh', 'Ben Tre',
      'Binh Dinh', 'Binh Duong', 'Binh Phuoc', 'Binh Thuan', 'Ca Mau', 'Can Tho', 'Cao Bang',
      'Da Nang', 'Dak Lak', 'Dak Nong', 'Dien Bien', 'Dong Nai', 'Dong Thap', 'Gia Lai', 'Ha Giang',
      'Ha Nam', 'Ha Noi', 'Ha Tinh', 'Hai Duong', 'Hai Phong', 'Hau Giang', 'Hoa Binh', 'Hung Yen',
      'Khanh Hoa', 'Kien Giang', 'Kon Tum', 'Lai Chau', 'Lam Dong', 'Lang Son', 'Lao Cai', 'Long An',
      'Nam Dinh', 'Nghe An', 'Ninh Binh', 'Ninh Thuan', 'Phu Tho', 'Phu Yen', 'Quang Binh', 'Quang Nam',
      'Quang Ngai', 'Quang Ninh', 'Quang Tri', 'Soc Trang', 'Son La', 'Tay Ninh', 'Thai Binh',
      'Thai Nguyen', 'Thanh Hoa', 'Thua Thien-Hue', 'Tien Giang', 'Tra Vinh', 'Tuyen Quang', 'Vinh Long',
      'Vinh Phuc', 'Yen Bai'
    ]
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // For array fields
  // Usage: handleArrayChange('niche', idx, value)
  const handleArrayChange = (field, idx, value) => {
    setFormData(prev => {
      const arr = [...prev[field]];
      arr[idx] = value;
      return { ...prev, [field]: arr };
    });
  };

  // Add item to array field
  const handleAddItem = (field, max) => {
    setFormData(prev => {
      if (prev[field].length < max) {
        return { ...prev, [field]: [...prev[field], ''] };
      }
      return prev;
    });
  };

  // Remove item from array field
  const handleRemoveItem = (field, idx) => {
    setFormData(prev => {
      const arr = [...prev[field]];
      arr.splice(idx, 1);
      return { ...prev, [field]: arr.length ? arr : [''] };
    });
  };

  // Handle location selection changes
  const handleLocationChange = (idx, field, value) => {
    const newSelections = [...locationSelections];
    if (!newSelections[idx]) {
      newSelections[idx] = { country: '', state: '' };
    }
    newSelections[idx][field] = value;
    
    // Update form data with formatted location
    const country = newSelections[idx].country;
    const state = newSelections[idx].state;
    const formattedLocation = state && state !== '' ? `${country}, ${state}` : country;
    
    setFormData(prev => {
      const arr = [...prev.location];
      arr[idx] = formattedLocation;
      return { ...prev, location: arr };
    });
    
    setLocationSelections(newSelections);
  };

  // Add location item
  const handleAddLocation = () => {
    if (locationSelections.length < 3) {
      setLocationSelections(prev => [...prev, { country: '', state: '' }]);
      setFormData(prev => ({
        ...prev,
        location: [...prev.location, '']
      }));
    }
  };

  // Remove location item
  const handleRemoveLocation = (idx) => {
    const newSelections = [...locationSelections];
    newSelections.splice(idx, 1);
    setLocationSelections(newSelections.length ? newSelections : [{ country: '', state: '' }]);
    
    setFormData(prev => {
      const arr = [...prev.location];
      arr.splice(idx, 1);
      return { ...prev, location: arr.length ? arr : [''] };
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log('🚀 Form submission started');
    console.log('👤 User:', user);
    console.log('📝 Form data:', formData);

    // Validate required fields
    const requiredArrays = [
      { field: 'niche', max: 5 },
      { field: 'location', max: 3 },
      { field: 'comments', max: 5 },
      { field: 'dms', max: 3 },
      { field: 'hashtags', max: 10 },
      { field: 'account_targets', max: 5 }
    ];
    for (const { field, max } of requiredArrays) {
      if (!formData[field] || !formData[field].length || formData[field].some(v => !v.trim())) {
        alert(`Please fill in all required fields for ${field}.`);
        setLoading(false);
        return;
      }
      if (formData[field].length > max) {
        alert(`Maximum allowed for ${field} is ${max}.`);
        setLoading(false);
        return;
      }
    }
    if (!formData.max_following) {
      alert('Please fill in max following.');
      setLoading(false);
      return;
    }

    // Check if user is authenticated
    if (!user || !user.uid) {
      alert('You must be logged in to submit requirements.');
      setLoading(false);
      return;
    }

    try {
      console.log('💾 Attempting to save to database...');
      
      // Prepare data for insertion
      const insertData = {
        user_id: user.uid,
        niche: formData.niche,
        location: formData.location,
        comments: formData.comments,
        dms: formData.dms,
        max_following: formData.max_following ? parseInt(formData.max_following) : null,
        hashtags: formData.hashtags,
        account_targets: formData.account_targets
      };

      console.log('📦 Data to insert:', insertData);

      // Save requirements to database
      const result = await firebaseDb.saveUserRequirements(insertData);

      if (result.error) {
        console.error('❌ Database error:', result.error);
        throw result.error;
      }

      console.log('✅ Requirements saved successfully:', result.data);
      
      // Update user profile to mark requirements as completed
      console.log('🔄 Updating user profile...');
      const profileResult = await firebaseDb.updateProfile(user.uid, { requirements_completed: true });

      if (profileResult.error) {
        console.error('⚠️ Warning: Could not update profile:', profileResult.error);
      } else {
        console.log('✅ Profile updated successfully');
        // Reload profile context
        if (fetchUserProfile && typeof fetchUserProfile === 'function') {
          console.log('🔄 Reloading profile context...');
          await fetchUserProfile(user.uid);
        }
      }
      // Navigate to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('💥 Error submitting requirements:', error);
      
      // Show more specific error message
      let errorMessage = 'Failed to save requirements. Please try again.';
      
      if (error.message) {
        if (error.message.includes('duplicate key')) {
          errorMessage = 'You have already submitted requirements. Please contact support if you need to update them.';
        } else if (error.message.includes('permission denied')) {
          errorMessage = 'Permission denied. Please make sure you are logged in.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="requirements-form-page">
      <div className="form-container">
        <div className="form-header">
          <h1>Niche Data Collection</h1>
          <p>Help us understand your Instagram niche and targeting preferences for optimal growth strategy.</p>
        </div>

        <form onSubmit={handleSubmit} className="requirements-form">
          <div className="form-section">
            <h3>Niche Information</h3>
            <div className="form-group">
              <label>Niche (Target Audience) *</label>
              {formData.niche.map((item, idx) => (
                <div key={idx} className="form-item-container">
                  <input
                    type="text"
                    value={item}
                    onChange={e => handleArrayChange('niche', idx, e.target.value)}
                    placeholder="e.g., Fashion & Beauty, Fitness & Health, Food & Cooking"
                    required
                  />
                  {formData.niche.length > 1 && (
                    <button type="button" className="remove-item-btn" onClick={() => handleRemoveItem('niche', idx)}>Remove</button>
                  )}
                </div>
              ))}
              {formData.niche.length < 5 && (
                <button type="button" className="add-item-btn" onClick={() => handleAddItem('niche', 5)}>Add item</button>
              )}
            </div>
            <div className="form-group">
              <label>Location *</label>
              {locationSelections.map((selection, idx) => (
                <div key={idx} className="form-item-container location-container">
                  <div className="location-selects">
                    <select
                      value={selection.country}
                      onChange={e => handleLocationChange(idx, 'country', e.target.value)}
                      required
                      className="country-select"
                    >
                      <option value="">Select Country ({countries.length} available)</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                    
                    {selection.country && statesByCountry[selection.country] && (
                      <select
                        value={selection.state}
                        onChange={e => handleLocationChange(idx, 'state', e.target.value)}
                        className="state-select"
                      >
                        <option value="">Select State/Province (Optional)</option>
                        {statesByCountry[selection.country].map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  
                  {locationSelections.length > 1 && (
                    <button type="button" className="remove-item-btn" onClick={() => handleRemoveLocation(idx)}>Remove</button>
                  )}
                </div>
              ))}
              {locationSelections.length < 3 && (
                <button type="button" className="add-item-btn" onClick={handleAddLocation}>Add Location</button>
              )}
            </div>
          </div>
          <div className="form-section">
            <h3>Engagement Preferences</h3>
            <div className="form-group">
              <label>Comments (describe your comment strategy)</label>
              {formData.comments.map((item, idx) => (
                <div key={idx} className="form-item-container">
                  <textarea
                    value={item}
                    onChange={e => handleArrayChange('comments', idx, e.target.value)}
                    placeholder="e.g., Engage with fitness content, ask questions, share tips"
                    rows="2"
                  />
                  {formData.comments.length > 1 && (
                    <button type="button" className="remove-item-btn" onClick={() => handleRemoveItem('comments', idx)}>Remove</button>
                  )}
                </div>
              ))}
              {formData.comments.length < 5 && (
                <button type="button" className="add-item-btn" onClick={() => handleAddItem('comments', 5)}>Add item</button>
              )}
            </div>
            <div className="form-group">
              <label>DMs (describe your DM strategy)</label>
              {formData.dms.map((item, idx) => (
                <div key={idx} className="form-item-container">
                  <textarea
                    value={item}
                    onChange={e => handleArrayChange('dms', idx, e.target.value)}
                    placeholder="e.g., Send welcome messages, share exclusive content, build relationships"
                    rows="2"
                  />
                  {formData.dms.length > 1 && (
                    <button type="button" className="remove-item-btn" onClick={() => handleRemoveItem('dms', idx)}>Remove</button>
                  )}
                </div>
              ))}
              {formData.dms.length < 3 && (
                <button type="button" className="add-item-btn" onClick={() => handleAddItem('dms', 3)}>Add item</button>
              )}
            </div>
            <div className="form-group">
              <label>Max Following (numbers only) *</label>
              <input
                type="number"
                value={formData.max_following}
                onChange={e => handleInputChange('max_following', e.target.value)}
                placeholder="e.g., 5000"
                required
                min="0"
              />
            </div>
          </div>
          <div className="form-section">
            <h3>Content Strategy</h3>
            <div className="form-group">
              <label>Hashtags *</label>
              {formData.hashtags.map((item, idx) => (
                <div key={idx} className="form-item-container">
                  <input
                    type="text"
                    value={item}
                    onChange={e => handleArrayChange('hashtags', idx, e.target.value)}
                    placeholder="#fitness #health #lifestyle #motivation #workout"
                    required
                  />
                  {formData.hashtags.length > 1 && (
                    <button type="button" className="remove-item-btn" onClick={() => handleRemoveItem('hashtags', idx)}>Remove</button>
                  )}
                </div>
              ))}
              {formData.hashtags.length < 10 && (
                <button type="button" className="add-item-btn" onClick={() => handleAddItem('hashtags', 10)}>Add item</button>
              )}
            </div>
            <div className="form-group">
              <label>Account Targets *</label>
              {formData.account_targets.map((item, idx) => (
                <div key={idx} className="form-item-container">
                  <input
                    type="text"
                    value={item}
                    onChange={e => handleArrayChange('account_targets', idx, e.target.value)}
                    placeholder="@fitness_influencer1, @health_coach2, @lifestyle_blogger3"
                    required
                  />
                  {formData.account_targets.length > 1 && (
                    <button type="button" className="remove-item-btn" onClick={() => handleRemoveItem('account_targets', idx)}>Remove</button>
                  )}
                </div>
              ))}
              {formData.account_targets.length < 5 && (
                <button type="button" className="add-item-btn" onClick={() => handleAddItem('account_targets', 5)}>Add item</button>
              )}
            </div>
          </div>
          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Saving Niche Data...
                </>
              ) : (
                'Save Niche Data & Continue'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequirementsFormPage;
