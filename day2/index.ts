import { TextLineStream } from "@std/text-line-stream";

export const main = async () => {
  console.warn(`day2 start`);
  const items = await getData('input');
  const safeItems = items.map(i => {
    return isSafe(i);
  }).filter(i => i == 'SAFE')
  console.debug('day2.1:', safeItems.length);

  const fixedItems = items.map(i => {
    return  hasSafeAlternative(i) || isSafe(i);
  }).filter(i => i == 'SAFE')
  console.debug('day2.2:', fixedItems.length);
};

const hasSafeAlternative = (items: number[]) => {
  // console.log('item:', items);
  return items.map((_item, idx) => {
    const alternatives = items.filter((_, i) => i != idx);
    // console.log(' - ', alternatives, isSafe(alternatives));
    return isSafe(alternatives)
  }).filter(i => i == 'SAFE').length > 0 ? 'SAFE' : 'UNSAFE';
};

const isOrdered = (items: number[]) => {
  const sorted = [...items].sort((a, b) => a - b);
  return items.join() == sorted.join() || items.reverse().join() == sorted.join();
};

const overMaxDistance = (sorted: number[]) => {
  return sorted.find((cur, idx) => {
    if (idx == sorted.length - 1) return false
    const diff = Math.abs(cur - sorted[idx+1]);
    const invalidDiff = (diff < 1 || diff > 3);
    // console.debug('maxDistance:', cur, items[idx+1], '=', diff, invalidDiff ? 'UNSAFE' : 'SAFE');
    return invalidDiff;
  });
}

const isSafe = (items: number[]) => {
  const sorted = [...items].sort((a, b) => a - b);
  const alreadySorted = isOrdered(items);
  const overMax = overMaxDistance(sorted);
  // console.debug('items:', items.join(), alreadySorted && !overMaxDistance ? 'SAFE' : 'UNSAFE');
  if (!alreadySorted) return 'UNSAFE';
  if (overMax) return 'UNSAFE';
  return 'SAFE';
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