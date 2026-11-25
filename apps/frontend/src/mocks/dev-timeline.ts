import type { FetchPds200, FetchPds200ItemsItem } from "@/schema/models";

interface 開発用の投稿者 {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly userName: string;
}

export const 開発用の投稿者たち: readonly 開発用の投稿者[] = [
  { id: "user_2abc", firstName: "太郎", lastName: "田中", userName: "taro" },
  {
    id: "user_dev_haruka",
    firstName: "遥",
    lastName: "佐藤",
    userName: "haruka",
  },
  { id: "user_dev_ren", firstName: "蓮", lastName: "高橋", userName: "ren" },
  {
    id: "user_dev_misaki",
    firstName: "美咲",
    lastName: "中村",
    userName: "misaki",
  },
];

const 本文の候補 = [
  "初回訪問の議事録、要点を3行に絞ってから共有したら質問が半分に減った。テンプレにしたいので意見ほしい。",
  "提案書のレビュー待ちで2日止まった。依頼のタイミングを前倒しにする。",
  "デモ環境の手順書を更新。手順を左から右の図にしたら、新人の詰まりが減った。",
  "朝会を15分から10分にした。話す順番を固定したら、むしろ情報が増えた。",
  "見積もりのズレの原因は、前提の書き漏れだった。前提を箇条書きで先に合意する。",
  "週末に歩いた道。考えごとは歩きながらのほうが進む。",
  "お客さんの言葉をそのまま議事録に残すようにしたら、認識違いが減った。",
  "失敗したリリースの振り返り。チェックリストに『本番の環境変数』を足した。",
];

const 画像の候補 = ["bg-1.webp", "bg-2.webp", "bg-3.webp", "bg-4.webp"];

const 全部の件数 = 60;
const ページごとの件数 = 15;
const 最新の投稿時刻 = Date.parse("2026-11-25T03:00:00.000Z");

const 開発用のPD = (index: number): FetchPds200ItemsItem => {
  const author = 開発用の投稿者たち[index % 開発用の投稿者たち.length];
  return {
    isMyPd: author.id === "user_2abc",
    isBookmarked: index % 7 === 0,
    quoteCount: index % 3,
    quotedPd: null,
    likeCount: (index * 7) % 23,
    replyCount: (index * 5) % 9,
    likes: [],
    id: `0190d2c0-0000-7000-8000-${String(index + 1).padStart(12, "0")}`,
    content: 本文の候補[index % 本文の候補.length],
    createdAt: new Date(最新の投稿時刻 - index * 47 * 60_000).toISOString(),
    userId: author.id,
    imageFileName:
      index % 4 === 1
        ? 画像の候補[Math.floor(index / 4) % 画像の候補.length]
        : null,
  };
};

const 開発用のPD一覧 = Array.from({ length: 全部の件数 }, (_, index) =>
  開発用のPD(index),
);

export const 開発用のPDを探す = (pdId: string): FetchPds200ItemsItem | null =>
  開発用のPD一覧.find((pd) => pd.id === pdId) ?? null;

export const 開発用のタイムラインを1ページ分返す = ({
  cursor,
}: {
  cursor: string | null;
}): FetchPds200 => {
  const start = cursor ? Number(cursor) : 0;
  const end = start + ページごとの件数;
  return {
    items: 開発用のPD一覧.slice(start, end),
    nextCursor: end < 全部の件数 ? String(end) : undefined,
  };
};
