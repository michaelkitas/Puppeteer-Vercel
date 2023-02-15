let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    chrome = require("chrome-aws-lambda");
    puppeteer = require("puppeteer-core");
  } else {
    puppeteer = require("puppeteer");
  }


const two =  async(search) =>{
  let options = {};

  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    };
  }

  try {
    let browser = await puppeteer.launch(options);

    let page = await browser.newPage();
    await page.goto(`https://www.1mg.com/search/all?name=${search}`);
    
    
    const data = await page.evaluate(() => {
        // Select the elements you want to extract
        // NAME.......................................................
        const firstname =  Array.from(document.querySelectorAll(".style__pro-title___3G3rr")).map(
        (x) => x.textContent);
        const mrp = Array.from(document.querySelectorAll(".style__discount-price___qlNIB")).map(
        (x) => x.textContent);
        const imagelist = Array.from(document.querySelectorAll(".style__product-image___1bkgA")).map(x => {
            const img = x.querySelector("img");
            if (!img) return ""; // or return a default image URL
            return img.src;
        });
        const linklist = Array.from(document.querySelectorAll(".style__product-box___3oEU6")).map(x => {
            const a = x.querySelector("a");
            if (!a) return ""; // or return a default image URL
            return a.href;
        });
        const pricelist = Array.from(document.querySelectorAll(".style__price-tag___KzOkY")).map(
            (x) => x.textContent
        );
        const secondname = Array.from(document.querySelectorAll(".style__pack-size___3jScl")).map(
            (x) => x.textContent
          );
                
                
                
                

    let fname= new Array(firstname.length);
    for (let i = 0; i < firstname.length; i++) {
      fname[i]="";
    }
    for (let i = 0; i < firstname.length; i++) {
      firstname[i] = firstname[i].replace(/(  |\n)/gm, "");
      fname[i]= firstname[i];
    }

    for (let i = 0; i < secondname.length; i++) {
      secondname[i] = secondname[i].replace(/(  |\n)/gm, "");
    }
// PRICE.......................................................
    for (let i = 0; i < mrp.length; i++) {
      mrp[i] = mrp[i].replace(/(  |\n)/gm, "");
    }
    for (let i = 0; i < pricelist.length; i++) {
      pricelist[i] = pricelist[i].replace(/(  |\n)/gm, "");
    }

// IMAGE.......................................................


// LINK.......................................................

for (let i = 0; i < 5; i++) {
  // if (imagelist[i] === "") continue; // skip empty image URLs
  const netmeds = { index: i, image: "" };
  netmeds.image = imagelist[i];
}
const pharmas = [];
for (let i = 0; i < 30; i++) {
  // if (imagelist[i] === "") continue; // skip empty image URLs
  const netmeds = { index: i,name:"",actualPrice:"",mrp:"",image: "" ,link:""};
  const space=" ";
  if(mrp[i]!=null){
  netmeds.name = fname[i]+space+secondname[i];
  netmeds.actualPrice = pricelist[i].slice(1);
  netmeds.mrp = mrp[i].slice(1);
  netmeds.image = imagelist[i];
  netmeds.link = linklist[i];
  }
  pharmas.push(netmeds);
}

return pharmas;
});
// console.log(search)
await page.close();
      await browser.close();
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
}

const getOneMg = (e) => {
    return two(e);}

module.exports = { getOneMg};