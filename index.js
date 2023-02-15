const express = require('express');
const app = express();
app.use(express.json());
const fuzz= require('fuzzball');

// cors plolicy
var cors = require('cors');
app.use(cors());


const pharmaApollo = require('./apollo');
const pharmaOneMg = require('./onemg');
const PharmaPharmeasy = require('./pharmeasy');
const pharmaNetmeds = require('./netmeds');

app.post("/api", async (req, res) => {
   const {search}  = req.body;
   if (!search) {
     return res.status(400).send({ error: 'The "search" parameter is required.' });
   }

   try {
    // const json1 = await pharmaApollo.getApollo(search);
    // const json2 = await pharmaOneMg.getOneMg(search);
    // const json3 = await PharmaPharmeasy.getPharmeasy(search);
    // const json4 = await pharmaNetmeds.getNetmeds(search);

    const [json1,json2,json3,json4] = await Promise.all([
      pharmaApollo.getApollo(search),
      pharmaOneMg.getOneMg(search),
      // PharmaPharmeasy.getPharmeasy(search),
      // pharmaNetmeds.getNetmeds(search)
    ]);


// //

        const medicanApi1=[];
        // const medicanApi2=[];
        // const medicanApi3=[]; 
        let nameScore=-1;
        let mrpScore=-1;
        let x=0;
        for (let i = 0; i < 30; i++) {
            const data = { index: i, name:"",mrp:"" ,apolloPrice:"",oneMgPrice:"",pharmeasyPrice:"", netmedsPrice: "",image: "" ,apolloLink:"",oneMgLink:"",pharmeasyLink:"", netmedsLink: ""};
            for (let j = 0; j < 30; j++) {
                nameScore = fuzz.token_set_ratio(json1[i].name, json2[j].name);
                mrpScore = fuzz.token_set_ratio(json1[i].mrp, json2[j].mrp);
                if(nameScore>50 && mrpScore==100){
                    // console.log(json1[i].name +"||"+json2[j].name+"||"+nameScore+"||"+mrpScore);
                    data.name = json1[i].name;
                    data.mrp = json1[i].mrp;
                    data.apolloPrice = json1[i].actualPrice;
                    data.oneMgPrice = json2[j].actualPrice;
                    data.image = json1[i].image;
                    data.apolloLink = json1[i].link;
                    data.oneMgLink = json2[j].link;
                }else{
                    x++;
                }
            }
        medicanApi1.push(data);
        }
        
        // between medicanAp1 and pharmeasy
        // for (let i = 0; i < 30; i++) {
        //     const data = { index: i, name:"",mrp:"" ,apolloPrice:"",oneMgPrice:"",pharmeasyPrice:"", netmedsPrice: "",image: ""  ,apolloLink:"",oneMgLink:"",pharmeasyLink:"", netmedsLink: ""};
        //     for (let j = 0; j < 30; j++) {
        //         nameScore = fuzz.token_set_ratio(medicanApi1[i].name, json3[j].name);
        //         mrpScore = fuzz.token_set_ratio(medicanApi1[i].mrp, json3[j].mrp);
        //         data.name = medicanApi1[i].name;
        //         data.mrp = medicanApi1[i].mrp;
        //         data.apolloPrice = medicanApi1[i].apolloPrice;
        //         data.oneMgPrice = medicanApi1[i].oneMgPrice;
        //         data.apolloLink = medicanApi1[i].apolloLink;
        //         data.oneMgLink = medicanApi1[i].oneMgLink;
        //         data.image = medicanApi1[i].image;
        //         if(nameScore>50 && mrpScore==100){
        //             // console.log(medicanApi1[i].name +"||"+json3[j].name+"||"+nameScore+"||"+mrpScore);
        //             data.pharmeasyPrice = json3[j].actualPrice;
        //             data.pharmeasyLink = json3[j].link;
        //             break;
        //         }else{
        //             data.pharmeasyPrice =0;
                    
        //             x++;
        //         }
        //     }
        //     medicanApi2.push(data);
        // }
        
        // // between medicanApi2 and netmeds
        // for (let i = 0; i < 30; i++) {
        //     const data = { index: i, name:"",mrp:"" ,apolloPrice:"",oneMgPrice:"",pharmeasyPrice:"", netmedsPrice: "",apolloLink:"",oneMgLink:"",pharmeasyLink:"", netmedsLink: "",image: ""  };
        //     for (let j = 0; j < 30; j++) {
        //         nameScore = fuzz.token_set_ratio(medicanApi2[i].name, json4[j].name);
        //         mrpScore = fuzz.token_set_ratio(medicanApi2[i].mrp, json4[j].mrp);
        //         data.name = medicanApi2[i].name;
        //         data.mrp = medicanApi2[i].mrp;
        //         data.apolloPrice = medicanApi2[i].apolloPrice;
        //         data.oneMgPrice = medicanApi2[i].oneMgPrice;
        //         data.pharmeasyPrice = medicanApi2[i].pharmeasyPrice;
        //         data.apolloLink = medicanApi2[i].apolloLink;
        //         data.oneMgLink = medicanApi2[i].oneMgLink;
        //         data.pharmeasyLink = medicanApi2[i].pharmeasyLink;
        //         data.image = medicanApi2[i].image;
        //         if(nameScore>50 && mrpScore==100){
        //             // console.log(medicanApi2[i].name +"||"+json4[j].name+"||"+nameScore+"||"+mrpScore);
        //             data.netmedsPrice = json4[j].actualPrice;
        //             data.netmedsLink = json4[j].link;
        //             break;
        //         }else{        
        //     data.netmedsPrice =0;
        //     x++;
        //         }
        //     }
        //     medicanApi3.push(data);
        // }
        const filterData = medicanApi1.filter((item) => item.mrp !== '');
        // console.log(filterData);
        res.send(filterData);
    // res.send(json4);


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
