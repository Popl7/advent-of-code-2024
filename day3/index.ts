const calcMul = (item: string) => {
  const nums = item.match(/([0-9]{1,3})/g);
  if (!nums) {
    throw new Error('nums is not found');
  }
  const mult = parseInt(nums[0]) * parseInt(nums[1]);
  return mult
};

const getMuls = async (filename: string) => {
  using f = await Deno.open(`day3/${filename}.txt`)
  const readable = f.readable.pipeThrough(new TextDecoderStream());

  const items: string[] = [];
  for await (const line of readable) {
    line.matchAll(/mul\([0-9]{1,3},[0-9]{1,3}\)/g).forEach((match) => {
      items.push(match[0]);
    })
  }
  return items;  
}

const getMuls2 = async (filename: string) => {
  using f = await Deno.open(`day3/${filename}.txt`)
  const readable = f.readable.pipeThrough(new TextDecoderStream());

  const items: string[] = [];
  for await (const line of readable) {
    line.split(/do\(\)/).forEach((part) => {
      const enabledParts = part.split(/don't\(\)/);
      enabledParts[0].matchAll(/mul\([0-9]{1,3},[0-9]{1,3}\)/g).forEach((match) => {
        items.push(match[0]);
      })
    });
  }
  return items;  
}

export const main = async () => {
  console.warn(`day3.1 start`);
  const items = await getMuls('demo')
  const sum = items.reduce((acc, item) => {
    return acc + calcMul(item)
  }, 0);
  console.warn('day3.1 sum mults is', sum);

  console.warn(`day3.2 start`);
  const items2 = await getMuls2('input')
  const sum2 = items2.reduce((acc, item) => {
    return acc + calcMul(item)
  }, 0);
  console.warn('day3.2 sum mults is', sum2);
};
