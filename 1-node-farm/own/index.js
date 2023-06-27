const fs = require('fs')
const http = require('http');
const url = require ('url');
const path = require("path");
const querystring = require('querystring');

////////////////////////////////

// FILES

// Blocking, synchronous way.

// const textIn = fs.readFileSync('../starter/txt/input.txt', 'utf-8');
// console.log(textIn);
//
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./output.txt', textOut);
// console.log('File Written!');

// Non-Blocking, asynchronous way.

// fs.readFile('../starter/txt/start.txt', 'utf-8' ,(err, data1) =>
//     {
//         if(err)
//             return console.log('ERROR! 💥');
//         fs.readFile(`../starter/txt/${data1}.txt`, 'utf-8', (err, data2) =>
//         {
//             console.log(data2);
//             fs.readFile(`../starter/txt/append.txt`, 'utf-8', (err, data3) =>
//             {
//                 console.log(data3);
//                 fs.writeFile('./final.txt', `${data2}\n${data3}`, "utf-8", err1 => {
//                     console.log('Your file has been written 😂');
//                 })
//             })
//         })
//     })
//
// console.log('Will read file!');

// Before ES6, callback functions are like:

// function (err, data1) {}


////////////////////////////////

//SERVER
const replaceTemplate = (temp, product) =>
{
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName)
    output = output.replace(/{%IMAGE%}/g, product.image)
    output = output.replace(/{%PRICE%}/g, product.price)
    output = output.replace(/{%FROM%}/g, product.from)
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
    output = output.replace(/{%QUANTITY%}/g, product.quantity)
    output = output.replace(/{%DESCRIPTION%}/g, product.description)
    output = output.replace(/{%ID%}/g, product.id)
    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

    return output;
}

const data = fs.readFileSync(`${__dirname}/../starter/dev-data/data.json`, 'utf-8');
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {

    const baseURL = `http://${req.headers.host}`;
    const myURL = new URL(req.url, baseURL);

    const pathName = myURL.pathname;
    // const query = myURL.searchParams.get('id')
    const queryID = myURL.searchParams.get('id');

    //console.log(baseURL+req.url    );
    //console.log(myURL.pathname);
    // const pathName = myURL.pathname;
    // const query = myURL.search;
     console.log(`baseURL: ${baseURL}\nmyUrl: ${myURL}\npathName: ${pathName}\nquery: ${queryID}`)
    // Overview page
    if(pathName === '/' || pathName ===  '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'});
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('%PRODUCT_CARDS%', cardsHtml);
        console.log(cardsHtml);
        // res.end(tempOverview);
        res.end(output);
    }

    // Product page
    else if(pathName === '/product')
    {
        res.writeHead(200, {'Content-type': 'text/html'});

        const product = dataObj[queryID];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
        // res.end('This is the PRODUCT');

    }

    // API
    else if(pathName === '/api')
    {
        // fs.readFile(`${__dirname}/../starter/dev-data/data.json`, 'utf-8', (err, data) => {
        //     const productData = JSON.parse(data);
            res.writeHead(200, {'Content-type': 'application/json'});
            // console.log(dataObj);

            res.end(data);

        // });

    }
    else
    {

        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('Page not found!');
    }


    //res.end('Hello from the server!');
});


server.listen(8000, '127.0.0.1', ()=> {
    console.log('Listening to requests on port 8000');
});