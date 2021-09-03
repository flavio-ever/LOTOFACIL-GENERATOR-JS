import fs from 'fs';
import { format } from 'date-fns';

export default class LotoGenerator {
  sequences = []; // Generate array with 25 positions

  randoms = [];

  async init(params, maxRangeNumbers = 25, maxNumbersPrizeDrawn = 15) {
    this.sequences = await this.getMaxRangeNumbers(maxRangeNumbers);

    // Generate sequence of numbers (not remove)
    await this.generateAndCleanSequences(params);

    while (this.randoms.length < maxNumbersPrizeDrawn) {
      const rdnNum = await this.getRndSequences();
      if (rdnNum) {
        this.randoms.push(rdnNum);
      }
    }

    // Attention! Possible Stack Error
    const isValidIntegritySequence = await this.isValidIntegritySequence(this.data());
    if(isValidIntegritySequence) {
      this.sequences = await this.getMaxRangeNumbers(maxRangeNumbers);  // Generate array with 25 positions
      this.randoms = [];

      await this.init(params);
    }
  }

  /**
   *
   * @param {*} num
   * @returns
   */
  async getMaxRangeNumbers(num) {
    return Array.from({length: num}, (_, i) => i + 1);
  }

  /**
   *
   * @param {*} sqs
   */
  async removeNumbers(sqs) {
    try {
      for (const sq of sqs) {
        this.sequences.splice(this.sequences.indexOf(sq), 1);
      }
    } catch (error) { }
  }

  /**
   *
   * @param {*} type
   * @param {*} num1
   * @param {*} num2
   * @param {*} qtdMax
   * @returns
   */
  async numbPositionSequence(type, num1, num2, qtdMax = 6) {
    let rndNumbSequences = [];

    if (type === 'start') {
      for (let i = num2; i <= num2 + num1; i++) {
        if (i >= 1 && i <= 25 && rndNumbSequences.length < qtdMax) {
          rndNumbSequences.push(i);
        }
      }
    }

    if (type === 'middle') {
      for (let i = num2 - num1; i <= num2 + num1; i++) {
        if (i >= 1 && i <= 25 && rndNumbSequences.length < qtdMax) {
          rndNumbSequences.push(i);
        }
      }
    }

    if (type === 'end') {
      for (let i = num2; i >= num2 - num1; i--) {
        if (i >= 1 && i <= 25 && rndNumbSequences.length < qtdMax) {
          rndNumbSequences.push(i);
          qtdMax += 1;
        }
      }
    }

    return rndNumbSequences;
  }

  /**
   *
   * @param {*} sequence
   * @param {*} baseNumber
   * @param {*} qtdMax
   * @returns
   */
  async generateRndNumbSequences(sequence, baseNumber, qtdMax) {
    const sequencesTypeNames = ['start', 'middle', 'end'];
    const sequenceTypeRndName = sequencesTypeNames[Math.floor(Math.random() * sequencesTypeNames.length)];

    return await this.numbPositionSequence(sequenceTypeRndName, sequence, baseNumber, qtdMax);
  }

  /**
   *
   * @param {*} min
   * @param {*} max
   * @returns Return of random numers MAX and MIN
   */
  getRndInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   *
   * @param {*} type
   * @returns
   */
  async getRndSequences(type = 'aleatory' || 'cousins') {
    let sequenceRandom = this.sequences[Math.floor(Math.random() * this.sequences.length)];

    await this.removeNumbers([sequenceRandom]);

    if (type === 'aleatory') {
      return sequenceRandom;
    // } else if (type === 'cousins' && this.isPrime(sequenceRandom)) {
    //   return sequenceRandom;
    } else {
      return false;
    }

  }

  /**
   *
   * @param {*} num
   * @returns
   */
  isPrime(num) {
    for (let i = 2; i < num; i++)
      if (num % i === 0) {
        return false;
      }
    return num > 1;
  }

  /**
   *
   * @param {*} data
   * @returns
   */
  removeDuplicates(data) {
    return [...new Set(data)];
  }

  /**
   * Eliminate Redundancy

   * @param {*} arr1 [[1,2], [3, 4]] old sequence
   * @param {*} arr2 [1,2] next sequence
   * @returns [[3, 4]] new sequence
   */
  async eliminateArraysRedundancy(arr1, callback) {
    let duplicated = false;

    for (let item of arr1) {
      if (item.every((v, i) => v === this.data()[i])) {
        duplicated = true;
      }
    }

    callback(duplicated);
  }

  /**
   *
   * @param {*} params
   * @returns
   */
  async generateAndCleanSequences(params) {
    let rndNumbSequences = [];

    try {
      // Obtem uma ordem aleatoria
      for (const { sequenceStep, maxSequenceStep, sequenceNumPoint } of params) {

        const result = await this.generateRndNumbSequences(sequenceStep, sequenceNumPoint ? sequenceNumPoint : this.getRndInt(1, 25), maxSequenceStep);
        rndNumbSequences.push(...result);

        // console.log({ sequenceStep, maxSequenceStep, sequenceNumPoint, result });
      }

      rndNumbSequences = this.removeDuplicates(rndNumbSequences);

      await this.removeNumbers(rndNumbSequences);

      this.randoms.push(...rndNumbSequences);

      // console.log("Sem redundancia:", rndNumbSequences);

    } catch (error) {
      console.warn(error);
    }

    return rndNumbSequences;
  }


  /**
   *
   * @param {*} data [1,2,3,4,5,6,7]
   * @returns boolean
   */
   async isValidIntegritySequence(data = []) {
    let tempJumps = [];
    let countJumps = 0;
    let count = 1;

    for (let num of data) {
      // If the simulated count is equal to the current
      if (num === count) {
        count += 1; // simulated
        tempJumps.push(num); // jumps simulated
      } else {
        count = num + 1; // simulated
      }
      // reset jumps
      if (tempJumps.length > 6) {
        countJumps += 1;
        tempJumps = [];
      }
    }

    return !!countJumps;
  }

  /**
   *
   * @param {*} randoms
   * @param {*} config
   * @param {*} t1
   * @param {*} t2
   */
  async print(randoms, config, t1, t2) {
    let stream = fs.createWriteStream(`./lotos/loto-${format(new Date(), 'dd-MM-yyyy-HH-mm-ss')}.txt`);
    const timeSec = Math.ceil((t2 - t1) / 1000);

    stream.once('open', function (_) {
      stream.write('------------------------------\n');
      stream.write('| LOTO GENERATOR 1.0.0\n');
      stream.write('|-----------------------------\n');
      stream.write(`| - Números Gerados: ${randoms.length}\n`);
      stream.write(`| - Config Parâmetrizada: ${JSON.stringify(config)}\n`);
      stream.write(`| - Tempo: ${timeSec} segundos\n`);
      stream.write('------------------------------\n\n');
      for (let ln of randoms) {
        stream.write(`${ln.join(', ')}\n\n`)
      }
      stream.end();
    });

    console.log(JSON.stringify(randoms), `\n\nTempo: ${timeSec} segundos\n`);
  }

  /**
   *
   * @param {*} data
   * @returns
   */
  orderByNumberAsc(data = []){
    return data.sort(function (a, b) { return a - b; })
  }

  /**
   *
   * @returns sorteds
   */
  data() {
    return this.orderByNumberAsc(this.randoms);
  }
}
