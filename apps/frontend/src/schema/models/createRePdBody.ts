
export type CreateRePdBody = {
  pdId: string;
  /**
     * @minLength 1
     * @maxLength 200
     */
  content: string;
};
