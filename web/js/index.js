// const { encode } = require("querystring");

const apiHost = 'http://192.168.144.38:3000';

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

// getPerson.onclick = async function () {
    file.onchange = async function () {
    // 判空
    if (!file.files || !file.files[0]) {
        return;
    }
    // 大小判断
    if (file.files[0].size > 2 * 1024 * 1024) {
        alert('图片不能超过2M');
    }
    const image = await blobToBase64(file.files[0]);
    // console.log(image.split(',')[1]);
    const data = {
        image: encodeURI(image.split(',')[1]),
        type: type.value
    }
    // return
    fetch(apiHost + '/getPerson', {
        method: "POST",
        body: JSON.stringify(data)
    }).then(response => {
        console.log(response);
        response.json().then(data => {
            console.log(data);
            if (data.person && data.person.foreground) {
                img.src = 'data:image/png;base64,' + data.person.foreground;
            }
            // cartoon.src = 'data:image/png;base64,' + data.cartoon;
        });
    }).catch((err) => {
        alert('出错了：' + err.message);
    });
}