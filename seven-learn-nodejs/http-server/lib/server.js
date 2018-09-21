'use strict'

let
    fs = require('fs'),
    url = require('url'),
    path = require('path'),
    http = require('http');

// 从命令行参数获取 root 目录, 默认是当前目录
let root = path.resolve(process.argv[2] || '.');

console.log('Static root dir' + root);

// 创建服务器
let server = http.createServer(function (request, response) {
    // 获取 URL 的 path
    let pathname = url.parse(request.url).pathname;
    // 获取对应本地文件路径
    let filepath = path.join(root, pathname);
    // 获取文件状态
    fs.stat(filepath, function (err, stats) {
        if (!err && stats.isFile()) {
            // 没出现错误且文件存在
            console.log('200 ' + request.url);
            // 发送200响应
            response.writeHead(200);
            // 将文件流导向 response
            fs.createReadStream(filepath).pipe(response);
        } else if (stats.isDirectory()) {
            let indexPath = path.join(root, pathname + '/index.html');
            fs.stat(indexPath, function (err, stat) {
                if (!err && stat.isFile) {
                    // 发现 index 文件
                    console.log('200 ' + indexPath);
                    // 发送200响应
                    response.writeHead(200);
                    // 将文件流导向 response
                    fs.createReadStream(indexPath).pipe(response);
                } else {
                    // 出错或文件不存在
                    console.log('404 ' + request.url);
                    // 发送404响应
                    response.writeHead(404);
                    response.end('404 Not Found');
                }
            });
        } else {
            // 出错或文件不存在
            console.log('404 ' + request.url);
            // 发送404响应
            response.writeHead(404);
            response.end('404 Not Found');
        }
    });
});

server.listen('8080');

console.log('Server is running at http://127.0.0.1:8080/')

// var http = require('http');
// // 创建一个 http server, 并传入回调函数
// var server = http.createServer(function (request, response) {
//     // 获取 HTTP 请求的 method 和 url
//     console.log('Method: ' + request.method + '\nurl: ' + request.url);
//     // 将 HTTP 响应200写入 response, 同时设置 Content-Type: text/html
//     response.writeHead(200, {'Content-Type': 'text/html'});
//     // 将 HTML 内容写入 response
//     response.end('<h1>Hello, World!</h1>');
// });

// // 让服务器监听 8080 端口
// server.listen('8080');

// console.log('Server is running at http://127.0.0.1:8080/');