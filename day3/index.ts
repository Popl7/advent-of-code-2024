import { TextLineStream } from "@std/text-line-stream";

const calcMul = (item: string) => {
  const nums = item.match(/([0-9]{1,3})/g);
  // console.warn('nums', nums); 
  if (!nums) {
    throw new Error('nums is not found');
  }
  const mult = parseInt(nums[0]) * parseInt(nums[1]);
  // console.warn('mult', mult);
  return mult
};

const getFle = async (filename: string) => {
  const items: string[] = [];
  using f = await Deno.open(`day3/${filename}.txt`)
  const readable = f.readable
  .pipeThrough(new TextDecoderStream())
  .pipeThrough(new TextLineStream());

  for await (const line of readable) {
    const matches = line.matchAll(/mul\([0-9]{1,3},[0-9]{1,3}\)/g);
    matches.forEach((match) => {
      items.push(match[0]);
    })
  }
  return items;  
}

export const main = async () => {
  console.warn(`day3.1 start`);
  const items = await getFle('input')
  const sum = items.reduce((acc, item) => {
    return acc + calcMul(item)
  }, 0);
  console.warn('day3.1 sum mults is', sum);
};
