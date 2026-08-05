import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SENTOB_LAT = 40.65;
const SENTOB_LON = 66.85;

type OpenWeatherOneCallResponse = {
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    weather: { id: number; main: string; description: string; icon: string }[];
  };
  daily: {
    dt: number;
    temp: { min: number; max: number };
    weather: { id: number; main: string; description: string; icon: string }[];
    pop: number;
  }[];
};

export async function GET() {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENWEATHER_API_KEY sozlanmagan. .env.local faylini tekshiring." },
      { status: 503 }
    );
  }

  try {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${SENTOB_LAT}&lon=${SENTOB_LON}&units=metric&lang=uz&exclude=minutely,hourly,alerts&appid=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 1800 } });

    if (!res.ok) {
      return NextResponse.json({ error: "OpenWeather so'rovi muvaffaqiyatsiz" }, { status: 502 });
    }

    const data: OpenWeatherOneCallResponse = await res.json();

    return NextResponse.json({
      current: {
        temp: Math.round(data.current.temp),
        feelsLike: Math.round(data.current.feels_like),
        humidity: data.current.humidity,
        windSpeed: Math.round(data.current.wind_speed),
        condition: data.current.weather[0]?.main ?? "",
        description: data.current.weather[0]?.description ?? "",
        icon: data.current.weather[0]?.icon ?? "01d",
      },
      daily: data.daily.slice(0, 7).map((d) => ({
        date: d.dt * 1000,
        min: Math.round(d.temp.min),
        max: Math.round(d.temp.max),
        condition: d.weather[0]?.main ?? "",
        icon: d.weather[0]?.icon ?? "01d",
        precipitation: Math.round(d.pop * 100),
      })),
    });
  } catch {
    return NextResponse.json({ error: "Ob-havo ma'lumotini olishda xatolik" }, { status: 500 });
  }
}
