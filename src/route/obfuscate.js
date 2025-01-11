const fs = require("fs");
const path = require("path");
const inputPath = path.join(__dirname, "../route/");
const JavaScriptObfuscator = require("javascript-obfuscator");

const inputFilePath = inputPath + "home.js"; // Đường dẫn tới mã gốc
const outputFilePath = inputPath + "home2.js"; // Đường dẫn lưu mã đã làm rối

const originalCode = fs.readFileSync(inputFilePath, "utf8");

const obfuscatedCode = JavaScriptObfuscator.obfuscate(originalCode, {
  compact: true,
  controlFlowFlattening: true,
}).getObfuscatedCode();

fs.writeFileSync(outputFilePath, obfuscatedCode);
console.log("Mã JavaScript đã được làm rối và lưu tại:", outputFilePath);
