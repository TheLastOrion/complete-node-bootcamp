const fs = require('fs');
const superagent = require('superagent');

const readFilePro = file => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) =>
        {
            if(err) reject(' could not find that file!');
            resolve(data);
        })
    })
}
const writeFilePro = (file, data) =>
{
    return new Promise((resolve, reject) =>
    {
        fs.writeFile(file, data, err =>
        {
            if (err) reject('Could not write file!');
            resolve("Success!");
        })
    })
}
// readFilePro(`${__dirname}/dog.txt`)
//     .then(data => {
//
//     console.log(`Breed: ${data}`);
//
//     return superagent
//         .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     })
//     .then(res => {
//         console.log(res.body.message);
//         return writeFilePro('dog-img.txt', res.body.message);
//     })
//     .then(()=>{
//         console.log('Random dog image saved to file!');
//
//     })
//     .catch(err => {
//         return console.log(err.message);
//
// })

const getDogPic = async () => {
    try {

        const data = await readFilePro(`${__dirname}/dog.txt`);
        console.log(`Breed: ${data}`);

        const res1pro = await superagent
            .get(`https://dog.ceo/api/breed/${data}/images/random`);
        const res2pro = await superagent
            .get(`https://dog.ceo/api/breed/${data}/images/random`);
        const res3pro = await superagent
            .get(`https://dog.ceo/api/breed/${data}/images/random`);

        const all = await Promise.all([res1pro, res2pro, res3pro]);
        console.log(all);

        const imgs = all.map(el => el.body.message)
        console.log(imgs);
        //console.log(res.body.message);

        await writeFilePro('dog-img.txt', imgs.join('\n'));
        console.log('Random dog image saved to file!');
        return '2: READY!';

    }
    catch(err)
    {
        console.log(err.message);
        throw err;
    }
}
(async () => {
    try{
        console.log('1: Will get dog pics!')
        const x = await getDogPic();
        console.log(x);
        console.log('3: Done getting dog pics!');
    }
    catch(err)
    {
        console.log('ERROR!!');
    }
})();

// console.log('1: Will get dog pics!');
// getDogPic().then(x => {
//     console.log(x);
//     console.log('3: Done getting dog pics!');
// }).catch(err => {
//     console.log("ERROR!");
// });