import { bhamoIndex, jailIndex } from "./board";

export interface ICommunityChest {
  readonly label: string;
  readonly description?: string;
  readonly amount?: number;
  readonly creditOrDebit?: string;
  readonly moveTo?: number;
  readonly keepAble?: boolean;
  readonly canCollectGoPassBonus?: boolean;
}

export const CREDIT = "credit";
export const DEBIT = "debit";

export const communityChests: ICommunityChest[] = [
  {
    label: "FROM SALE OF STOCK YOU GET 50 KYAT",
    amount: 50.0,
    creditOrDebit: CREDIT,
  },
  {
    label: "PAY YOUR INSURANCE PREMIUM 50 KYAT",
    amount: 50.0,
    creditOrDebit: DEBIT,
  },
  {
    label: "DOCTOR'S FEES PAY 50 KYAT",
    amount: 50.0,
    creditOrDebit: DEBIT,
  },
  {
    label: "RECEIVE INTEREST ON 7% PREFERENCE SHARES 25 KYAT",
    amount: 25.0,
    creditOrDebit: CREDIT,
  },
  {
    label: "ANNUITY MATURES COLLECT 100 KYAT",
    amount: 100.0,
    creditOrDebit: CREDIT,
  },
  {
    label: "INCOME TAX REFUND COLLECT 20 KYAT",
    amount: 20.0,
    creditOrDebit: CREDIT,
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
    label: "YOU INHERIT 100 KYAT",
    amount: 100.0,
    creditOrDebit: CREDIT,
  },
  {
    label: "YOU HAVE WON SECOND PRICE IN A BEAUTY CONTEST COLLECT 20 KYAT",
    amount: 20.0,
    creditOrDebit: CREDIT,
  },
  {
    label: "GO BACK TO BHAMO",
    moveTo: bhamoIndex,
  },
  {
    label: `ADVANCE TO "GO"`,
    moveTo: 0,
  },
];
