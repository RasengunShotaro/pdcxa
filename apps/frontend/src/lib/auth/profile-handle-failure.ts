export type UpdateProfileHandleFailureReason =
  | "taken"
  | "invalidLength"
  | "invalidCharacter"
  | "needsNonNumberChar"
  | "cancelled"
  | "unknown";

const REASON_BY_CLERK_CODE: Record<string, UpdateProfileHandleFailureReason> = {
  form_identifier_exists: "taken",
  form_username_invalid_length: "invalidLength",
  form_username_invalid_character: "invalidCharacter",
  form_param_format_invalid: "invalidCharacter",
  form_username_needs_non_number_char: "needsNonNumberChar",
};

export const clerkCodeToHandleFailureReason = (
  code: string,
): UpdateProfileHandleFailureReason => REASON_BY_CLERK_CODE[code] ?? "unknown";

export const clerkCodesToHandleFailureReason = (
  codes: readonly string[],
): UpdateProfileHandleFailureReason =>
  codes
    .map(clerkCodeToHandleFailureReason)
    .find((reason) => reason !== "unknown") ?? "unknown";
