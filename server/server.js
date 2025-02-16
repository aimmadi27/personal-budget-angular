const express=require('express');
const app=express();
const port=3000;
const cors = require('cors');
const path=require('path');
const fs=require('fs');

app.use(cors());
app.use(express.json());
app.use('/', express.static('public'));

const budget= {
    myBudget: [
    {
        title: 'Eat out',
        budget: 200
    },
    {
        title: 'Rent',
        budget: 410
    },
    {
        title: 'Grocery',
        budget: 150
    },
     ]
};

app.get('/hello', (req, res) => {
    res.send('Hello World!')
});

app.get('/budget', (req, res) => {
    const filePath = path.join(__dirname, 'budget.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading budget.json:", err);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }

        try {
            const budgetData = JSON.parse(data);
            res.json(budgetData);
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            res.status(500).json({ error: "Invalid JSON format" });
        }
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
