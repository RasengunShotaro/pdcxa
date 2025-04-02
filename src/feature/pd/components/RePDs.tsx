import type { RePd } from "../types";
import RePdItem from "./RePdItem";

export const RePds = ({ rePds }: { rePds: RePd[] }) => {
  return (
    <>
      <h2 className="font-bold text-xl">RePD一覧</h2>
      {rePds.map((rePd) => (
        <RePdItem key={rePd.id} rePd={rePd} />
      ))}
      {!rePds?.length && (
        <p className="text-gray-500">まだRePDはありません。RePDしてみよう!</p>
      )}
    </>
  );
};
