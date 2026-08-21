import { ObjectId } from "mongodb";
import { db } from "./db-setup";

export const AUTH = [
  {
    _id: new ObjectId("6a8086b405e5eaeb2898537d"),
    name: "pmacartney",
    hash: "$2b$10$BLJz8Ts8wyoOaWCPpB37.OB9i.dl4zvGrcWEXDtbHEx2Bw6cX9tVy",
  },
  {
    _id: new ObjectId("6a80d3d4c67e79e2c715ff2b"),
    name: "efrancescoli",
    hash: "$2b$10$BLJz8Ts8wyoOaWCPpB37.OB9i.dl4zvGrcWEXDtbHEx2Bw6cX9tVy",
  },
];

export const PASSWORDS = [
  {
    _id: new ObjectId("6a80dad17fbe2342490c53c3"),
    resource: "https://thebeatles.com",
    password: "yeahyeahyeah",
    userName: "pmacartney",
  },
  {
    _id: new ObjectId("6a80dd478c6ff9c6476e1a65"),
    resource: "https://google.com",
    password: "lovelovelove",
    userName: "pmacartney",
  },
  {
    _id: new ObjectId("6a80dbc60756f84e4558117b"),
    resource: "https://riverplate.com",
    password: "abracadabra",
    userName: "efrancescoli",
  },
];

export async function seedTestData() {
  await db.collection("auth").insertMany(AUTH);
  await db.collection("passwords").insertMany(PASSWORDS);
}
