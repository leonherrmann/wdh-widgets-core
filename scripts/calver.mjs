/**
 * CalVer helper: versions are <year>.<month>.<patch> (e.g. 2026.7.0).
 * Same month → patch + 1, new month/year → <year>.<month>.0.
 */
export function nextCalver(current, now = new Date()) {
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const match = /^(\d{4})\.(\d{1,2})\.(\d+)$/.exec(current ?? "");
  if (match) {
    const [, curYear, curMonth, curPatch] = match.map(Number);
    if (curYear === year && curMonth === month) {
      return `${year}.${month}.${curPatch + 1}`;
    }
  }
  return `${year}.${month}.0`;
}
