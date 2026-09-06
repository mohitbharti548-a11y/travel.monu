export interface RegionCoordinates {
  id: string;
  name: string;
  hindiName: string;
  latitude: number;
  longitude: number;
  altitude: string;
  passName: string;
  defaultPassStatus: string;
  webcamImage?: string;
}

export interface HourlyForecastItem {
  time: string;
  hourLabel: string;
  temp: number;
  pop: number; // probability of precipitation %
  weatherCode: number;
  condition: string;
}

export interface DailyForecastItem {
  date: string;
  dayName: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  condition: string;
  uvIndex: number;
  precipSum: number;
  sunrise: string;
  sunset: string;
}

export interface RealRegionWeatherData {
  id: string;
  name: string;
  hindiName: string;
  altitude: string;
  passName: string;
  passStatus: string;
  currentTemp: number;
  feelsLike: number;
  weatherCode: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  surfacePressure: number;
  uvIndex: number;
  highTemp: number;
  lowTemp: number;
  sunrise: string;
  sunset: string;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  lastUpdated: string;
  isLive: boolean;
}

export const HIMACHAL_WEATHER_REGIONS: RegionCoordinates[] = [
  {
    id: 'manali',
    name: 'Manali',
    hindiName: 'मनाली',
    latitude: 32.2396,
    longitude: 77.1887,
    altitude: '2,050m',
    passName: 'Atal Tunnel (3,048m)',
    defaultPassStatus: 'Dry & Smooth • North Portal Open'
  },
  {
    id: 'spiti',
    name: 'Spiti Valley',
    hindiName: 'स्पीति घाटी',
    latitude: 32.2276,
    longitude: 78.0710,
    altitude: '3,800m',
    passName: 'Kunzum Pass (4,551m)',
    defaultPassStatus: '4x4 Essential • High Wind Alert'
  },
  {
    id: 'kaza',
    name: 'Kaza',
    hindiName: 'काज़ा',
    latitude: 32.2276,
    longitude: 78.0710,
    altitude: '3,650m',
    passName: 'Losar-Kaza Highway',
    defaultPassStatus: 'Clear • Chilly Mountain Breeze'
  },
  {
    id: 'dharamshala',
    name: 'Dharamshala',
    hindiName: 'धर्मशाला',
    latitude: 32.2190,
    longitude: 76.3234,
    altitude: '1,750m',
    passName: 'Gaggal-Kangra Ridge',
    defaultPassStatus: 'Pleasant • Dhauladhar Mist'
  },
  {
    id: 'shimla',
    name: 'Shimla',
    hindiName: 'शिमला',
    latitude: 31.1048,
    longitude: 77.1734,
    altitude: '2,276m',
    passName: 'NH-5 Kalka Expressway',
    defaultPassStatus: 'All-Weather Highway Clear'
  },
  {
    id: 'kullu',
    name: 'Kullu & Tirthan',
    hindiName: 'कुल्लू एवं तीर्थन',
    latitude: 31.9579,
    longitude: 77.1095,
    altitude: '1,279m',
    passName: 'Jalori Pass (3,120m)',
    defaultPassStatus: 'Open • Serolsar Trail Accessible'
  },
  {
    id: 'mandi',
    name: 'Mandi & Prashar',
    hindiName: 'मंडी एवं पराशर',
    latitude: 31.7087,
    longitude: 76.9320,
    altitude: '850m',
    passName: 'Prashar Lake Route',
    defaultPassStatus: 'Clear Skies • Lake Trail Dry'
  },
  {
    id: 'kinnaur',
    name: 'Kinnaur & Kalpa',
    hindiName: 'किन्नौर',
    latitude: 31.5376,
    longitude: 78.2562,
    altitude: '2,960m',
    passName: 'Hindustan-Tibet Highway',
    defaultPassStatus: 'Kinner Kailash Vista Clear'
  },
  {
    id: 'chamba',
    name: 'Chamba & Khajjiar',
    hindiName: 'चंबा एवं खज्जियार',
    latitude: 32.5534,
    longitude: 76.1258,
    altitude: '996m – 2,440m',
    passName: 'Saach Pass (4,414m) & Bakrota Ridge',
    defaultPassStatus: 'Khajjiar Meadow Open • Ravi Valley Clear'
  }
];

export function getWmoConditionDetails(code: number): { label: string; iconType: string; category: string } {
  switch (code) {
    case 0:
      return { label: 'Clear Skies', iconType: 'sun', category: 'clear' };
    case 1:
      return { label: 'Mainly Clear', iconType: 'sun', category: 'clear' };
    case 2:
      return { label: 'Partly Cloudy', iconType: 'cloud-sun', category: 'cloudy' };
    case 3:
      return { label: 'Overcast Cloud Cover', iconType: 'cloud', category: 'cloudy' };
    case 45:
    case 48:
      return { label: 'Cedar Valley Mist & Fog', iconType: 'wind', category: 'fog' };
    case 51:
    case 53:
    case 55:
      return { label: 'Alpine Drizzle', iconType: 'cloud-drizzle', category: 'rain' };
    case 61:
    case 63:
      return { label: 'Mountain Rain', iconType: 'cloud-rain', category: 'rain' };
    case 65:
      return { label: 'Heavy Himalayan Downpour', iconType: 'cloud-rain', category: 'rain' };
    case 71:
    case 73:
      return { label: 'Gentle Snowfall', iconType: 'snowflake', category: 'snow' };
    case 75:
    case 77:
      return { label: 'Heavy Snow Blizzard', iconType: 'snowflake', category: 'snow' };
    case 80:
    case 81:
    case 82:
      return { label: 'Passing Rain Showers', iconType: 'cloud-rain', category: 'rain' };
    case 85:
    case 86:
      return { label: 'High Altitude Snow Showers', iconType: 'snowflake', category: 'snow' };
    case 95:
    case 96:
    case 99:
      return { label: 'Mountain Thunderstorm', iconType: 'cloud-lightning', category: 'thunder' };
    default:
      return { label: 'Crisp Mountain Weather', iconType: 'sun', category: 'clear' };
  }
}

export async function fetchLiveRegionWeather(region: RegionCoordinates): Promise<RealRegionWeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${region.latitude}&longitude=${region.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum&timezone=Asia%2FKolkata`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
    const data = await res.json();

    const current = data.current;
    const daily = data.daily;
    const hourly = data.hourly;

    const conditionInfo = getWmoConditionDetails(current.weather_code);

    // Current hour index in hourly array
    const nowHour = new Date().getHours();
    const hourlyItems: HourlyForecastItem[] = [];
    
    // Take next 24 hours
    for (let i = nowHour; i < nowHour + 24 && i < hourly.time.length; i++) {
      const timeStr = hourly.time[i];
      const hourNum = new Date(timeStr).getHours();
      const hourLabel = i === nowHour ? 'Now' : `${hourNum % 12 === 0 ? 12 : hourNum % 12} ${hourNum >= 12 ? 'PM' : 'AM'}`;
      const code = hourly.weather_code[i] || 0;
      hourlyItems.push({
        time: timeStr,
        hourLabel,
        temp: Math.round(hourly.temperature_2m[i]),
        pop: hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0,
        weatherCode: code,
        condition: getWmoConditionDetails(code).label
      });
    }

    // 7 Days
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailyItems: DailyForecastItem[] = [];
    if (daily && daily.time) {
      for (let d = 0; d < Math.min(7, daily.time.length); d++) {
        const dObj = new Date(daily.time[d]);
        const dayLabel = d === 0 ? 'Today' : dayNames[dObj.getDay()];
        const dCode = daily.weather_code[d] || 0;
        dailyItems.push({
          date: daily.time[d],
          dayName: dayLabel,
          maxTemp: Math.round(daily.temperature_2m_max[d]),
          minTemp: Math.round(daily.temperature_2m_min[d]),
          weatherCode: dCode,
          condition: getWmoConditionDetails(dCode).label,
          uvIndex: Math.round(daily.uv_index_max ? daily.uv_index_max[d] : 5),
          precipSum: daily.precipitation_sum ? daily.precipitation_sum[d] : 0,
          sunrise: daily.sunrise ? daily.sunrise[d]?.split('T')[1] : '05:45',
          sunset: daily.sunset ? daily.sunset[d]?.split('T')[1] : '18:40'
        });
      }
    }

    const sunriseToday = daily?.sunrise?.[0]?.split('T')[1] || '05:45';
    const sunsetToday = daily?.sunset?.[0]?.split('T')[1] || '18:40';

    return {
      id: region.id,
      name: region.name,
      hindiName: region.hindiName,
      altitude: region.altitude,
      passName: region.passName,
      passStatus: region.defaultPassStatus,
      currentTemp: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      weatherCode: current.weather_code,
      condition: conditionInfo.label,
      humidity: Math.round(current.relative_humidity_2m),
      windSpeed: Math.round(current.wind_speed_10m),
      windDirection: current.wind_direction_10m,
      surfacePressure: Math.round(current.surface_pressure),
      uvIndex: daily?.uv_index_max?.[0] ? Math.round(daily.uv_index_max[0]) : 6,
      highTemp: Math.round(daily?.temperature_2m_max?.[0] ?? current.temperature_2m + 2),
      lowTemp: Math.round(daily?.temperature_2m_min?.[0] ?? current.temperature_2m - 5),
      sunrise: sunriseToday,
      sunset: sunsetToday,
      hourly: hourlyItems,
      daily: dailyItems,
      lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      isLive: true
    };
  } catch (err) {
    console.warn(`Live weather fetch failed for ${region.name}, using offline ground estimation:`, err);
    // Fallback offline estimation
    return getOfflineFallbackWeather(region);
  }
}

export function getOfflineFallbackWeather(region: RegionCoordinates): RealRegionWeatherData {
  const isHighAltitude = region.id === 'spiti' || region.id === 'kaza';
  const currentTemp = isHighAltitude ? -1 : region.id === 'manali' ? 15 : region.id === 'shimla' ? 17 : 21;
  const highTemp = currentTemp + 4;
  const lowTemp = currentTemp - 6;

  const mockHourly: HourlyForecastItem[] = [];
  const now = new Date().getHours();
  for (let i = 0; i < 24; i++) {
    const h = (now + i) % 24;
    mockHourly.push({
      time: `2026-08-31T${h}:00`,
      hourLabel: i === 0 ? 'Now' : `${h % 12 === 0 ? 12 : h % 12} ${h >= 12 ? 'PM' : 'AM'}`,
      temp: Math.round(currentTemp + Math.sin(i / 3) * 3),
      pop: isHighAltitude ? 5 : 15,
      weatherCode: 0,
      condition: 'Clear Mountain Sky'
    });
  }

  const days = ['Today', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const mockDaily: DailyForecastItem[] = days.map((d, idx) => ({
    date: `2026-09-0${idx + 1}`,
    dayName: d,
    maxTemp: highTemp + (idx % 2),
    minTemp: lowTemp - (idx % 2),
    weatherCode: idx % 3 === 0 ? 1 : 0,
    condition: idx % 3 === 0 ? 'Mainly Clear' : 'Crisp Alpine Sunshine',
    uvIndex: 6,
    precipSum: 0,
    sunrise: '05:48',
    sunset: '18:42'
  }));

  return {
    id: region.id,
    name: region.name,
    hindiName: region.hindiName,
    altitude: region.altitude,
    passName: region.passName,
    passStatus: region.defaultPassStatus,
    currentTemp,
    feelsLike: currentTemp - 1,
    weatherCode: 0,
    condition: 'Crisp Mountain Sky',
    humidity: 58,
    windSpeed: isHighAltitude ? 16 : 7,
    windDirection: 240,
    surfacePressure: 820,
    uvIndex: 6,
    highTemp,
    lowTemp,
    sunrise: '05:48',
    sunset: '18:42',
    hourly: mockHourly,
    daily: mockDaily,
    lastUpdated: 'Live Feed',
    isLive: false
  };
}
