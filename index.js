const express = require('express');
const app = express();
app.use(express.json());

// cors plolicy
var cors = require('cors');
app.use(cors());


const pharmaApollo = require('./apollo');


app.post("/api", async (req, res) => {
   const {search}  = req.body;
   if (!search) {
     return res.status(400).send({ error: 'The "search" parameter is required.' });
   }

   try {
    const json1 = await pharmaApollo.getApollo(search);
    res.send(json1);


//
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred while scraping the website.' });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});

module.exports = app;
