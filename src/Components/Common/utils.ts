function isInConstraint(click: number, window: number, size: number) {
  const totalSize = click - window;
  return totalSize > 0 && totalSize < size;
}

export function isInsideDiv(
  event: any,
  ref: HTMLDivElement | null,
  screenX: number,
  screenY: number
) {
  if (
    ref === null ||
    !isInConstraint(event.clientX, screenX, ref.clientWidth) ||
    !isInConstraint(event.clientY, screenY, ref.clientHeight)
  ) {
    return false;
  }
  return true;
}
