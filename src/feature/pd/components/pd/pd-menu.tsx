import { Copy, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Pd, RePd } from "../../types";
import { handleCopy } from "../../utils/clipboard-copy";

export const PdMenu = ({ pd }: { pd: Pd | RePd }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreHorizontal className="h-4 w-4 m-1 cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={handleCopy(pd.content)}>
          <Copy className="h-4 w-4" />
          クリップボードにコピー
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
