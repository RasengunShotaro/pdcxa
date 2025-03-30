import type { Pd } from "@/types/pd";

export const pds: Pd[] = [
  {
    id: "1",
    content: "左右確認じゃなくて右左確認にしたやつバカ",
    createdAt: new Date(Date.now() - 120000), // 2分前
    user: "炭",
    username: "@sumi_chan",
    likes: 175,
    comments: 2,
  },
  {
    id: "2",
    content: "TypeScriptとtRPCの組み合わせが最高です。型安全な開発が捗ります。",
    createdAt: new Date(Date.now() - 900000), // 15分前
    user: "山田花子",
    username: "@hanako_yamada",
    likes: 12,
    comments: 3,
  },
  {
    id: "3",
    content: "最近の天気はどうなってるんだろう？",
    createdAt: new Date(Date.now() - 113 * 24 * 60 * 60 * 1000), // 113日前
    user: "ノブ",
    username: "@nob",
    likes: 0,
    comments: 0,
  },
];
