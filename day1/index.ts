import { TextLineStream } from "@std/text-line-stream";

const getMinMax = async (filename: string) => {
    using f = await Deno.open(`day1/${filename}.txt`)

    const readable = f.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());

    const mins: number[] = []
    const maxs: number[] = [];
    for await(const line of readable) {
      const [min, max] = line.split(/\s+/).map(Number);
      mins.push(min);
      maxs.push(max);
    }
    mins.sort((a, b) => a - b);
    maxs.sort((a, b) => a - b);
    return {mins, maxs};
}

export const main = async () => {
  const {mins, maxs} = await getMinMax('input')

  console.warn(`day 1 start`);
  const diffs = mins.reduce((acc, min, i) => {
    const max = maxs[i];
    const diff = Math.abs(max - min);
    // console.log(`min: ${min} -> max: ${max} =  ${diff}`);
    return acc + diff;
  }, 0); 
  console.warn(`day 1 done: ${diffs}`)

  console.warn(`day 2 start`);
  const similiarityScore = mins.reduce((acc, min, i) => {
    const nrOfMaxes = maxs.filter((max) => max == min).length;
    const similiarity = Math.abs(nrOfMaxes* min);
    // console.log(`min: ${min} -> max: ${nrOfMaxes} =  ${similiarity}`);
    return acc + similiarity;
  }, 0); 
  console.warn(`day 2 done: ${similiarityScore}`)
}