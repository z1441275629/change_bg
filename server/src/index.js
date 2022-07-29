var http = require("http");

var server = http.createServer();

var request = require("request");

let tokenData = null; // 百度的token信息
// {
//     "refresh_token": "25.abec1b63485967b35f46f085c86b37dd.315360000.1974021055.282335-26787051",
//     "expires_in": 2592000,
//     "session_key": "9mzdCXV4JDIGxt5e+pj3P9bp6FVCOHxFEQk2BWdQrH0goYR6Kssrn1m2ZYiyp5nLxB+JOn\/carJhwGwwMuSdv7mUWqt8gA==",
//     "access_token": "24.2c3f02783d9a12b6c7c8bb5dd5663bc3.2592000.1661253055.282335-26787051",
//     "scope": "public brain_all_scope brain_body_analysis brain_body_attr brain_body_number brain_driver_behavior brain_body_seg brain_gesture_detect brain_body_tracking brain_hand_analysis wise_adapt lebo_resource_base lightservice_public hetu_basic lightcms_map_poi kaidian_kaidian ApsMisTest_Test\u6743\u9650 vis-classify_flower lpq_\u5f00\u653e cop_helloScope ApsMis_fangdi_permission smartapp_snsapi_base smartapp_mapp_dev_manage iop_autocar oauth_tp_app smartapp_smart_game_openapi oauth_sessionkey smartapp_swanid_verify smartapp_opensource_openapi smartapp_opensource_recapi fake_face_detect_\u5f00\u653eScope vis-ocr_\u865a\u62df\u4eba\u7269\u52a9\u7406 idl-video_\u865a\u62df\u4eba\u7269\u52a9\u7406 smartapp_component smartapp_search_plugin avatar_video_test b2b_tp_openapi b2b_tp_openapi_online smartapp_gov_aladin_to_xcx",
//     "session_secret": "b91f95e3b34c665fe3aa512b4ba56a71"
// }

// server.all("*", function(req,res,next){
//     //设置允许跨域的域名，*代表允许任意域名跨域
//     res.header("Access-Control-Allow-Origin","*");
//     //允许的header类型
//     res.header("Access-Control-Allow-Headers", "content-type");
//     //跨域允许的请求方式
//     res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
// });

function getToken() {
  return new Promise((resolve, reject) => {
    // var url="https://aip.baidubce.com/oauth/2.0/token";
    var url =
      "https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=4dRVEAdtk4yk2kreiKQGwmIp&client_secret=NiKQHLZvekRExyO2AFirSEhsWrIUgal9";
    var requestData = {
      grant_type: "client_credentials",
      client_id: "4dRVEAdtk4yk2kreiKQGwmIp",
      client_secret: "NiKQHLZvekRExyO2AFirSEhsWrIUgal9",
    };
    request(
      {
        url,
        // method: "POST",
        method: "GET",
        // json: true,
        // headers: {
        //     "content-type": "application/json",
        // },
        body: JSON.stringify(requestData),
        // params: requestData
      },
      function (error, response, body) {
        console.log(error);
        console.log(response.body);
        // {"error":"unsupported_grant_type","error_description":"The authorization grant type is not supported"}

        if (!error && response.statusCode == 200) {
          console.log(body); // 请求成功的处理逻辑
          tokenData = JSON.parse(body);
          setTimeout(() => {
            tokenData = null;
          }, tokenData.expires_in - 2000);
          resolve(body);
        } else {
          reject(error);
        }
      }
    );
  });
}

function getPerson(image) {
  return new Promise((resolve, reject) => {
    var url = "https://aip.baidubce.com/rest/2.0/image-classify/v1/body_seg?access_token=" + tokenData.access_token;
    var requestData = {
      image: image, // urlencode(imgBase64)
      type: "foreground",
    };
    request(
      {
        url,
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
        form: requestData,
      },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          // console.log(body) // 请求成功的处理逻辑
          resolve(body);
        } else {
          reject(error);
        }
      }
    );
  });
}

/**
 * 获取图片对应的卡通图案
 * @param {string} image 图片base64信息
 * @param {string} access_token token信息
 * @returns {Promise<string>}
 */
function toCartoon(image, type) {
  /*
        cartoon：卡通画风格
        pencil：铅笔风格
        color_pencil：彩色铅笔画风格
        warm：彩色糖块油画风格
        wave：神奈川冲浪里油画风格
        lavender：薰衣草油画风格
        mononoke：奇异油画风格
        scream：呐喊油画风格
        gothic：哥特油画风格
    */
  return new Promise((resolve, reject) => {
    var url = "https://aip.baidubce.com/rest/2.0/image-process/v1/style_trans?access_token=" + tokenData.access_token;
    var requestData = {
      image, // urlencode(imgBase64)
      option: type || "cartoon",
    };
    request(
      {
        url,
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
        form: requestData,
      },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          resolve(body);
        } else {
          reject(error);
        }
      }
    );
  });
}

// 当客户端请求过来，就会自动触发服务器的request请求事件，
// 然后执行第二个参数：回调函数
// 回调函数里面有两个参数‘request’；‘response’
// request：请求对象，可以用来获取客户端的一些请求信息，比如请求路径
// request.url：获取请求路径,比如http://127.0.0.1:3000/a/b === /a/b

// response：响应对象，可以用来给客户端发送响应消息
// response.write('我是发送到客户端的数据')
server.on("request", async function (request, response) {
  console.log("收到客户端的请求了,请求路径是：" + request.url);
  //设置允许跨域的域名，*代表允许任意域名跨域
  response.setHeader("Access-Control-Allow-Origin", "*");
  //允许的header类型
  response.setHeader("Access-Control-Allow-Headers", "content-type");
  //跨域允许的请求方式
  response.setHeader("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");

  try {
    if (request.url === "/api/token") {
      getToken()
        .then((res) => {
          response.write(res);
        })
        .catch((err) => {
          console.log(err);
          response.write(err);
        })
        .finally(() => {
          console.log("token接口已响应");
          response.end();
        });
    } else if (request.url === "/api/getPerson") {
      if (!tokenData) {
        await getToken();
      }
      let inputData = "";
      request.on("data", (postData) => {
        // 注意 postData 是一个Buffer类型的数据，也就是post请求的数据存到了缓冲区
        inputData += postData;
      });
      request.on("end", async () => {
        try {
          // 先取人物，后转卡通: 除了人物以外的内容又显示了
          // const data = JSON.parse(inputData.toString());
          // const res = await getPerson(data.image);
          // const resJson = JSON.parse(res);
          // if (resJson.foreground) {
          //     const cartoon = await toCartoon(resJson.foreground);
          //     const responseData = {
          //         foreground: resJson.foreground,
          //         ...JSON.parse(cartoon),
          //     }
          //     response.write(JSON.stringify(responseData));
          //     response.end();
          //     return;
          // }
          // 先转卡通，后取人物
          const data = JSON.parse(inputData.toString());
          if (data.type) {
            const res = await toCartoon(data.image, data.type);
            const resJson = JSON.parse(res);
            if (resJson.image) {
              const cartoon = await getPerson(resJson.image);
              const responseData = {
                // cartoon: resJson.image,
                person: JSON.parse(cartoon),
              };
              response.write(JSON.stringify(responseData));
              console.log("人体分割接口已响应");
              response.end();
              return;
            }
            response.write(res);
            console.log("卡通图案接口已响应");
            response.end();
          } else {
            if (data.image) {
              const cartoon = await getPerson(data.image);
              const responseData = {
                // cartoon: null,
                person: JSON.parse(cartoon),
              };
              response.write(JSON.stringify(responseData));
              console.log("人体分割接口已响应");
              response.end();
              return;
            }
            response.write(res);
            console.log("卡通图案接口已响应");
            response.end();
          }
        } catch (err) {
          console.log(err);
          response.end(err && err.message);
        }
      });
    } else {
      response.end();
    }
  } catch (err) {
    console.log(err);
    response.end("something wrong");
  }
});

server.listen(3000, function () {
  console.log("服务器启动成功");
  // 当服务器启动成功后就可以通过http://127.0.0.1:3000/进行访问
});
