import * as v from "valibot";
import { MAX_CONTENT_LENGTH } from "../composer/composer-schema";

export const rePdComposerSchema = v.object({
  content: v.pipe(
    v.string(),
    v.maxLength(
      MAX_CONTENT_LENGTH,
      `${MAX_CONTENT_LENGTH}文字以内で入力してください`,
    ),
    v.check((value) => value.trim().length > 0, "空白だけでは返信できません"),
  ),
});

export type RePdComposerSchema = v.InferOutput<typeof rePdComposerSchema>;
