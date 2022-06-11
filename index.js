const http = require('http');
const fs = require('fs');
const { type } = require('os');
const url = require('url');
const replaceTempalte = require('./modules/replaceTemplate');



const tempOverview = fs.readFileSync(`${__dirname}/templates/overviewTemp.html`, 'utf-8');
const cardTemp = fs.readFileSync(`${__dirname}/templates/cardTemplate.html`, 'utf-8');
const productTemp = fs.readFileSync(`${__dirname}/templates/productTemplate.html`, 'utf-8');


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req,res)=>{
    
    const {query, pathname} = url.parse(req.url,true);

    if (pathname === '/' || pathname === '/overview')
    {
        res.writeHead(200, {
            'content-type': 'text/html'
        })
        const cardHtml = dataObj.map(elemn => replaceTempalte(cardTemp,elemn)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml)
        res.end(output);
    } 
    else if (pathname === '/notes')
    {
       const product = dataObj[query.id]
       const output = replaceTempalte(productTemp, product);
       res.end(output);
    } 
    else if (pathname === '/api')
    {
        res.writeHead(200, {
            "content-type" : 'application/json'
        });
        res.end(data);
    }
    else
    {
    res.writeHead(404, {
        "content-type" : 'text/html',
        'my-own-header' : 'utsav-hello-world'
    });
    
    res.end('<h1>Page Not Found!</h1>');
    }
}

);


server.listen(8000, ()=>{
    console.log("Your server available at http://localhost:8000");
});