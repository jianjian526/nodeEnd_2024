const { buildSchema } = require('graphql');
const { findDepartments } = require('../department/departmentSearch');
import { employeeSchemaTypes, EmployeeResponse, Employee } from './Types';
const { removeNoValueKeys } = require('../../common/utils');

/**
 * 检索员工表
 * 
 * @param employeeTable 
 * @param condition 
 * @returns 
 */
const findEmployees = async (employeeTable: any, condition: any) => {
    return new Promise((resolve, reject) => {
        employeeTable.find(condition, (err: any, docs: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(docs);
            }
        });
    });
};

// buildSchema
const schema = buildSchema(`
  ${employeeSchemaTypes}

  type Query {
    getEmployeeStatusList(condition: EmployeeInput): EmployeeResponse
  }
`);

// root
const root = {
    getEmployeeStatusList: async (args: { condition: Employee }, context: any): Promise<EmployeeResponse> => {
        const condition = args.condition || {};

        try {
            // 从NeDB读取员工信息
            const employeeTable = context.dbManager.employee;
            const emplyeeResults = await findEmployees(employeeTable, removeNoValueKeys(condition));

            // 从NeDB读取部门信息（无条件检索）
            const departmentTable = context.dbManager.department;
            const departmentsResults = await findDepartments(departmentTable, {});

            // 创建部门信息的Map
            const departmentMap = new Map();
            departmentsResults.forEach((dept: any) => {
                departmentMap.set(dept.departmentId, dept);
            });

            // merge
            const employeeArray = emplyeeResults as any[];
            const result = employeeArray.map((emp: any) => {
                // 假设员工信息中有部门ID字段departmentId
                const dept = departmentMap.get(emp.departmentId);
                // 部门名赋值，并返回
                if (dept) {
                    return {
                        ...emp,
                        departmentName: dept.departmentName
                    };
                } else {
                    return {
                        ...emp,
                        departmentName: '部门未识别'
                    };
                }
            });

            // @ts-ignore
            return { success: true, errorCode: 0, data: { list: result } };
        } catch (error) {

            console.error(error);
            return { success: false, errorCode: 1 };
        }
    }
};

module.exports = {
    schema: schema,
    root: root,
    findEmployees,
};