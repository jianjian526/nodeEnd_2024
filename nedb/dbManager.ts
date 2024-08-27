var NeDB = require('nedb') // DB

class dbManager {
    // 员工表
    public employee: any;

    // 部门表
    public department: any;

    // 用户管理表
    public users: any;

    /** DB初期处理 */
    constructor() {
        this.employee = new NeDB({
            filename: './nedb/data/employee.db',
            autoload: true,
        })

        this.department = new NeDB({
            filename: './nedb/data/department.db',
            autoload: true,
        })

        this.users = new NeDB({
            filename: './nedb/data/users.db',
            autoload: true,
        })
    }
}

export default dbManager;