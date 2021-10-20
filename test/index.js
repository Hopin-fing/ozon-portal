const test = async () =>{
    const fs = require('fs');
    const file = require("./result.json");
    let testFile

    console.log(file)

// json data
    var jsonData = '[2]';

// parse json
    var jsonObj = JSON.parse(jsonData);

// stringify JSON Object
    var jsonContent = JSON.stringify(jsonObj);


    // fs.writeFile('result.json', jsonContent, err => {
    //     if (err) {
    //         console.error(err)
    //         return
    //     }
    //
    //     console.error("file written successfully")
    //     //file written successfully
    // })


    try {
        fs.writeFileSync('result.json', jsonContent)
        testFile = fs.readFileSync('result.json', 'utf8')
    } catch (err) {
        console.error(err)
    }

    console.log("testFile ---", testFile)
}

test()