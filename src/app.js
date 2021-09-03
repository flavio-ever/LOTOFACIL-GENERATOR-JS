require('dotenv/config');

import { performance } from 'perf_hooks';
import * as Classes from './classes';
import * as Api from './api';



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



/**
 * sequenceStep: 3
 * > Randomico de 3, ex: 20, 21, 22, [23], 24, 25, 26 ou [23], 24, 25, 26 ou 20, 21, 22, [23]
 * maxSequenceStep: 6
 * > Maximo de 6 digitos, porque talvez a operação acima estoure as sequencias, quanto menor o valor melhor.
 *
 * OU
 *
 * ([], 30, 25, 15) - Se quiser sorteios sem sequencia de números especificos
 *
 * --------------------------------------------------------------------------------------------
 * 30 - Quantidade de sorteios gerados
 * 25 - Quantidade máxima de números para sortear
 * 15 - Quantidade máxima de números sorteados
 */

})([{ sequenceStep: 3, maxSequenceStep: 5 }], 30, 25, 15);





// TESTES DE CONSULTA NA LOTERICA
// ----------------------------------------------------------------
// const response = await new Api.LotoFacilApi().getAllLotofacil();
//  let teste = [];
//  for (let { dezenas } of response?.data) {
//    for(let newDezenas of randoms) {
//      if (dezenas.every((v, i) => v === String(newDezenas[i]))) {
//        teste.push(dezenas);
//      }
//    }
//  }
//  console.log(teste, response.data.length);
// Write logs
// await new Classes.LotoGenerator().print(randoms, config, t1, t2);
