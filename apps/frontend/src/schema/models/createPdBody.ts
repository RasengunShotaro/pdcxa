
export type CreatePdBody = {
  /**
     * @minLength 1
     * @maxLength 200
     */
  content: string;
  image?: Blob;
};
