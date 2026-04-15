export type LeaderInfo = {
  name: string;
  title: string;
  image: string;
};

export const LEADERS: Record<string, LeaderInfo> = {
  US: {
    name: "Donald Trump",
    title: "47th President (2025–present)",
    image: "/leaders/us.png",
  },
  KR: {
    name: "이재명 (Lee Jae-Myung)",
    title: "14th President (2025–present)",
    image: "/leaders/kr.jpg",
  },
  JP: {
    name: "高市早苗 (Sanae Takaichi)",
    title: "65th Prime Minister (2025–present)",
    image: "/leaders/jp.jpg",
  },
  CN: {
    name: "习近平 (Xi Jinping)",
    title: "President (2013–present)",
    image: "/leaders/cn.jpg",
  },
};
