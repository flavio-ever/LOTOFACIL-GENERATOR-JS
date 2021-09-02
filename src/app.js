require('dotenv/config');

import { performance } from 'perf_hooks';
import * as Classes from './classes';

/**
 * sequenceStep: 3
 * > Randomico de 3, ex: 20, 21, 22, [23], 24, 25, 26 ou [23], 24, 25, 26 ou 20, 21, 22, [23]
 * -------------------------------------------------------------------------------------------------------
 * maxSequenceStep: 6
 * > Maximo de 6 digitos, porque talvez a operação acima estoure as sequencias, quanto menor o valor melhor.
 */

(async (config, maxPrizeDranLn, maxRangeNumbers, maxNumbersPrizeDrawn) => {
  let randoms = [];


  const t1 = performance.now();
  for (let i = 0; i < maxPrizeDranLn; i++) {
    let random = new Classes.LotoGenerator(); // Or []

    // Set settings and return first prize draw
    await random.init(config, maxRangeNumbers, maxNumbersPrizeDrawn);

    // console.log(await random.isValidIntegritySequence([1,2 ,5 , 12 , 14 , 15 , 16 , 18 , 19, 20 , 21 , 22 , 23 , 24 , 25]))

    // Eliminate redundancy
    await random.eliminateArraysRedundancy(randoms, (duplicated) => {
      if (!duplicated) {
        randoms.push(random.data());
      }
    });
  }
  const t2 = performance.now();

  // Write logs
  await new Classes.LotoGenerator().print(randoms, config, t1, t2);

})([{ sequenceStep: 3, maxSequenceStep: 5 }], 3, 25, 15);

