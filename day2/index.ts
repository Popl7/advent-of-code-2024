import { TextLineStream } from "@std/text-line-stream";

export const main = async () => {
  console.warn(`day2 start`);
  const items = await getData('input');
  const safeItems = items.filter(isSafe)
  console.debug('day2.1:', safeItems.length);

  const fixedItems = items.filter(i => {
    if (isSafe(i)) return true;
    if (safeAlternatives(i).length > 0) return true;
    return false;
  })
  console.debug('day2.2:', fixedItems.length);
};

const safeAlternatives = (items: number[]) => {
  return items.filter((_item, idx) => isSafe(items.filter((_, i) => i != idx)));
};

const isOrdered = (items: number[]) => {
  const sorted = [...items].sort((a, b) => a - b);
  return items.join() == sorted.join() || items.reverse().join() == sorted.join();
};

const overMaxDistance = (sorted: number[]) => {
  return !!sorted.find((cur, idx) => {
    if (idx == sorted.length - 1) return false
    const diff = Math.abs(cur - sorted[idx+1]);
    const invalidDiff = (diff < 1 || diff > 3);
    return invalidDiff;
  });
}

const isSafe = (items: number[]) => {
  const sorted = [...items].sort((a, b) => a - b);
  const isAlreadySorted = isOrdered(items);
  const overMax = overMaxDistance(sorted);
  if (!isAlreadySorted) return false
  if (overMax) return false;
  return true;
}

const getData = async (filename: string) => {
  using f = await Deno.open(`day2/${filename}.txt`)
  
  const items = [];

  const readable = f.readable
  .pipeThrough(new TextDecoderStream())
  .pipeThrough(new TextLineStream());

  for await (const line of readable) {
    items.push(line.split(/\s+/).map(Number));
  }
  return items;
}