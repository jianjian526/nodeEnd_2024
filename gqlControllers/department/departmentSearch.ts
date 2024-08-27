/**
 * 检索部门表
 * 
 * @param departmentTable 
 * @param condition 
 * @returns 
 */
const findDepartments = async (departmentTable: any, condition: any) => {
    return new Promise((resolve, reject) => {
        departmentTable.find(condition, (err: any, docs: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(docs);
            }
        });
    });
};

module.exports = {
    findDepartments,
};