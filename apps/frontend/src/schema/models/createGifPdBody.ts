
export type CreateGifPdBody = {
  /**
     * @minLength 1
     * @maxLength 200
     */
  content: string;
  quotedPdId?: string;
  image: Blob | File;
};
