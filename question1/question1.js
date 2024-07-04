const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const windowSize = 10;
let numberWindow = [];

app.get('/numbers/:numberid', async (req, res) => {
    const numberId = req.params.numberid;
    let actualID;
    switch (numberId) {
        case 'p':
            actualID = `primes`;
            break;
        case 'e':
            actualID = `even`;
            break;
        case 'f':
            actualID = `fibo`;
            break;
        case 'r':
            actualID = `rand`;
            break;
        
        
        default:
            res.status(400).send('Invalid number ID');
            break;
    }
    const apiUrl = `http://20.244.56.144/test/${actualID}`;

    try {
        const response = await axios.get(apiUrl, { timeout: 500 });
        const numbers = response.data;

        const prevState = [...numberWindow];

        numbers.forEach(number => {
            if (!numberWindow.includes(number)) {
                if (numberWindow.length >= windowSize) {
                    numberWindow.shift();
                }
                numberWindow.push(number);
            }
        });

        const avg = numberWindow.length >= windowSize ? (numberWindow.reduce((a, b) => a + b, 0) / windowSize).toFixed(2) : null;

        res.json({
            windowPrevState: prevState,
            windowCurrState: numberWindow,
            numbers: numbers,
            avg: avg
        });
    } catch (error) {
        res.status(500).send('Error fetching numbers');
    }
});

app.listen(port, () => {
    console.log(`Average Calculator microservice running on port ${port}`);
});