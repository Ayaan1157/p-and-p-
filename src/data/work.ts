export type Discipline = "institutional" | "industrial" | "commercial" | "residential";

export type Project = {
  title: string;
  location: string;
  year: number;
  size: string;
  note?: string;
  images: string[];
};

export const disciplines: Record<
  Discipline,
  { label: string; code: string; color: string; tagline: string; projects: Project[] }
> = {
  institutional: {
    label: "Institutional",
    code: "Ia",
    color: "#C00000",
    tagline: "Civic and cultural spaces designed for permanence and public life.",
    projects: [
      {
        title: "TVS New School",
        location: "Madurai",
        year: 2012,
        size: "20,000 sqm",
        images: ["/portfolio/p29.jpg", "/portfolio/p30.jpg", "/portfolio/p31.jpg"],
      },
    ],
  },
  industrial: {
    label: "Industrial",
    code: "Ia",
    color: "#7030A0",
    tagline: "Production and logistics environments shaped for performance and precision.",
    projects: [
      {
        title: "John Distilleries — Big Banyan",
        location: "Goa",
        year: 2025,
        size: "4,000 sqm",
        note: "Distillation & malt plant",
        images: ["/portfolio/p3.jpg", "/portfolio/p4.jpg", "/portfolio/p5.jpg", "/portfolio/p6.jpg"],
      },
      {
        title: "SAAB Engineering",
        location: "Jigani, Bangalore",
        year: 2025,
        size: "2,000 sqm",
        note: "Shop floor at multiple levels with continuous gantry",
        images: ["/portfolio/p7.jpg"],
      },
      {
        title: "SAAB Unit 5",
        location: "Shoolagiri, TN",
        year: 2025,
        size: "10,500 sqm",
        note: "Shop floor + gantry on terrain site",
        images: ["/portfolio/p8.jpg", "/portfolio/p10.jpg", "/portfolio/p11.jpg"],
      },
      {
        title: "Veeregowda Factory",
        location: "Bangalore",
        year: 2024,
        size: "2,000 sqm",
        images: ["/portfolio/p12.jpg", "/portfolio/p13.jpg"],
      },
      {
        title: "Glastronix",
        location: "Dobbaspet",
        year: 2021,
        size: "8,000 sqm",
        note: "Precision engineering — SS parts for aircraft. As Associate Architect with Parikshit Dalal — Design + Architecture.",
        images: ["/portfolio/p14.jpg", "/portfolio/p15.jpg", "/portfolio/p16.jpg"],
      },
      {
        title: "City Fab & Roofing",
        location: "Peenya, Bangalore",
        year: 2019,
        size: "1,000 sqm",
        note: "Aluminium profile sheet manufacturer",
        images: ["/portfolio/p17.jpg", "/portfolio/p18.jpg"],
      },
      {
        title: "Powerica",
        location: "Nelamangala",
        year: 2012,
        size: "4,500 sqm",
        note: "Paint booth + gantry, space frame roof — no rafters. Cost-effective construction.",
        images: ["/portfolio/p20.jpg", "/portfolio/p21.jpg", "/portfolio/p22.jpg", "/portfolio/p23.jpg"],
      },
    ],
  },
  commercial: {
    label: "Commercial",
    code: "Ca",
    color: "#0329B4",
    tagline: "Workplaces and retail environments designed for considered commerce.",
    projects: [
      {
        title: "KSCA",
        location: "Alur, Bangalore",
        year: 2018,
        size: "4,500 sqm",
        note: "Indoor sports facility",
        images: ["/portfolio/p24.jpg", "/portfolio/p25.jpg", "/portfolio/p26.jpg"],
      },
      {
        title: "Marks & Spencer",
        location: "Koramangala, Bangalore",
        year: 2015,
        size: "8,000 sqm",
        note: "Commercial complex opp. Sony World",
        images: ["/portfolio/p27.jpg", "/portfolio/p28.jpg"],
      },
    ],
  },
  residential: {
    label: "Residential",
    code: "Ra",
    color: "#EBAF04",
    tagline: "Private homes shaped around the rhythms of the people who live in them.",
    projects: [
      {
        title: "Brigade Omega Residence",
        location: "Bangalore",
        year: 2020,
        size: "2,400 sft",
        note: "CX: Sai Ramanan",
        images: ["/portfolio/p38.jpg", "/portfolio/p39.jpg", "/portfolio/p40.jpg", "/portfolio/p41.jpg", "/portfolio/p42.jpg"],
      },
      {
        title: "Private Residence",
        location: "Bangalore",
        year: 2022,
        size: "—",
        images: ["/portfolio/p33.jpg", "/portfolio/p34.jpg", "/portfolio/p35.jpg", "/portfolio/p36.jpg"],
      },
      {
        title: "Private Residence",
        location: "Bangalore",
        year: 2017,
        size: "2,200 sft",
        images: ["/portfolio/p37.jpg", "/portfolio/p43.jpg", "/portfolio/p44.jpg"],
      },
    ],
  },
};
