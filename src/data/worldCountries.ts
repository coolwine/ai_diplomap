export type Coordinate = {
  lat: number;
  lon: number;
};

type RawGeometry = {
  coordinates: number[][][] | number[][][][];
  type: "MultiPolygon" | "Polygon";
};

type RawFeature = {
  geometry: RawGeometry;
  properties: {
    continent?: string;
    iso_a2?: string;
    iso_a3?: string;
    name: string;
    region_wb?: string;
    subregion?: string;
  };
  type: "Feature";
};

type RawFeatureCollection = {
  features: RawFeature[];
  type: "FeatureCollection";
};

type RawLinearRing = number[][];
type RawPolygon = RawLinearRing[];
type RawMultiPolygon = RawPolygon[];

export type CountryFeature = {
  areaScore: number;
  continent: string;
  displayGroupEn: string;
  displayGroupKo: string;
  flag: string;
  iso2: string | null;
  label: Coordinate;
  koreanContinent: string;
  koreanName: string;
  labelPriority: number;
  minZoom: number;
  name: string;
  polygons: Coordinate[][][];
  shortName: string;
};

const LABEL_OVERRIDES: Record<
  string,
  {
    label?: Coordinate;
    minZoom?: number;
    priority?: number;
  }
> = {
  Israel: { minZoom: 1.1, priority: 20 },
  Russia: { label: { lat: 61, lon: 95 } },
  "South Korea": { minZoom: 1.55, priority: 10 },
  Taiwan: { minZoom: 1.6, priority: 9 },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeName(name: string) {
  const overrides: Record<string, string> = {
    "Bosnia and Herz.": "Bosnia",
    "Central African Rep.": "CAR",
    "Dem. Rep. Congo": "DR Congo",
    "Dominican Rep.": "Dominican Rep.",
    "Eq. Guinea": "Eq. Guinea",
    "Fr. S. Antarctic Lands": "Antarctica",
    "Solomon Is.": "Solomon Is.",
    "United Arab Emirates": "UAE",
    "United Kingdom": "UK",
    "United States of America": "USA",
  };

  return overrides[name] ?? name;
}

function normalizeContinent(continent?: string) {
  if (!continent) {
    return "Other";
  }

  if (continent === "Seven seas (open ocean)") {
    return "Ocean";
  }

  return continent;
}

function getKoreanContinent(continent: string) {
  const names: Record<string, string> = {
    Africa: "아프리카",
    Antarctica: "남극",
    Asia: "아시아",
    Europe: "유럽",
    "North America": "북아메리카",
    Oceania: "오세아니아",
    Ocean: "대양",
    "South America": "남아메리카",
  };

  return names[continent] ?? continent;
}

function getDisplayGroup(continent: string, subregion?: string) {
  const subregionMap: Record<string, { en: string; ko: string }> = {
    Antarctica: { en: "Antarctica", ko: "남극" },
    Australia: { en: "Australia", ko: "오스트레일리아" },
    Caribbean: { en: "Caribbean (Americas)", ko: "카리브 (아메리카)" },
    "Central America": { en: "Central America", ko: "중앙아메리카" },
    "Central Asia": { en: "Central Asia", ko: "중앙아시아" },
    "Eastern Africa": { en: "East Africa", ko: "동아프리카" },
    "Eastern Asia": { en: "East Asia", ko: "동아시아" },
    "Eastern Europe": { en: "Eastern Europe", ko: "동유럽" },
    Melanesia: { en: "Melanesia (Oceania)", ko: "멜라네시아 (오세아니아)" },
    Micronesia: { en: "Micronesia (Oceania)", ko: "미크로네시아 (오세아니아)" },
    "Middle Africa": { en: "Central Africa", ko: "중앙아프리카" },
    "Northern Africa": { en: "North Africa", ko: "북아프리카" },
    "Northern America": { en: "North America", ko: "북아메리카" },
    "Northern Europe": { en: "Northern Europe", ko: "북유럽" },
    Polynesia: { en: "Polynesia (Oceania)", ko: "폴리네시아 (오세아니아)" },
    "South America": { en: "South America", ko: "남아메리카" },
    "South-Eastern Asia": { en: "Southeast Asia", ko: "동남아시아" },
    "Southern Africa": { en: "Southern Africa", ko: "남아프리카" },
    "Southern Asia": { en: "South Asia", ko: "남아시아" },
    "Southern Europe": { en: "Southern Europe", ko: "남유럽" },
    "Western Africa": { en: "West Africa", ko: "서아프리카" },
    "Western Asia": { en: "Western Asia (Middle East)", ko: "서아시아 (중동)" },
    "Western Europe": { en: "Western Europe", ko: "서유럽" },
  };

  if (subregion && subregionMap[subregion]) {
    return subregionMap[subregion];
  }

  return {
    en: continent,
    ko: getKoreanContinent(continent),
  };
}

const koreanDisplayNames =
  typeof Intl !== "undefined" ? new Intl.DisplayNames(["ko"], { type: "region" }) : null;

function normalizeIso2(iso2?: string) {
  if (!iso2 || iso2 === "-99") {
    return null;
  }

  return iso2.toUpperCase();
}

function getFlagEmoji(iso2: string | null) {
  if (!iso2 || iso2.length !== 2) {
    return "🌍";
  }

  return String.fromCodePoint(...iso2.split("").map((char) => 127397 + char.charCodeAt(0)));
}

function getKoreanName(name: string, iso2: string | null) {
  const overrides: Record<string, string> = {
    Antarctica: "남극",
    "Bosnia and Herz.": "보스니아 헤르체고비나",
    "Central African Rep.": "중앙아프리카공화국",
    "Dem. Rep. Congo": "콩고민주공화국",
    "Dominican Rep.": "도미니카 공화국",
    "Eq. Guinea": "적도 기니",
    Fiji: "피지",
    "Fr. S. Antarctic Lands": "프랑스령 남방 및 남극 지역",
    "Solomon Is.": "솔로몬 제도",
    "United Arab Emirates": "아랍에미리트",
    "United Kingdom": "영국",
    "United States of America": "미국",
    "W. Sahara": "서사하라",
  };

  if (overrides[name]) {
    return overrides[name];
  }

  if (iso2 && koreanDisplayNames) {
    return koreanDisplayNames.of(iso2) ?? name;
  }

  return name;
}

function toCoordinate(point: number[]) {
  return {
    lat: point[1],
    lon: point[0],
  };
}

function normalizePolygonLongitude(lon: number, referenceLon: number) {
  let normalized = lon;

  while (normalized - referenceLon > 180) {
    normalized -= 360;
  }

  while (normalized - referenceLon < -180) {
    normalized += 360;
  }

  return normalized;
}

function pointInRing(point: Coordinate, ring: Coordinate[]) {
  let isInside = false;
  const normalizedLon = point.lon;

  for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index++) {
    const current = ring[index];
    const last = ring[previous];
    const currentLon = normalizePolygonLongitude(current.lon, normalizedLon);
    const previousLon = normalizePolygonLongitude(last.lon, normalizedLon);
    const intersects =
      current.lat > point.lat !== last.lat > point.lat &&
      normalizedLon <
        ((previousLon - currentLon) * (point.lat - current.lat)) / (last.lat - current.lat) +
          currentLon;

    if (intersects) {
      isInside = !isInside;
    }
  }

  return isInside;
}

function polygonArea(ring: Coordinate[]) {
  let total = 0;

  for (let index = 0; index < ring.length; index += 1) {
    const current = ring[index];
    const next = ring[(index + 1) % ring.length];
    total += current.lon * next.lat - next.lon * current.lat;
  }

  return Math.abs(total) / 2;
}

function polygonCentroid(ring: Coordinate[]) {
  let accumulatedArea = 0;
  let centroidLon = 0;
  let centroidLat = 0;

  for (let index = 0; index < ring.length; index += 1) {
    const current = ring[index];
    const next = ring[(index + 1) % ring.length];
    const factor = current.lon * next.lat - next.lon * current.lat;

    accumulatedArea += factor;
    centroidLon += (current.lon + next.lon) * factor;
    centroidLat += (current.lat + next.lat) * factor;
  }

  if (Math.abs(accumulatedArea) < 1e-6) {
    return ring[Math.floor(ring.length / 2)] ?? { lat: 0, lon: 0 };
  }

  return {
    lat: centroidLat / (3 * accumulatedArea),
    lon: centroidLon / (3 * accumulatedArea),
  };
}

function computeAreaScore(polygons: Coordinate[][][]) {
  let maxLon = -Infinity;
  let maxLat = -Infinity;
  let minLon = Infinity;
  let minLat = Infinity;

  for (const polygon of polygons) {
    for (const ring of polygon) {
      for (const point of ring) {
        maxLon = Math.max(maxLon, point.lon);
        maxLat = Math.max(maxLat, point.lat);
        minLon = Math.min(minLon, point.lon);
        minLat = Math.min(minLat, point.lat);
      }
    }
  }

  return Math.max(1, (maxLon - minLon) * (maxLat - minLat));
}

function getPrimaryRing(polygons: Coordinate[][][]) {
  let winner = polygons[0]?.[0] ?? [];
  let maxArea = -Infinity;

  for (const polygon of polygons) {
    const ring = polygon[0] ?? [];
    const area = polygonArea(ring);

    if (area > maxArea) {
      winner = ring;
      maxArea = area;
    }
  }

  return winner;
}

function getMinZoom(areaScore: number) {
  if (areaScore > 2400) {
    return 1;
  }

  if (areaScore > 1200) {
    return 1.1;
  }

  if (areaScore > 600) {
    return 1.25;
  }

  if (areaScore > 250) {
    return 1.45;
  }

  if (areaScore > 120) {
    return 1.7;
  }

  return clamp(2.05 - areaScore / 400, 1.75, 2.35);
}

function mapCountries(rawCollection: RawFeatureCollection) {
  return rawCollection.features.map((feature) => {
    const iso2 = normalizeIso2(feature.properties.iso_a2);
    const labelOverride = LABEL_OVERRIDES[feature.properties.name];
    const polygons =
      feature.geometry.type === "Polygon"
        ? [(feature.geometry.coordinates as RawPolygon).map((ring) => ring.map(toCoordinate))]
        : (feature.geometry.coordinates as RawMultiPolygon).map((polygon) =>
            polygon.map((ring) => ring.map(toCoordinate)),
          );
    const areaScore = computeAreaScore(polygons);
    const primaryRing = getPrimaryRing(polygons);
    const continent = normalizeContinent(feature.properties.continent);
    const displayGroup = getDisplayGroup(continent, feature.properties.subregion);

    return {
      areaScore,
      continent,
      displayGroupEn: displayGroup.en,
      displayGroupKo: displayGroup.ko,
      flag: getFlagEmoji(iso2),
      iso2,
      label: labelOverride?.label ?? polygonCentroid(primaryRing),
      koreanContinent: getKoreanContinent(continent),
      koreanName: getKoreanName(feature.properties.name, iso2),
      labelPriority: labelOverride?.priority ?? 0,
      minZoom: labelOverride?.minZoom ?? getMinZoom(areaScore),
      name: feature.properties.name,
      polygons,
      shortName: normalizeName(feature.properties.name),
    };
  });
}

type RawFeatureIndexEntry = {
  id: string;
  name: string;
  iso2: string;
  filename: string;
};

let worldCountriesPromise: Promise<CountryFeature[]> | null = null;

export function loadWorldCountries() {
  if (!worldCountriesPromise) {
    worldCountriesPromise = fetch("/data/countries-index.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load countries index: ${response.status}`);
        }

        return response.json() as Promise<RawFeatureIndexEntry[]>;
      })
      .then((indexEntries) => {
        const fetchPromises = indexEntries.map((entry) =>
          fetch(`/data/${entry.filename}`).then((res) => {
            if (!res.ok) {
              throw new Error(`Failed to load country data for ${entry.id}: ${res.status}`);
            }
            return res.json() as Promise<RawFeature>;
          }),
        );
        return Promise.all(fetchPromises);
      })
      .then((features) => {
        const collection: RawFeatureCollection = {
          type: "FeatureCollection",
          features: features,
        };
        return mapCountries(collection);
      });
  }

  return worldCountriesPromise;
}

export function countryContainsPoint(country: CountryFeature, point: Coordinate) {
  return country.polygons.some((polygon) => {
    const outerRing = polygon[0];

    if (!outerRing || !pointInRing(point, outerRing)) {
      return false;
    }

    for (let index = 1; index < polygon.length; index += 1) {
      if (pointInRing(point, polygon[index])) {
        return false;
      }
    }

    return true;
  });
}
