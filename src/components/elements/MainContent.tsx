import { pds } from "@/utils/dummy-pd-items";
import PdItem from "../pdItem/PostItem";

export function MainContent() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-4">
        {pds.map((post) => (
          <PdItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
