export type LeaderInfo = {
  name: string;
  title: string;
  image: string;
};

export const LEADERS: Record<string, LeaderInfo> = {
  "United States of America": {
    name: "Donald Trump",
    title: "대통령",
    image: "/leaders/us.jpg",
  },
};
