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

function draggable(dom) {
    let isPressed = false;
    let touchX = 0;
    let touchY = 0;

    dom.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isPressed = true;
            touchX = e.touches[0].clientX - dom.offsetLeft;
            touchY = e.touches[0].clientY - dom.offsetTop;
        }
    });

    dom.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1 && isPressed) {
            e.preventDefault();
            const newX = e.touches[0].clientX;
            const newY = e.touches[0].clientY;
            const dx = newX - touchX;
            const dy = newY - touchY;

            // 边界处理

            dom.style.left = dx + 'px';
            dom.style.top = dy + 'px';
        }
    });

    dom.addEventListener('touchend', (e) => {
        if (e.touches.length === 1 && isPressed) {
            isPressed = false;
        }
    });
}

draggable(img);

function scaleAble(dom) {
    /*
        根据勾股定理算距离
        最终距离 / 初始距离 = 缩放倍数
        tan算角度 = dy / dx
        反正切arctan得到弧度 Math.atan(tan)
        弧度转换成角度 h / 2*PI = J / 360 => jiaoDu = huDu * 180 / PI
    */
    let isPressed = false;
    let beginTouch1X = 0;
    let beginTouch1Y = 0;
    let beginTouch2X = 0;
    let beginTouch2Y = 0;
    // let angle = 0; // 旋转的角度
    // let scale = 1; // 缩放倍数
    let initLeft = 0;
    let initTop = 0;
    let initWidth = dom.offsetWidth;
    let initHeight = dom.offsetHeight;

    /**
     * 触摸点
     * @defType Point
     * @property {number} x
     * @property {number} y
     */
    /**
     * 获取两个点之间的距离
     * @param {Point} point1 
     * @param {Point} point2 
     * @returns 
     */
    function getDistance(point1, point2) {
        const x = point2.x - point1.x;
        const y = point2.y - point1.y;
        return Math.sqrt(x * x + y * y);
    }

    /**
     * 获取缩放倍数
     * @param {number} distance1 初始距离
     * @param {number} distance2 当前距离
     * @returns {number} 缩放倍数
     */
    function getScaleRate(distance1, distance2) {
        return distance2 / distance1;
    }

    /**
     * 获取缩放角度
     * @param {Point} point1 
     * @param {Point} point2 
     * @returns 角度
     */
    function getAngle(point1, point2) {
        /*
            tan算角度 = dy / dx
            反正切arctan得到弧度 Math.atan(tan)
            弧度转换成角度 h / 2*PI = J / 360 => jiaoDu = huDu * 180 / PI
        */
        const x = point2.x - point1.x;
        const y = point2.y - point1.y;
        if (x !== 0) {
            const tan = y / x;
            const huDu = Math.atan(tan);
            const jiaoDu = huDu * 180 / Math.PI;
            return jiaoDu;
        }
        return 0;
    }

    // dom.addEventListener('touchstart', (e) => {
    //     if (e.touches.length === 2) {
    //         isPressed = true;
    //         const [touch1, touch2] = e.touches;
    //         beginTouch1X = touch1.clientX;
    //         beginTouch1Y = touch1.clientY;
    //         beginTouch2X = touch2.clientX;
    //         beginTouch2Y = touch2.clientY;
    //         initLeft = dom.pageX;
    //         initTop = dom.pageY;
    //         initWidth = dom.offsetWidth;
    //         initHeight = dom.offsetHeight;
    //     }
    // });

    dom.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (e.touches.length !== 2) {
            return;
        }
        if (!isPressed) {
            isPressed = true;
            const [touch1, touch2] = e.touches;
            beginTouch1X = touch1.clientX;
            beginTouch1Y = touch1.clientY;
            beginTouch2X = touch2.clientX;
            beginTouch2Y = touch2.clientY;
            initLeft = dom.pageX;
            initTop = dom.pageY;
            initWidth = dom.offsetWidth;
            initHeight = dom.offsetHeight;
            return;
        } else {
            // e.preventDefault();
            const [touch1, touch2] = e.touches;
            const newTouch1X = touch1.clientX;
            const newTouch1Y = touch1.clientY;
            const newTouch2X = touch2.clientX;
            const newTouch2Y = touch2.clientY;

            const scale = getScaleRate(
                getDistance({ x: beginTouch1X, y: beginTouch1Y }, { x: beginTouch2X, y: beginTouch2Y }),
                getDistance({ x: newTouch1X, y: newTouch1Y }, { x: newTouch2X, y: newTouch2Y }),
            );
            const angle = getAngle({ x: newTouch1X, y: newTouch1Y }, { x: newTouch2X, y: newTouch2Y }) -
                getAngle({ x: beginTouch1X, y: beginTouch1Y }, { x: beginTouch2X, y: beginTouch2Y });

            // 边界处理
            // msg.innerHTML = `scale: ${scale};${initWidth - initWidth * scale / 2}`
            dom.style.left = initWidth - initWidth * scale / 2 + 'px';
            dom.style.top = initHeight - initHeight * scale / 2 + 'px';
            dom.style.width = initWidth * scale + 'px';
            dom.style.height = initHeight * scale + 'px';
            dom.style.transform = `rotate(${angle}deg)`;
            // dom.style.zoom = scale;
        }
    });

    dom.addEventListener('touchend', (e) => {
        isPressed = false;
    });
}

scaleAble(img);
