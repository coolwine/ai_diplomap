export type LeaderInfo = {
  name: string;
  title: string;
  image: string;
};

const baseUrl = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

function withBaseUrl(path: string) {
  return `${baseUrl}${path.replace(/^\/+/, "")}`;
}

const rawLeaders: Record<string, LeaderInfo> = {
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
  CA: {
    name: "Mark Carney",
    title: "24th Prime Minister (2025–present)",
    image: "/leaders/ca.jpg",
  },
  GB: {
    name: "Keir Starmer",
    title: "Prime Minister (2024–present)",
    image: "/leaders/gb.jpg",
  },
  IL: {
    name: "בנימין נתניהו (Benjamin Netanyahu)",
    title: "Prime Minister (2022–present)",
    image: "/leaders/il.jpg",
  },
  EC: {
    name: "Daniel Roy Gilchrist Noboa Azín",
    title: "48th President (2025–present)",
    image: "/leaders/ec.jpg",
  },
  IN: {
    name: "नरेन्द्र मोदी (Narendra Modi)",
    title: "Prime Minister (2014–present)",
    image: "/leaders/in.jpg",
  },
  IR: {
    name: "مجتبی خامنه‌ای (Mojtaba Khamenei)",
    title: "Supreme Leader (2026–present)",
    image: "/leaders/ir.jpg",
  },
  KP: {
    name: "김정은 (Kim Jong Un)",
    title: "Supreme Leader (2011–present)",
    image: "/leaders/kp.jpg",
  },
  MX: {
    name: "Claudia Sheinbaum",
    title: "President (2024–present)",
    image: "/leaders/mx.jpg",
  },
  PH: {
    name: "Ferdinand Marcos Jr.",
    title: "17th President (2022–present)",
    image: "/leaders/ph.jpg",
  },
  RU: {
    name: "Владимир Путин (Vladimir Putin)",
    title: "President (2012–present)",
    image: "/leaders/ru.jpg",
  },
  SA: {
    name: "محمد بن سلمان (Mohammed bin Salman)",
    title: "Crown Prince & Prime Minister (2022–present)",
    image: "/leaders/sa.jpg",
  },
  TW: {
    name: "賴清德 (Lai Ching-te)",
    title: "President (2024–present)",
    image: "/leaders/tw.jpg",
  },
  UA: {
    name: "Володимир Зеленський (Volodymyr Zelenskyy)",
    title: "President (2019–present)",
    image: "/leaders/ua.jpg",
  },
  BR: {
    name: "Luiz Inácio Lula da Silva",
    title: "39th President (2023–present)",
    image: "/leaders/br.jpg",
  },
  EG: {
    name: "عبد الفتاح السيسي (Abdel Fattah el-Sisi)",
    title: "President (2014–present)",
    image: "/leaders/eg.jpg",
  },
  ID: {
    name: "Prabowo Subianto",
    title: "8th President (2024–present)",
    image: "/leaders/id.jpg",
  },
  NP: {
    name: "Balendra Shah",
    title: "43rd Prime Minister (2026–present)",
    image: "/leaders/np.png",
  },
  PL: {
    name: "Karol Nawrocki",
    title: "President (2025–present)",
    image: "/leaders/pl.jpg",
  },
  TR: {
    name: "Recep Tayyip Erdoğan",
    title: "12th President (2014–present)",
    image: "/leaders/tr.jpg",
  },
  VN: {
    name: "Tô Lâm",
    title: "General Secretary (2024–present)",
    image: "/leaders/vn.jpg",
  },
  AR: {
    name: "Javier Milei",
    title: "59th President (2023–present)",
    image: "/leaders/ar.jpg",
  },
  CO: {
    name: "Gustavo Petro",
    title: "President (2022–present)",
    image: "/leaders/co.jpg",
  },
  FR: {
    name: "Emmanuel Macron",
    title: "President (2017–present)",
    image: "/leaders/fr.jpg",
  },
  GY: {
    name: "Irfaan Ali",
    title: "President (2020–present)",
    image: "/leaders/gy.jpg",
  },
  JO: {
    name: "عبدالله الثاني (Abdullah II)",
    title: "King (1999–present)",
    image: "/leaders/jo.jpg",
  },
  LB: {
    name: "جوزيف عون (Joseph Aoun)",
    title: "President (2025–present)",
    image: "/leaders/lb.jpg",
  },
  MN: {
    name: "Ухнаагийн Хүрэлсүх (Ukhnaagiin Khürelsükh)",
    title: "President (2021–present)",
    image: "/leaders/mn.jpg",
  },
  PE: {
    name: "José María Balcázar",
    title: "President (2024–present)",
    image: "/leaders/pe.jpg",
  },
  PS: {
    name: "محمود عباس (Mahmoud Abbas)",
    title: "President (2005–present)",
    image: "/leaders/ps.jpg",
  },
  PY: {
    name: "Santiago Peña",
    title: "President (2023–present)",
    image: "/leaders/py.jpg",
  },
  SY: {
    name: "أحمد الشرع (Ahmed al-Sharaa)",
    title: "President (2025–present)",
    image: "/leaders/sy.jpg",
  },
  VE: {
    name: "Delcy Rodríguez",
    title: "President (Acting) (2026–present)",
    image: "/leaders/ve.jpg",
  },
  AE: {
    name: "محمد بن زايد آل نهيان (Mohammed bin Zayed)",
    title: "President (2022–present)",
    image: "/leaders/ae.jpg",
  },
  AF: {
    name: "هبة الله أخندزاده (Hibatullah Akhundzada)",
    title: "Supreme Leader (2016–present)",
    image: "/leaders/af.jpg",
  },
  AL: {
    name: "Edi Rama",
    title: "Prime Minister (2013–present)",
    image: "/leaders/al.jpg",
  },
  AM: {
    name: "Նիկոլ Փաշինյան (Nikol Pashinyan)",
    title: "Prime Minister (2018–present)",
    image: "/leaders/am.jpg",
  },
  AO: {
    name: "João Lourenço",
    title: "President (2017–present)",
    image: "/leaders/ao.jpg",
  },
  AT: {
    name: "Christian Stocker",
    title: "Chancellor (2025–present)",
    image: "/leaders/at.jpg",
  },
  AZ: {
    name: "İlham Əliyev (Ilham Aliyev)",
    title: "President (2003–present)",
    image: "/leaders/az.jpg",
  },
  DE: {
    name: "Friedrich Merz",
    title: "Chancellor (2025–present)",
    image: "/leaders/de.jpg",
  },
  AU: {
    name: "Anthony Albanese",
    title: "Prime Minister (2022–present)",
    image: "/leaders/au.jpg",
  },
  IT: {
    name: "Giorgia Meloni",
    title: "Prime Minister (2022–present)",
    image: "/leaders/it.jpg",
  },
  SE: {
    name: "Ulf Kristersson",
    title: "Prime Minister (2022–present)",
    image: "/leaders/se.jpg",
  },
  NL: {
    name: "Rob Jetten",
    title: "Prime Minister (2026–present)",
    image: "/leaders/nl.jpg",
  },
  BE: {
    name: "Bart De Wever",
    title: "Prime Minister (2025–present)",
    image: "/leaders/be.jpg",
  },
  CH: {
    name: "Guy Parmelin",
    title: "President of the Confederation (2026–present)",
    image: "/leaders/ch.jpg",
  },
  GR: {
    name: "Κυριάκος Μητσοτάκης (Kyriakos Mitsotakis)",
    title: "Prime Minister (2023–present)",
    image: "/leaders/gr.jpg",
  },
  PT: {
    name: "Luís Montenegro",
    title: "Prime Minister (2024–present)",
    image: "/leaders/pt.jpg",
  },
  PK: {
    name: "شہباز شریف (Shehbaz Sharif)",
    title: "Prime Minister (2024–present)",
    image: "/leaders/pk.jpg",
  },
  NG: {
    name: "Bola Tinubu",
    title: "President (2023–present)",
    image: "/leaders/ng.jpg",
  },
  ZA: {
    name: "Cyril Ramaphosa",
    title: "President (2018–present)",
    image: "/leaders/za.jpg",
  },
  KE: {
    name: "William Ruto",
    title: "President (2022–present)",
    image: "/leaders/ke.jpg",
  },
  ES: {
    name: "Pedro Sánchez",
    title: "Prime Minister (2018–present)",
    image: "/leaders/es.jpg",
  },
  ET: {
    name: "አብይ አሕመድ (Abiy Ahmed)",
    title: "Prime Minister (2018–present)",
    image: "/leaders/et.jpg",
  },
  TH: {
    name: "อนุทิน ชาญวีรกูล (Anutin Charnvirakul)",
    title: "Prime Minister (2024–present)",
    image: "/leaders/th.jpg",
  },
  MY: {
    name: "Anwar Ibrahim",
    title: "Prime Minister (2022–present)",
    image: "/leaders/my.jpg",
  },
  BD: {
    name: "তারেক রহমান (Tarique Rahman)",
    title: "Prime Minister (2024–present)",
    image: "/leaders/bd.jpg",
  },
  DZ: {
    name: "عبد المجيد تبون (Abdelmadjid Tebboune)",
    title: "President (2019–present)",
    image: "/leaders/dz.jpg",
  },
  IQ: {
    name: "محمد شياع السوداني (Mohammed Shia' al-Sudani)",
    title: "Prime Minister (2022–present)",
    image: "/leaders/iq.jpg",
  },
  CU: {
    name: "Miguel Díaz-Canel",
    title: "President (2018–present)",
    image: "/leaders/cu.jpg",
  },
  HU: {
    name: "Orbán Viktor",
    title: "Prime Minister (2010–present)",
    image: "/leaders/hu.jpg",
  },
  CZ: {
    name: "Andrej Babiš",
    title: "Prime Minister (2025–present)",
    image: "/leaders/cz.jpg",
  },
  RO: {
    name: "Ilie Bolojan",
    title: "Prime Minister (2025–present)",
    image: "/leaders/ro.jpg",
  },
  BG: {
    name: "Андрей Гюров (Andrey Gyurov)",
    title: "Acting Prime Minister (2026–present)",
    image: "/leaders/bg.jpg",
  },
  SK: {
    name: "Robert Fico",
    title: "Prime Minister (2023–present)",
    image: "/leaders/sk.jpg",
  },
  BY: {
    name: "Аляксандр Лукашэнка (Alexander Lukashenko)",
    title: "President (1994–present)",
    image: "/leaders/by.jpg",
  },
  MD: {
    name: "Alexandru Munteanu",
    title: "Prime Minister (2025–present)",
    image: "/leaders/md.jpg",
  },
  FI: {
    name: "Petteri Orpo",
    title: "Prime Minister (2023–present)",
    image: "/leaders/fi.jpg",
  },
  DK: {
    name: "Mette Frederiksen",
    title: "Prime Minister (2019–present)",
    image: "/leaders/dk.jpg",
  },
  IE: {
    name: "Micheál Martin",
    title: "Taoiseach (2025–present)",
    image: "/leaders/ie.jpg",
  },
  NZ: {
    name: "Christopher Luxon",
    title: "Prime Minister (2023–present)",
    image: "/leaders/nz.jpg",
  },
  CL: {
    name: "José Antonio Kast",
    title: "President (2026–present)",
    image: "/leaders/cl.jpg",
  },
  RS: {
    name: "Александар Вучић (Aleksandar Vučić)",
    title: "President (2017–present)",
    image: "/leaders/rs.jpg",
  },
  HR: {
    name: "Andrej Plenković",
    title: "Prime Minister (2016–present)",
    image: "/leaders/hr.jpg",
  },
  BA: {
    name: "Denis Bećirović",
    title: "Chairman of the Presidency (2022–present)",
    image: "/leaders/ba.jpg",
  },
  ME: {
    name: "Jakov Milatović",
    title: "President (2023–present)",
    image: "/leaders/me.jpg",
  },
  MK: {
    name: "Христијан Мицкоски (Hristijan Mickoski)",
    title: "Prime Minister (2024–present)",
    image: "/leaders/mk.jpg",
  },
  XK: {
    name: "Albin Kurti",
    title: "Prime Minister (2021–present)",
    image: "/leaders/xk.jpg",
  },
  SI: {
    name: "Robert Golob",
    title: "Prime Minister (2022–present)",
    image: "/leaders/si.jpg",
  },
  IS: {
    name: "Kristrún Frostadóttir",
    title: "Prime Minister (2024–present)",
    image: "/leaders/is.jpg",
  },
  EE: {
    name: "Kristen Michal",
    title: "Prime Minister (2024–present)",
    image: "/leaders/ee.jpg",
  },
  LT: {
    name: "Gitanas Nausėda",
    title: "President (2019–present)",
    image: "/leaders/lt.jpg",
  },
  LV: {
    name: "Edgars Rinkēvičs",
    title: "President (2023–present)",
    image: "/leaders/lv.jpg",
  },
  GE: {
    name: "ირაკლი კობახიძე (Irakli Kobakhidze)",
    title: "Prime Minister (2024–present)",
    image: "/leaders/ge.jpg",
  },
  CY: {
    name: "Νίκος Χριστοδουλίδης (Nikos Christodoulides)",
    title: "President (2023–present)",
    image: "/leaders/cy.jpg",
  },
  KW: {
    name: "مشعل الأحمد الصباح (Mishal Al-Ahmad Al-Sabah)",
    title: "Emir (2023–present)",
    image: "/leaders/kw.jpg",
  },
  QA: {
    name: "تميم بن حمد آل ثاني (Tamim bin Hamad Al Thani)",
    title: "Emir (2013–present)",
    image: "/leaders/qa.jpg",
  },
  OM: {
    name: "هيثم بن طارق (Haitham bin Tariq)",
    title: "Sultan (2020–present)",
    image: "/leaders/om.jpg",
  },
  YE: {
    name: "رشاد العليمي (Rashad al-Alimi)",
    title: "Chairman, Presidential Leadership Council (2022–present)",
    image: "/leaders/ye.jpg",
  },
  KZ: {
    name: "Қасым-Жомарт Тоқаев (Kassym-Jomart Tokayev)",
    title: "President (2019–present)",
    image: "/leaders/kz.jpg",
  },
  UZ: {
    name: "Shavkat Mirziyoyev",
    title: "President (2016–present)",
    image: "/leaders/uz.jpg",
  },
  BN: {
    name: "Hassanal Bolkiah",
    title: "Sultan & Prime Minister",
    image: "/leaders/bn.jpg",
  },
  BT: {
    name: "Jigme Khesar Namgyel Wangchuck",
    title: "King",
    image: "/leaders/bt.jpg",
  },
  KG: {
    name: "Sadyr Japarov",
    title: "President",
    image: "/leaders/kg.jpg",
  },
  KH: {
    name: "Hun Manet",
    title: "Prime Minister",
    image: "/leaders/kh.jpg",
  },
  LA: {
    name: "Thongloun Sisoulith",
    title: "General Secretary & President",
    image: "/leaders/la.jpg",
  },
  LK: {
    name: "Anura Kumara Dissanayake",
    title: "President",
    image: "/leaders/lk.jpg",
  },
  MA: {
    name: "Mohammed VI",
    title: "King",
    image: "/leaders/ma.jpg",
  },
  MM: {
    name: "Min Aung Hlaing",
    title: "President",
    image: "/leaders/mm.jpg",
  },
  TJ: {
    name: "Emomali Rahmon",
    title: "President",
    image: "/leaders/tj.jpg",
  },
  TL: {
    name: "Xanana Gusmao",
    title: "Prime Minister",
    image: "/leaders/tl.jpg",
  },
  TM: {
    name: "Serdar Berdimuhamedow",
    title: "President (2022–present)",
    image: "/leaders/tm.jpg",
  },
};

export const LEADERS: Record<string, LeaderInfo> = Object.fromEntries(
  Object.entries(rawLeaders).map(([iso2, leader]) => [
    iso2,
    {
      ...leader,
      image: withBaseUrl(leader.image),
    },
  ]),
);
