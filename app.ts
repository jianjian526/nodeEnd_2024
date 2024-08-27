var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const crypto = require('crypto');

// 这里导入了两个手动指定的router
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// router自动处理
var controller = require('./controller');
var gqlController = require('./gqlController');

var app = express();
var router = express.Router();

// DB管理
import DBManager from './nedb/dbManager';
const dbManager = new DBManager();

// view engine setup （不需要使用模板渲染视图）
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 验证JWT Token
import { verifyToken } from './common/auth';
// verifyToken(app);

// test路由
// app.use('/', indexRouter);
app.use('/users', usersRouter);

// controllerを追加する
controller(router, 'controllers');
app.use(router);

// gqlのcontrollerを追加する
gqlController(app, 'gqlControllers', dbManager);

// 将 db 对象附加到请求对象
app.use(function (req: any, res: any, next: any) {
  req.dbManager = dbManager;
  next();
});

// 先插几条
// dbManager.employee.insert({
//   empId: '0',
//   name: 'Umi3',
//   nickName: 'U3',
//   gender: 'MALE',
//   key: '1'
// }, function (err: any, doc: any) {
//   console.log('inserted:', doc)
// })

// dbManager.employee.insert({
//   id: '1',
//   name: 'Fish3',
//   nickName: 'B3',
//   gender: 'FEMALE',
//   key: '2'
// }, function (err: any, doc: any) {
//   console.log('inserted:', doc)
// })

// dbManager.users.insert({
//   id: 'A0001',
//   userName: 'user1',
//   password: 'password1',
//   permission: 'manager'
// }, function (err: any, doc: any) {
//   console.log('inserted:', doc)
// })

// dbManager.users.insert({
//   id: 'A0002',
//   userName: 'user2',
//   password: 'password2',
//   permission: 'normal'
// }, function (err: any, doc: any) {
//   console.log('inserted:', doc)
// })

// dbManager.department.insert({
//   id: 'A0002',
//   departmentName: 'user2',
//   password: 'password2',
//   permission: 'normal'
// }, function (err: any, doc: any) {
//   console.log('inserted:', doc)
// })

// catch 404 and forward to error handler
app.use(function (req: any, res: any, next: any) {
  next(createError(404));
});

// error handler
app.use(function (err: any, req: any, res: any, next: any) {
  // 身份验证失败处理
  if (err.status == 401 && err.name == 'UnauthorizedError') {
    res.status(401).json({ errorCode: '5', message: 'Invalid token' });
    return;
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
