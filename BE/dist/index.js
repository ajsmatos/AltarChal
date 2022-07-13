"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
//-------------TOP LVL CODE
dotenv_1.default.config();
const port = process.env.PORT;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
//-------------FUNCTIONS
/*
  random chars matrix generator:
  -receives: optional bias char as sting
  -returns: randomized or biased chars as string matrix
*/
let generateArr = (bias) => {
    let res = [];
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    // generation with bias
    if (bias) {
        // pupulate first an array
        let biasedCharsArr = [];
        while (biasedCharsArr.length < 100) {
            // occupy firt 80 with random chars
            if (biasedCharsArr.length < 80) {
                biasedCharsArr.push(chars.charAt(Math.floor(Math.random() * chars.length)));
                // occupy the rest with bias
            }
            else {
                biasedCharsArr.push(bias.toUpperCase());
            }
        }
        // shuffle array
        biasedCharsArr.sort(() => Math.random() - 0.5);
        // pass array values to matrix
        for (let i = 0; i < 10; i++) {
            res[i] = [];
            for (let j = 0; j < 10; j++) {
                res[i][j] = biasedCharsArr.shift();
            }
        }
        // generation without bias  
    }
    else {
        for (let i = 0; i < 10; i++) {
            res[i] = [];
            for (let j = 0; j < 10; j++) {
                res[i][j] = chars.charAt(Math.floor(Math.random() * chars.length));
            }
        }
    }
    return res;
};
/*
  code calculation:
  -receives: randomized or biased chars matrix
  -returns: calculated code as string
*/
let getCode = (randomChars) => {
    const secs = new Date().getSeconds();
    // create array with digits of fetched seconds
    const posArr = Array.from(String(secs), Number);
    // prevent single digits
    if (posArr.length === 1)
        posArr.unshift(0);
    // get coordinates
    const valueCoord1 = randomChars[posArr[0]][posArr[1]];
    const valueCoord2 = randomChars[posArr[1]][posArr[0]];
    // occurrences counter
    let counterCoord1 = 0;
    let counterCoord2 = 0;
    for (let row of randomChars) {
        for (let value of row) {
            if (value === valueCoord1)
                counterCoord1++;
            if (value === valueCoord2)
                counterCoord2++;
        }
    }
    // prevent occurrences bigger than 9
    while (counterCoord1 >= 10) {
        counterCoord1 /= 2;
        counterCoord1 = Math.floor(counterCoord1);
    }
    while (counterCoord2 >= 10) {
        counterCoord2 /= 2;
        counterCoord2 = Math.floor(counterCoord2);
    }
    // code generation
    const code = `${counterCoord1}${counterCoord2}`;
    return code;
};
//-------------ENDPOINTS
app.get('/:bias?', (req, res) => {
    const bias = req.params.bias;
    let randomChars;
    if (bias) {
        randomChars = generateArr(bias);
    }
    else {
        randomChars = generateArr();
    }
    const code = getCode(randomChars);
    const dataObject = {
        randomChars,
        code,
    };
    res.send(JSON.stringify(dataObject));
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
