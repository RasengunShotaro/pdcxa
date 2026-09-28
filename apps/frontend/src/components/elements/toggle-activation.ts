interface DecideActivationInput {
  previous: boolean;
  next: boolean;
}

export function オンに切り替わったかを判定する({
  previous,
  next,
}: DecideActivationInput): boolean {
  return !previous && next;
}
