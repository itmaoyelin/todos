const express = require('express');//导入express模块

const app = express(); //创建服务器

const path = require('path');//导入path 路径处理模块

const db=require('./db/index')//导入数据库


//静态资源访问服务功能
app.use(express.static(path.join(__dirname, 'public')));//通过path.join方法路径拼接
//__dirname 表示当前文件所处目录

//导入body-parser 解析器中间件
const bodyParser = require('body-parser');

// 解析 application/x-www-form-urlencoded 格式数据
app.use(bodyParser.urlencoded({ extended: false }));
//解析 application/json 格式数据
app.use(bodyParser.json());

const cors = require('cors');//导入cors中间件
//在路由之前,配置cors中间件，从而解决跨域问题
app.use(cors());

//创建路由
app.get('/api', (req, res) => {
    res.send('ok');
});

//todo任务路由
app.get('/task', (req, res) => {
    // res.send('OK');
    const sql = `select * from todotask `;
    db.query(sql, (err, results) => { 
        if (err) return res.send(err);
        if (results.length == 0) return res.send([]);
        return res.send(results);
    });
});
//todo任务分类路由
app.get('/tasksort', (req, res) => {
    // res.send('OK');
    const sql = `select * from todotask where completed=?`;
    db.query(sql,req.query.completed, (err, results) => { 
        if (err) return res.send(err);
        // if (results.length == 0) return res.send('没有任务!');
        return res.send(results);
    });
});

//todo添加任务路由
app.post('/todo/addtask', (req, res) => {
    const sql1 = `select * from todotask where title=?`;
    db.query(sql1, req.body.title, (err, results) => {
        if (err) return res.send(err);
        if (results.length == 1) return res.send('任务已存在！');
        const sql = `insert into todotask set ?`
        db.query(sql, req.body, (err, results) => {
            // console.log(results);
            if (err) return res.send(err);
            if (results.affectedRows != 1) return res.send('添加任务失败！');
            return res.send('添加成功');
        });
    });
    
});

 //todo删除任务路由
app.get('/todo/deletetask', (req, res) => {
    // res.send('OK');
    const sql = `delete from todotask  where _id=?`;
    db.query(sql, req.query._id, (err, results) => {
        if (err) return res.send(err);
        if (results.affectedRows != 1) return res.send('任务删除失败！');
        return res.send('删除成功');
    });
});

//todo删除所有任务路由
app.get('/todo/deleteAlltask', (req, res) => {
    // res.send('OK');
    const sql = `delete from todotask `;
    db.query(sql, req.query._id, (err, results) => {
        if (err) return res.send(err);
        if (results.affectedRows ==0) return res.send('任务删除失败！');
        return res.send('所有任务已删除！');
    });
});

//todo更新任务状态
app.post('/todo/modifyTask', (req, res) => {
    // res.send('OK');
    // console.log(req.body.completed);
    const sql = `update todotask set ? where _id=?`;
    db.query(sql, [req.body, req.body._id], (err, results) => {
        if (err) return res.send(err);
        if (results.affectedRows != 1) return res.send('任务状态更新失败!');
        return res.send('任务更新成功');
    });
});
//计算未完成任务数量路由
app.get('/todo/count', (req, res) => {
    // res.send('OK');
    const sql = `select count(*) as total from todotask where completed=0`;
    db.query(sql, (err, results) => {
        // console.log(results);
        if (err) return res.send(err);
        return res.send(results[0]);      
    });
});

app.listen('3030', () => {
    console.log('express server runing at http://127.0.0.1:3030');
});