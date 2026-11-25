export const 一覧と詳細の幅の保存名 = "pdcxa-feed-layout";

const 覚えておく秒数 = 60 * 60 * 24 * 365;

export interface 一覧と詳細の幅 {
  list: number;
  detail: number;
}

const 幅として読めるか = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export const 保存された一覧と詳細の幅を読む = (
  raw: string | undefined,
): 一覧と詳細の幅 | undefined => {
  if (!raw) {
    return undefined;
  }
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(raw));
    if (typeof parsed !== "object" || parsed === null) {
      return undefined;
    }
    const list: unknown = Reflect.get(parsed, "list");
    const detail: unknown = Reflect.get(parsed, "detail");
    if (!幅として読めるか(list) || !幅として読めるか(detail)) {
      return undefined;
    }
    return { list, detail };
  } catch {
    return undefined;
  }
};

interface 幅を保存する条件 {
  layout: 一覧と詳細の幅;
  now: number;
}

interface 幅の保存内容 {
  name: string;
  value: string;
  path: string;
  expires: number;
  sameSite: "lax";
}

export const 一覧と詳細の幅を保存する形にする = ({
  layout: { list, detail },
  now,
}: 幅を保存する条件): 幅の保存内容 => ({
  name: 一覧と詳細の幅の保存名,
  value: encodeURIComponent(JSON.stringify({ list, detail })),
  path: "/",
  expires: now + 覚えておく秒数 * 1000,
  sameSite: "lax",
});
