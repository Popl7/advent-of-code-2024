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
    // console.log(`step ${pc}: ${cmd} ${value} / [${stack.join(',')}]`);

    switch (cmd) {
      case 'push':
        if (value === 'x' || value === 'X') {
          // console.warn('push x', coords.x);
          stack.push(coords.x);
        } else if (value === 'y' || value === 'Y') {
          // console.warn('push y', coords.y);
          stack.push(coords.y);
        } else if (value === 'z' || value === 'Z') {
          // console.warn('push z', coords.z);
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
          // console.warn('jmpos', value, '=', jmpAmount); 
          return step(pc + 1 + +value, stack, coords);
        }
        // console.warn('jmpos NO', jmpAmount); 
        return step(pc + 1, stack, coords);
      case 'ret':
        const result = stack[stack.length-1]
        return {result, coords};
      default:
        throw new Error(`Unknown command: ${cmd}`);
    }
  }

  // const sum = allCoords.reduce((acc, crds) => {   
  //   const {result} = step(0, [], crds);
  //   // console.log('result', coords, result);
  //   return acc + result;
  // }, 0);
  // console.warn('infi1', sum);

  ///////////////////////////////////////////////////////////////////////////////////////////////////

  const clouds: Coords[][] = [];
  
  allCoords.forEach(crds => {   
    const {result, coords} = step(0, [], crds);
    if (result > 0) {
      // console.log('result', result, coords);

      const joinedClouds = clouds.filter(cloud => {
        return cloud.some(cloudCoords => {
          return (
            Math.abs(cloudCoords.x - coords.x) <= 1 &&
            Math.abs(cloudCoords.y - coords.y) <= 1 &&
            Math.abs(cloudCoords.z - coords.z) <= 1
          );
        });
      });
      
      if (joinedClouds?.length > 1) {
        const joinedCloudIds = joinedClouds.map(joinedCloud => clouds.indexOf(joinedCloud));
        // console.log('cloudIds!', coords, joinedCloudIds);
        joinedCloudIds.forEach((joinedCloudId, i) => {
          // console.warn('BEFORE', clouds[joinedCloudId]);
          if (i === 0) {
            clouds[joinedCloudId] = joinedClouds.flat();
          } else {
            clouds[joinedCloudId] = [];
          }
          // console.warn('AFTER', clouds[joinedCloudId]);
        });
      } else if (joinedClouds?.length > 0) {
        const existing = joinedClouds[0];
        // console.debug('existing cloud', coords, existing);
        const cloudId = clouds.indexOf(existing);
        existing.push(coords);
        clouds[cloudId] = existing
      } else {
        // console.debug('new cloud', coords);
        const newCloud = [coords];
        clouds.push(newCloud);
      }

      // const cloudId = clouds.findIndex(cloud => {
      //   return cloud.some(cloudCoords => {
      //     return (
      //       Math.abs(cloudCoords.x - coords.x) <= 1 &&
      //       Math.abs(cloudCoords.y - coords.y) <= 1 &&
      //       Math.abs(cloudCoords.z - coords.z) <= 1
      //     );
      //   });
      // });


      // if (cloudId > -1) {
      //   // console.debug('existing cloud', coords);
      //   const existing = clouds[cloudId];
      //   existing.push(coords);
      //   clouds[cloudId] = existing
      // } else {
      //   // console.debug('new cloud', coords);
      //   const newCloud = [coords];
      //   clouds.push(newCloud);
      // }
    }
  });
  console.warn('infi2 clouds', clouds.length);
};

