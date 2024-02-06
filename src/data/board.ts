import { IProperty, properties } from "./properties";

export interface IBoardItem {
  readonly label: string;
  readonly description?: string;
  readonly isProperty: boolean;
  readonly propertyIndex?: number;
  readonly property?: IProperty;
  readonly tax?: number;
}

function getPropertyBoardItem(name: string) {
  const index = properties.findIndex((p) => p.name === name);
  if (index == -1) {
    throw new Error("Property not found!");
  }
  return {
    label: properties[index].name,
    isProperty: true,
    propertyIndex: index,
    property: properties[index],
  };
}

const chanceBoardItem = {
  label: "CHANCE",
  description: "",
  isProperty: false,
};

const communityChestBoardItem = {
  label: "COMMUNITY CHEST",
  description: "",
  isProperty: false,
};

function getIncomeTaxBoardItem(amount: number) {
  return {
    label: "INCOME TAX",
    description: "",
    isProperty: false,
    tax: amount,
  };
}

export const board: IBoardItem[] = [
  {
    label: "GO",
    description: "COLLECT KYAT 200 SALARY AS YOU PASS GO",
    isProperty: false,
  },
  getPropertyBoardItem("BHAMO"),
  communityChestBoardItem,
  getPropertyBoardItem("MYITKYINA"),
  getIncomeTaxBoardItem(200.0),
  getPropertyBoardItem("TRAIN STATION"),
  getPropertyBoardItem("SET SE'"),
  chanceBoardItem,
  getPropertyBoardItem("NGWE SAUNG"),
  getPropertyBoardItem("NGAPALI"),
  {
    label: "JAIL",
    description: "JUST VISITING",
    isProperty: false,
  },
  getPropertyBoardItem("LEWE"),
  getPropertyBoardItem("POWER PLANT"),
  getPropertyBoardItem("PYINMANA"),
  getPropertyBoardItem("NAYPYIDAW"),
  getPropertyBoardItem("PORT"),
  getPropertyBoardItem("MYAWADDY"),
  communityChestBoardItem,
  getPropertyBoardItem("HPA-AN"),
  getPropertyBoardItem("MAWLAMYINE"),
  {
    label: "FREE LODGE",
    isProperty: false,
  },
  getPropertyBoardItem("INLE"),
  chanceBoardItem,
  getPropertyBoardItem("LASHIO"),
  getPropertyBoardItem("TAUNGGYI"),
  getPropertyBoardItem("BUS STATION"),
  getPropertyBoardItem("PAKOKKU"),
  getPropertyBoardItem("MYINGYAN"),
  getPropertyBoardItem("WATER PLANT"),
  getPropertyBoardItem("MEIKHTILA"),
  {
    label: "GO TO JAIL",
    isProperty: false,
  },
  getPropertyBoardItem("POPA"),
  getPropertyBoardItem("NYUNG-U"),
  communityChestBoardItem,
  getPropertyBoardItem("BAGAN"),
  getPropertyBoardItem("AIR PORT"),
  chanceBoardItem,
  getPropertyBoardItem("MANDALAY"),
  getIncomeTaxBoardItem(100.0),
  getPropertyBoardItem("YANGON"),
]; // 0 - 39

export const jailIndex = board.findIndex((b) => b.label === "GO TO JAIL");

export const bhamoIndex = board.findIndex((b) => b.label === "BHAMO");

export const portIndex = board.findIndex((b) => b.label === "PORT");

export const leweIndex = board.findIndex((b) => b.label === "LEWE");

export const yangonIndex = board.findIndex((b) => b.label === "YANGON");
