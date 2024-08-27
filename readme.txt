express-example：* 表示通配express-example：下的所有日志

debug变量如上面设置好以后，下面在命令窗口中输入显示debug命令并且运行项目命令：
set DEBUG=express-example：*  &  node .\bin\www

注意：vscode下面的终端用上面的命令不可以，因为vscode下面的终端是PowerShell，所以命令如下：
$env:DEBUG='express-example:*'; node .\bin\www

关闭debug输出：
$env:DEBUG=''; node .\bin\www

（本工程： set DEBUG=backendapp:* & npm start ）
-------------------------

测试动态生成excel：
# mutation {
#   createAccount(input: {
#     name: "女二号",
#     age: 21,
#     sex: "女",
#     department: "行政部"
#   }) {
#     name
#     age
#   }
# }

query {
  exportEmployee(exportData:   [{
    empId: "1001",
    empName: "王峰",
    gender: "男",
    age: 22,
    level: "3",
    joinDate: "2021-11-12",
    departmentName: "TIS一部",
    experiences: [{expName: "JAVA", expLevel: "4"}, {expName: ".NET", expLevel: "2"}]
  },
  {
    empId: "1002",
    empName: "陈洁",
    gender: "女",
    age: 21,
    level: "2",
    joinDate: "2021-11-13",
    departmentName: "TIS二部",
    experiences: [{expName: "Windows", expLevel: "2"}, {expName: "C#", expLevel: "5"}, {expName: "JAVA", expLevel: "1"}]
  }], columnsState:   [{
    name: "empName",
    state: {show : true}},
    {
    name: "gender",
    state: {show : false}},
    {
    name: "age",
    state: {show : false}},
    {
    name: "level",
    state: {show : true}},
    {
    name: "joinDate",
    state: {show : false}},
    {
    name: "departmentName",
    state: {show : true}},
    {
    name: "JAVA",
    state: {show : true}},
    {
    name: ".NET",
    state: {show : true}},
    {
    name: "C#",
    state: {show : true}},
    {
    name: "Windows",
    state: {show : false}}]) {
    success
    errorCode
    errorMessage
  }
}
