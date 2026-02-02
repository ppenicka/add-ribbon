export type ScreenConfig = {
  name: string;
  suffix: string;
  size: [number, number];
  ribbonHeight: number;
  borderRadius: number;
  isTahoe?: boolean;
};

export const SCREENS: ScreenConfig[] = [
  {
    name: "MacBook Pro 16",
    suffix: "mac-16",
    size: [3456, 2234],
    ribbonHeight: 38,
    borderRadius: 15,
  },
  {
    name: "MacBook Pro 16",
    suffix: "mac-16",
    size: [3456, 2234],
    ribbonHeight: 46,
    borderRadius: 21,
    isTahoe: true,
  },
  {
    name: "MacBook Pro 15",
    suffix: "mac-16",
    size: [2880, 1800],
    ribbonHeight: 75,
    borderRadius: 15,
  },
  {
    name: "MacBook Pro 14",
    suffix: "mac-14",
    size: [3024, 1964],
    ribbonHeight: 75,
    borderRadius: 26,
  },
  {
    name: "MacBook Pro 13",
    suffix: "mac-13",
    size: [2560, 1600],
    ribbonHeight: 75,
    borderRadius: 26,
  },
  {
    name: "4k External Display",
    suffix: "4k",
    size: [3840, 2160],
    ribbonHeight: 38,
    borderRadius: 15,
  },
  {
    name: "4k External Display",
    suffix: "4k",
    size: [3840, 2160],
    ribbonHeight: 46,
    borderRadius: 21,
    isTahoe: true,
  },
  {
    name: "2.5k External Display",
    suffix: "2-5k",
    size: [2560, 1440],
    ribbonHeight: 75,
    borderRadius: 15,
  },
  {
    name: "HD 1080p External Display",
    suffix: "HD-1080p",
    size: [1920, 1080],
    ribbonHeight: 75,
    borderRadius: 15,
  },
];

// Unique screen options for the dropdown (one per name, first occurrence)
const seenNames = new Set<string>();
export const SCREEN_OPTIONS = SCREENS.filter((s) => {
  if (seenNames.has(s.name)) return false;
  seenNames.add(s.name);
  return true;
}).map((s) => ({ name: s.name, size: s.size }));

/** Get SCREENS index for the given option index and Tahoe checkbox state. */
export function getScreenIndex(optionIndex: number, isTahoe: boolean): number {
  const name = SCREEN_OPTIONS[optionIndex]?.name;
  if (name == null) return 0;
  const match = SCREENS.findIndex(
    (s) => s.name === name && (s.isTahoe === true) === isTahoe
  );
  return match >= 0 ? match : SCREENS.findIndex((s) => s.name === name) ?? 0;
}
