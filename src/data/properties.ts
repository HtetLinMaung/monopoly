export interface IProperty {
  readonly name: string;
  readonly color: string;
  readonly price: number;
  readonly rentalPrices: IRentalPrice[];
  readonly buyingPrices: IBuyingPrice[];
  readonly mortgagePrice: number;
}

export interface IRentalPrice {
  readonly type: string;
  readonly count: number;
  readonly price: number;
}

export interface IBuyingPrice extends IRentalPrice {}

export const properties: IProperty[] = [
  {
    name: "YANGON",
    color: "blue",
    price: 400.0,
    rentalPrices: [
      {
        type: "land",
        count: 1,
        price: 50.0,
      },
      {
        type: "house",
        count: 1,
        price: 200.0,
      },
      {
        type: "house",
        count: 2,
        price: 600.0,
      },
      {
        type: "house",
        count: 3,
        price: 1400.0,
      },
      {
        type: "house",
        count: 4,
        price: 1700.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 2000.0,
      },
    ],
    buyingPrices: [
      {
        type: "house",
        count: 1,
        price: 200.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 200.0,
      },
    ],
    mortgagePrice: 200.0,
  },
  {
    name: "MANDALAY",
    color: "blue",
    price: 350.0,
    rentalPrices: [
      {
        type: "land",
        count: 1,
        price: 35.0,
      },
      {
        type: "house",
        count: 1,
        price: 175.0,
      },
      {
        type: "house",
        count: 2,
        price: 500.0,
      },
      {
        type: "house",
        count: 3,
        price: 1100.0,
      },
      {
        type: "house",
        count: 4,
        price: 1300.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 1500.0,
      },
    ],
    buyingPrices: [
      {
        type: "house",
        count: 1,
        price: 200.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 200.0,
      },
    ],
    mortgagePrice: 175.0,
  },
  {
    name: "NGWE SAUNG",
    color: "blue",
    price: 100.0,
    rentalPrices: [
      {
        type: "land",
        count: 1,
        price: 6.0,
      },
      {
        type: "house",
        count: 1,
        price: 30.0,
      },
      {
        type: "house",
        count: 2,
        price: 60.0,
      },
      {
        type: "house",
        count: 3,
        price: 270.0,
      },
      {
        type: "house",
        count: 4,
        price: 400.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 550.0,
      },
    ],
    buyingPrices: [
      {
        type: "house",
        count: 1,
        price: 50.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 50.0,
      },
    ],
    mortgagePrice: 50.0,
  },
  {
    name: "SET SE'",
    color: "blue",
    price: 100.0,
    rentalPrices: [
      {
        type: "land",
        count: 1,
        price: 6.0,
      },
      {
        type: "house",
        count: 1,
        price: 30.0,
      },
      {
        type: "house",
        count: 2,
        price: 60.0,
      },
      {
        type: "house",
        count: 3,
        price: 270.0,
      },
      {
        type: "house",
        count: 4,
        price: 400.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 550.0,
      },
    ],
    buyingPrices: [
      {
        type: "house",
        count: 1,
        price: 50.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 50.0,
      },
    ],
    mortgagePrice: 50.0,
  },
  {
    name: "NGAPALI",
    color: "blue",
    price: 120.0,
    rentalPrices: [
      {
        type: "land",
        count: 1,
        price: 8.0,
      },
      {
        type: "house",
        count: 1,
        price: 40.0,
      },
      {
        type: "house",
        count: 2,
        price: 100.0,
      },
      {
        type: "house",
        count: 3,
        price: 300.0,
      },
      {
        type: "house",
        count: 4,
        price: 450.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 600.0,
      },
    ],
    buyingPrices: [
      {
        type: "house",
        count: 1,
        price: 50.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 50.0,
      },
    ],
    mortgagePrice: 60.0,
  },

  {
    name: "NYUNG-U",
    color: "green",
    price: 300.0,
    rentalPrices: [
      {
        type: "land",
        count: 1,
        price: 26.0,
      },
      {
        type: "house",
        count: 1,
        price: 130.0,
      },
      {
        type: "house",
        count: 2,
        price: 390.0,
      },
      {
        type: "house",
        count: 3,
        price: 900.0,
      },
      {
        type: "house",
        count: 4,
        price: 1100.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 1275.0,
      },
    ],
    buyingPrices: [
      {
        type: "house",
        count: 1,
        price: 200.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 200.0,
      },
    ],
    mortgagePrice: 150.0,
  },
  {
    name: "BAGAN",
    color: "green",
    price: 320.0,
    rentalPrices: [
      {
        type: "land",
        count: 1,
        price: 20.0,
      },
      {
        type: "house",
        count: 1,
        price: 150.0,
      },
      {
        type: "house",
        count: 2,
        price: 450.0,
      },
      {
        type: "house",
        count: 3,
        price: 1000.0,
      },
      {
        type: "house",
        count: 4,
        price: 1200.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 1400.0,
      },
    ],
    buyingPrices: [
      {
        type: "house",
        count: 1,
        price: 200.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 200.0,
      },
    ],
    mortgagePrice: 160.0,
  },
  {
    name: "POPA",
    color: "green",
    price: 300.0,
    rentalPrices: [
      {
        type: "land",
        count: 1,
        price: 26.0,
      },
      {
        type: "house",
        count: 1,
        price: 130.0,
      },
      {
        type: "house",
        count: 2,
        price: 390.0,
      },
      {
        type: "house",
        count: 3,
        price: 900.0,
      },
      {
        type: "house",
        count: 4,
        price: 1100.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 1275.0,
      },
    ],
    buyingPrices: [
      {
        type: "house",
        count: 1,
        price: 200.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 200.0,
      },
    ],
    mortgagePrice: 150.0,
  },

  {
    name: "BUS STATION",
    color: "",
    price: 200.0,
    rentalPrices: [
      {
        type: "",
        count: 1,
        price: 25.0,
      },
      {
        type: "",
        count: 2,
        price: 50.0,
      },
      {
        type: "",
        count: 3,
        price: 100.0,
      },
      {
        type: "",
        count: 4,
        price: 200.0,
      },
    ],
    buyingPrices: [],
    mortgagePrice: 100.0,
  },
  {
    name: "TRAIN STATION",
    color: "",
    price: 200.0,
    rentalPrices: [
      {
        type: "",
        count: 1,
        price: 25.0,
      },
      {
        type: "",
        count: 2,
        price: 50.0,
      },
      {
        type: "",
        count: 3,
        price: 100.0,
      },
      {
        type: "",
        count: 4,
        price: 200.0,
      },
    ],
    buyingPrices: [],
    mortgagePrice: 100.0,
  },
  {
    name: "AIR PORT",
    color: "",
    price: 200.0,
    rentalPrices: [
      {
        type: "",
        count: 1,
        price: 25.0,
      },
      {
        type: "",
        count: 2,
        price: 50.0,
      },
      {
        type: "",
        count: 3,
        price: 100.0,
      },
      {
        type: "",
        count: 4,
        price: 200.0,
      },
    ],
    buyingPrices: [],
    mortgagePrice: 100.0,
  },
  {
    name: "PORT",
    color: "",
    price: 200.0,
    rentalPrices: [
      {
        type: "",
        count: 1,
        price: 25.0,
      },
      {
        type: "",
        count: 2,
        price: 50.0,
      },
      {
        type: "",
        count: 3,
        price: 100.0,
      },
      {
        type: "",
        count: 4,
        price: 200.0,
      },
    ],
    buyingPrices: [],
    mortgagePrice: 100.0,
  },

  {
    name: "WATER PLANT",
    color: "",
    price: 150.0,
    rentalPrices: [
      {
        type: "",
        count: 1,
        price: 5.0,
      },
      {
        type: "",
        count: 2,
        price: 10.0,
      },
    ],
    buyingPrices: [],
    mortgagePrice: 75.0,
  },
  {
    name: "POWER PLANT",
    color: "",
    price: 150.0,
    rentalPrices: [
      {
        type: "",
        count: 1,
        price: 5.0,
      },
      {
        type: "",
        count: 2,
        price: 10.0,
      },
    ],
    buyingPrices: [],
    mortgagePrice: 75.0,
  },

  {
    name: "BHAMO",
    color: "purple",
    price: 60.0,
    rentalPrices: [
      {
        type: "land",
        count: 1,
        price: 2.0,
      },
      {
        type: "house",
        count: 1,
        price: 10.0,
      },
      {
        type: "house",
        count: 2,
        price: 30.0,
      },
      {
        type: "house",
        count: 3,
        price: 90.0,
      },
      {
        type: "house",
        count: 4,
        price: 160.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 250.0,
      },
    ],
    buyingPrices: [
      {
        type: "house",
        count: 1,
        price: 50.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 50.0,
      },
    ],
    mortgagePrice: 30.0,
  },
  {
    name: "MYITKYINA",
    color: "purple",
    price: 60.0,
    rentalPrices: [
      {
        type: "land",
        count: 1,
        price: 5.0,
      },
      {
        type: "house",
        count: 1,
        price: 20.0,
      },
      {
        type: "house",
        count: 2,
        price: 60.0,
      },
      {
        type: "house",
        count: 3,
        price: 100.0,
      },
      {
        type: "house",
        count: 4,
        price: 320.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 450.0,
      },
    ],
    buyingPrices: [
      {
        type: "house",
        count: 1,
        price: 50.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 50.0,
      },
    ],
    mortgagePrice: 30.0,
  },

  {
    name: "PAKOKKU",
    color: "yellow",
    price: 260.0,
    rentalPrices: [
      {
        type: "land",
        count: 1,
        price: 22.0,
      },
      {
        type: "house",
        count: 1,
        price: 110.0,
      },
      {
        type: "house",
        count: 2,
        price: 330.0,
      },
      {
        type: "house",
        count: 3,
        price: 800.0,
      },
      {
        type: "house",
        count: 4,
        price: 975.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 1150.0,
      },
    ],
    buyingPrices: [
      {
        type: "house",
        count: 1,
        price: 150.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 150.0,
      },
    ],
    mortgagePrice: 130.0,
  },
  {
    name: "MYINGYAN",
    color: "yellow",
    price: 260.0,
    rentalPrices: [
      {
        type: "land",
        count: 1,
        price: 22.0,
      },
      {
        type: "house",
        count: 1,
        price: 110.0,
      },
      {
        type: "house",
        count: 2,
        price: 330.0,
      },
      {
        type: "house",
        count: 3,
        price: 800.0,
      },
      {
        type: "house",
        count: 4,
        price: 975.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 1150.0,
      },
    ],
    buyingPrices: [
      {
        type: "house",
        count: 1,
        price: 150.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 150.0,
      },
    ],
    mortgagePrice: 130.0,
  },
  {
    name: "MEIKHTILA",
    color: "yellow",
    price: 280.0,
    rentalPrices: [
      {
        type: "land",
        count: 1,
        price: 24.0,
      },
      {
        type: "house",
        count: 1,
        price: 120.0,
      },
      {
        type: "house",
        count: 2,
        price: 360.0,
      },
      {
        type: "house",
        count: 3,
        price: 850.0,
      },
      {
        type: "house",
        count: 4,
        price: 1025.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 1200.0,
      },
    ],
    buyingPrices: [
      {
        type: "house",
        count: 1,
        price: 150.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 150.0,
      },
    ],
    mortgagePrice: 140.0,
  },
  {
    name: "LEWE",
    color: "pink",
    price: 140.0,
    rentalPrices: [
      {
        type: "land",
        count: 1,
        price: 10.0,
      },
      {
        type: "house",
        count: 1,
        price: 50.0,
      },
      {
        type: "house",
        count: 2,
        price: 150.0,
      },
      {
        type: "house",
        count: 3,
        price: 450.0,
      },
      {
        type: "house",
        count: 4,
        price: 625.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 750.0,
      },
    ],
    buyingPrices: [
      {
        type: "house",
        count: 1,
        price: 100.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 100.0,
      },
    ],
    mortgagePrice: 70.0,
  },
  {
    name: "PYINMANA",
    color: "pink",
    price: 140.0,
    rentalPrices: [
      {
        type: "land",
        count: 1,
        price: 10.0,
      },
      {
        type: "house",
        count: 1,
        price: 50.0,
      },
      {
        type: "house",
        count: 2,
        price: 150.0,
      },
      {
        type: "house",
        count: 3,
        price: 450.0,
      },
      {
        type: "house",
        count: 4,
        price: 625.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 750.0,
      },
    ],
    buyingPrices: [
      {
        type: "house",
        count: 1,
        price: 100.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 100.0,
      },
    ],
    mortgagePrice: 70.0,
  },
  {
    name: "NAYPYIDAW",
    color: "pink",
    price: 160.0,
    rentalPrices: [
      {
        type: "land",
        count: 1,
        price: 12.0,
      },
      {
        type: "house",
        count: 1,
        price: 60.0,
      },
      {
        type: "house",
        count: 2,
        price: 180.0,
      },
      {
        type: "house",
        count: 3,
        price: 500.0,
      },
      {
        type: "house",
        count: 4,
        price: 700.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 900.0,
      },
    ],
    buyingPrices: [
      {
        type: "house",
        count: 1,
        price: 100.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 100.0,
      },
    ],
    mortgagePrice: 80.0,
  },
  {
    name: "MYAWADDY",
    color: "orange",
    price: 180.0,
    rentalPrices: [
      {
        type: "land",
        count: 1,
        price: 14.0,
      },
      {
        type: "house",
        count: 1,
        price: 70.0,
      },
      {
        type: "house",
        count: 2,
        price: 200.0,
      },
      {
        type: "house",
        count: 3,
        price: 550.0,
      },
      {
        type: "house",
        count: 4,
        price: 750.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 950.0,
      },
    ],
    buyingPrices: [
      {
        type: "house",
        count: 1,
        price: 100.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 100.0,
      },
    ],
    mortgagePrice: 90.0,
  },
  {
    name: "HPA-AN",
    color: "orange",
    price: 180.0,
    rentalPrices: [
      {
        type: "land",
        count: 1,
        price: 14.0,
      },
      {
        type: "house",
        count: 1,
        price: 70.0,
      },
      {
        type: "house",
        count: 2,
        price: 200.0,
      },
      {
        type: "house",
        count: 3,
        price: 550.0,
      },
      {
        type: "house",
        count: 4,
        price: 750.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 950.0,
      },
    ],
    buyingPrices: [
      {
        type: "house",
        count: 1,
        price: 100.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 100.0,
      },
    ],
    mortgagePrice: 90.0,
  },
  {
    name: "MAWLAMYINE",
    color: "orange",
    price: 200.0,
    rentalPrices: [
      {
        type: "land",
        count: 1,
        price: 16.0,
      },
      {
        type: "house",
        count: 1,
        price: 80.0,
      },
      {
        type: "house",
        count: 2,
        price: 220.0,
      },
      {
        type: "house",
        count: 3,
        price: 600.0,
      },
      {
        type: "house",
        count: 4,
        price: 800.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 1000.0,
      },
    ],
    buyingPrices: [
      {
        type: "house",
        count: 1,
        price: 100.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 100.0,
      },
    ],
    mortgagePrice: 100.0,
  },
  {
    name: "INLE",
    color: "red",
    price: 220.0,
    rentalPrices: [
      {
        type: "land",
        count: 1,
        price: 18.0,
      },
      {
        type: "house",
        count: 1,
        price: 90.0,
      },
      {
        type: "house",
        count: 2,
        price: 250.0,
      },
      {
        type: "house",
        count: 3,
        price: 700.0,
      },
      {
        type: "house",
        count: 4,
        price: 875.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 1050.0,
      },
    ],
    buyingPrices: [
      {
        type: "house",
        count: 1,
        price: 150.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 150.0,
      },
    ],
    mortgagePrice: 110.0,
  },
  {
    name: "LASHIO",
    color: "red",
    price: 220.0,
    rentalPrices: [
      {
        type: "land",
        count: 1,
        price: 18.0,
      },
      {
        type: "house",
        count: 1,
        price: 90.0,
      },
      {
        type: "house",
        count: 2,
        price: 250.0,
      },
      {
        type: "house",
        count: 3,
        price: 700.0,
      },
      {
        type: "house",
        count: 4,
        price: 875.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 1050.0,
      },
    ],
    buyingPrices: [
      {
        type: "house",
        count: 1,
        price: 150.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 150.0,
      },
    ],
    mortgagePrice: 110.0,
  },
  {
    name: "TAUNGGYI",
    color: "red",
    price: 240.0,
    rentalPrices: [
      {
        type: "land",
        count: 1,
        price: 20.0,
      },
      {
        type: "house",
        count: 1,
        price: 100.0,
      },
      {
        type: "house",
        count: 2,
        price: 300.0,
      },
      {
        type: "house",
        count: 3,
        price: 750.0,
      },
      {
        type: "house",
        count: 4,
        price: 925.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 1100.0,
      },
    ],
    buyingPrices: [
      {
        type: "house",
        count: 1,
        price: 150.0,
      },
      {
        type: "hotel",
        count: 1,
        price: 150.0,
      },
    ],
    mortgagePrice: 120.0,
  },
];

export const countColor = (color: string) => {
  return properties.filter((p) => p.color === color).length;
};

export const isTransportationProperty = (index: number) => {
  if (!properties[index]) {
    return false;
  }
  return ["BUS STATION", "TRAIN STATION", "AIR PORT", "PORT"].includes(
    properties[index].name
  );
};

export const isEnergyProperty = (index: number) => {
  if (!properties[index]) {
    return false;
  }
  return ["POWER PLANT", "WATER PLANT"].includes(properties[index].name);
};
