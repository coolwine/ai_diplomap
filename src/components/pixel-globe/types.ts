export type VisibleLabel = {
  continent: string;
  countryName: string;
  displayGroupEn: string;
  displayGroupKo: string;
  englishName: string;
  flagClass: string | null;
  key: string;
  koreanContinent: string;
  koreanName: string;
  isActive: boolean;
  relationLevel?: string;
  x: number;
  y: number;
};

export type VisibleRelation = {
  labelWidth: number;
  labelX: number;
  labelY: number;
  relationText: string;
  sourceBadgeWidth: number;
  sourceName: string;
  sourceKoreanName: string;
  sourceX: number;
  sourceY: number;
  targetBadgeWidth: number;
  color: string;
  label: string;
  level: string;
  motionDuration: string;
  path: string;
  targetKoreanName: string;
  targetName: string;
  targetX: number;
  targetY: number;
};
