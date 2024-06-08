const { error } = require('console');
const fs = require('fs');
const connect = require('../app/control/connect');
const { exec } = require('child_process');

exec(
  'npx json-server --watch db.json --port 5000',
  (error1, stdout1, stderr1) => {
    if (error1) {
      console.error(`Error executing json-server: ${error1.message}`);
      return;
    }

    // Chỉ khi json-server đã chạy thành công mới chạy nodemon
    exec('npx nodemon --inspect src/index.js', (error2, stdout2, stderr2) => {
      if (error2) {
        console.error(`Error executing nodemon: ${error2.message}`);
        return;
      }
    });
  }
);

function queryData(query) {
  return new Promise((resolve, reject) => {
    connect.query(query, (err, res) => {
      if (err) {
        reject(err);
        console.log(err);
      } else {
        resolve(res);
      }
    });
  });
}
async function input(query, object) {
  const res = await queryData(query);
  console.log(typeof res);
  console.log(res);
  let combine = '';
  const obj = {};
  try {
    obj[object] = res;
    const jsonData = JSON.stringify(obj);
    const data = await fs.promises.readFile(
      'D:/studyonweb/json_server/db.json',
      'utf8'
    );

    let existingData = {};
    if (data) {
      existingData = JSON.parse(data);
      combine = data.slice(0, -1) + ',' + jsonData.slice(1);
    } else {
      combine = jsonData;
    }
    const existingPosts = existingData[object];

    // Kiểm tra nếu dữ liệu mới khác dữ liệu hiện có
    if (!isDataEqual(existingPosts, res)) {
      await fs.promises.writeFile('D:/studyonweb/json_server/db.json', combine);
    } else {
      console.log('Du lieu trung lap. Khong ghi vao db.json');
    }
  } catch (error) {
    console.log(error);
    // Xử lý lỗi nếu có
  }
  return obj;
}
async function listData() {
  try {
    await connect.connect();
    await input('select * from product', 'product');
    await input('select * from brand', 'brand');
    connect.end();
  } catch (err) {
    console.log(err);
  }
}

function isDataEqual(data1, data2) {
  // So sánh dữ liệu ở đây, trả về true nếu bằng nhau, ngược lại trả về false
  // Đây chỉ là một ví dụ đơn giản, bạn có thể tuỳ chỉnh hàm này phù hợp với yêu cầu của mình
  return JSON.stringify(data1) === JSON.stringify(data2);
}
listData();
