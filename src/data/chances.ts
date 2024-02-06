import { jailIndex, leweIndex, portIndex, yangonIndex } from "./board";
import { CREDIT, DEBIT, ICommunityChest } from "./community-chests";

export interface IChance extends ICommunityChest {}

export const chances: IChance[] = [
  {
    label: "DRANK IN CHARGE FINE 20 KYAT",
    amount: 20.0,
    creditOrDebit: DEBIT,
  },
  {
    label: "SPEEDING FINE 15 KYAT",
    amount: 15.0,
    creditOrDebit: DEBIT,
  },
  {
    label: "PAY SCHOOL FEES OF 150 KYAT",
    amount: 150.0,
    creditOrDebit: DEBIT,
  },
  {
    label: `PAY A TRIP TO PORT AND IF YOU PASS "GO" COLLECT 200 KYAT`,
    moveTo: portIndex,
    canCollectGoPassBonus: true,
  },
  {
    label: "YOUR BUILDING LOAN MOTORES - RECEIVE 150 KYAT",
    amount: 150.0,
    creditOrDebit: CREDIT,
  },
  {
    label: `ADVANCE TO LEWE IF YOU PASS "GO" COLLECT 200 KYAT`,
    moveTo: leweIndex,
    canCollectGoPassBonus: true,
  },
  {
    label: `GO TO JAIL MOVE DIRECTLY TO JAIL DO NOT PASS "GO" DO NOT COLLECT 200 KYAT`,
    moveTo: jailIndex,
  },
  {
    label: "GET OUT OF JAIL FREE",
    description: "This card may be kept until needed or sold",
    keepAble: true,
  },
  {
    label: "BANK PAYS YOU DIVIDEND OF 50 KYAT",
    amount: 50.0,
    creditOrDebit: CREDIT,
  },
  {
    label: "GO BACK THREE SPACES",
    moveTo: -3,
  },
  {
    label: "ADVANCE TO YANGON",
    moveTo: yangonIndex,
  },
  {
    label: `ADVANCE TO "GO"`,
    moveTo: 0,
  },
];
