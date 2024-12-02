// deno-lint-ignore-file no-case-declarations
type Coords = {
  x: number;
  y: number;
  z: number;
};
type State = { pc: number; stack: number[]; coords: Coords };

export const main = async () => {
  console.warn(`infi start`);

  const size = 30;  
  const lines = Deno.readTextFileSync('infi/input.txt').split('\n');

  const allCoords = [];
    for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      for (let z = 0; z < size; z++) {
        allCoords.push({x, y, z});
      }
    }
  };
  // const allCoords= [
  //   {x: 7, y: 0, z: 0},
  // ]

  const step = (pc: number, stack: number[], coords: Coords) => {
    const line = lines[pc];
    const [cmd, value] = line.split(/\s+/);
    console.log(`step ${pc}: ${cmd} ${value} / [${stack.join(',')}]`);

    switch (cmd) {
      case 'push':
        if (value === 'x' || value === 'X') {
          // console.warn('push x', coords.x);
          stack.push(coords.x);
        } else if (value === 'y' || value === 'Y') {
          // console.warn('push y', coords.y);
          stack.push(coords.y);
        } else if (value === 'z' || value === 'Z') {
          console.warn('push z', coords.z);
          stack.push(coords.z);
        } else {
          stack.push(+value);
        }
        return step(pc + 1, stack, coords);
      case 'add':
        const lastTwo = (stack.pop() || 0) + (stack.pop() || 0)
        // console.warn('adding', lastTwo); 
        stack.push(lastTwo);
        return step(pc + 1, stack, coords);
      case 'jmpos':
        const jmpAmount = stack.pop() || 0;
        if (jmpAmount >= 0) {
          console.warn('jmpos', value, '=', jmpAmount); 
          return step(pc + 1 + +value, stack, coords);
        }
        console.warn('jmpos NO', jmpAmount); 
        return step(pc + 1, stack, coords);
      case 'ret':
        const last = stack[stack.length-1]
        console.log('DONE', stack, last);
        return last;
      default:
        throw new Error(`Unknown command: ${cmd}`);
    }
  }

  
  const sum = allCoords.reduce((acc, coords) => {   
    const result = step(0, [], coords);
    // console.log('result', coords, result);
    return acc + result;
  }, 0);
  console.warn('sum', sum);

};

