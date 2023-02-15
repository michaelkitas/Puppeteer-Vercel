// const app = require("express")();
const express = require('express');
const app = express();
app.use(express.json());
// let chrome = {};
// let puppeteer;

// if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
//   chrome = require("chrome-aws-lambda");
//   puppeteer = require("puppeteer-core");
// } else {
//   puppeteer = require("puppeteer");
// }

const pharmaApollo = require('./apollo');

app.post("/api", async (req, res) => {
   const {search}  = req.body;
  //  if (!search) {
  //    return res.status(400).send({ error: 'The "search" parameter is required.' });
  //  }

   try {
    const json1 = await pharmaApollo.getApollo(search);
    res.send(json1);


//
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred while scraping the website.' });
  }





  // let options = {};

  // if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  //   options = {
  //     args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
  //     defaultViewport: chrome.defaultViewport,
  //     executablePath: await chrome.executablePath,
  //     headless: true,
  //     ignoreHTTPSErrors: true,
  //   };
  // }

  // try {
  //   let browser = await puppeteer.launch(options);

  //   let page = await browser.newPage();
  //   await page.goto("https://www.google.com");
  //   res.send(await page.title());
  // } catch (err) {
  //   console.error(err);
  //   return null;
  // }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});

module.exports = app;
