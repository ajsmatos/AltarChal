import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

//-------------TOP LVL CODE
dotenv.config();
const port: string | undefined = process.env.PORT;
const app: Express = express();
app.use(cors());

//-------------INTERFACES
interface DataObject {
  randomChars: string[][];
  code: string;
}

//-------------FUNCTIONS

/* 
  random chars matrix generator:
  -receives: optional bias char as sting
  -returns: randomized or biased chars as string matrix 
*/
let generateArr = (bias?: string): string[][] => {
  let res: string[][] = [];
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  // generation with bias
  if(bias){
    // pupulate first an array
    let biasedCharsArr: string[] = [];
    while(biasedCharsArr.length < 100){
      // occupy firt 80 with random chars
      if(biasedCharsArr.length < 80){
        biasedCharsArr.push(chars.charAt(Math.floor(Math.random() * chars.length)));
      // occupy the rest with bias
      } else {
        biasedCharsArr.push(bias.toUpperCase());
      }  
    }
    // shuffle array
    biasedCharsArr.sort(() => Math.random() - 0.5);
    // pass array values to matrix
    for (let i = 0; i < 10; i++) {
      res[i] = [];
      for (let j = 0; j < 10; j++) {
        res[i][j] = biasedCharsArr.shift() as string;
      }
    }
  // generation without bias  
  } else {
    for (let i = 0; i < 10; i++) {
      res[i] = [];
      for (let j = 0; j < 10; j++) {
        res[i][j] = chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }
  }
  return res;
}

/* 
  code calculation:
  -receives: randomized or biased chars matrix
  -returns: calculated code as string
*/
let getCode = (randomChars: string[][]):string => {
  const secs: number = new Date().getSeconds();
  // create array with digits of fetched seconds
  const posArr: number[] = Array.from(String(secs), Number);
  // prevent single digits
  if(posArr.length === 1) posArr.unshift(0);
  
  // get coordinates
  const valueCoord1: string = randomChars[posArr[0]][posArr[1]];
  const valueCoord2: string = randomChars[posArr[1]][posArr[0]];

  // occurrences counter
  let counterCoord1: number = 0;
  let counterCoord2: number = 0;

  for(let row of randomChars){
    for(let value of row){
      if(value === valueCoord1) counterCoord1++;
      if(value === valueCoord2) counterCoord2++;
    }
  }
  
  // prevent occurrences bigger than 9
  while(counterCoord1 >= 10) {
    counterCoord1 /=2;
    counterCoord1 = Math.floor(counterCoord1);
  }

  while(counterCoord2 >= 10) {
    counterCoord2 /=2;
    counterCoord2 = Math.floor(counterCoord2);
  }

  // code generation
  const code: string = `${counterCoord1}${counterCoord2}`;
  return code;
}

//-------------ENDPOINTS
app.get('/:bias?', (req: Request, res: Response) => {
  const bias = req.params.bias;
  let randomChars!: string[][];
  if(bias){
    randomChars = generateArr(bias);
  }else{
    randomChars = generateArr();
  } 
  const code: string = getCode(randomChars);
  const dataObject: DataObject = {
    randomChars,
    code,
  }
  res.send(JSON.stringify(dataObject));
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});