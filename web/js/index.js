// const { encode } = require("querystring");

const apiHost = 'http://localhost:3000';

function ajax() {

}

// function getToken () {
//     fetch('https://aip.baidubce.com/oauth/2.0/token', {
//         // url: 'https://aip.baidubce.com/oauth/2.0/token',
//         method: "post",
//         data: {
//             grant_type: 'client_credentials',
//             client_id: '4dRVEAdtk4yk2kreiKQGwmIp',
//             client_secret: 'NiKQHLZvekRExyO2AFirSEhsWrIUgal9',
//         }
//     }).then(res => {
//         console.log(res);
//     });
// }

// getToken();

function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            resolve(e.target.result);
        };
        // readAsDataURL
        fileReader.readAsDataURL(blob);
        fileReader.onerror = () => {
            reject(new Error('blobToBase64 error'));
        };
    });
}

getPerson.onclick = async function () {
    // 判空
    // 大小判断
    const image = await blobToBase64(file.files[0]);
    console.log(image.split(',')[1]);
    const data = {
        image: encodeURI(image.split(',')[1]),
    }
    console.log(JSON.parse(JSON.stringify(data)));
    // return
    fetch(apiHost + '/getPerson', {
        method: "POST",
        body: JSON.stringify(data)
    }).then(response => {
        console.log(response);
        response.json().then(data => {
            console.log(data);
            img.src = 'data:image/png;base64,' + data.foreground;
        });
        
    });
}