const { buildSchema } = require('graphql');
const { findDepartments } = require('../department/departmentSearch');
import { employeeSchemaTypes, ExportStatusDatas, ExportRedord, ColumnsState, ExportResponse } from './Types';
import { ResponseStructure } from '../../common/Types';
const { removeNoValueKeys } = require('../../common/utils');
const { templatePath } = require('../../common/constants');
const cron = require('node-cron');
const fs = require('fs-extra');

const ExcelJS = require('exceljs');

// 模板定义的列
const templateColumns: string[] = [
    'empName',
    'gender',
    'age',
    'level',
    'joinDate',
    'departmentName',
]

// 起始行（从1开始）
const startRowIndex = 2;
// 起始列（从1开始，不算No.的列）
const startColIndex = 3;

/**
 * 翻译 “level” 各值代表的含义
 * @param level 
 * @returns 
 */
const getExpLevelContext = (level: string): string => {
    switch (level) {
        case '1':
            return '1年<';
        case '2':
            return '1-3年';
        case '3':
            return '3-5年';
        case '4':
            return '5-10年';
        case '5':
            return '10年以上';
        default:
            return '未知';
    }
}

/**
 * 插入一列，并复制指定列的样式和值
 * 
 * @param worksheet 
 * @param index 要插入列的索引
 */
const copyColumnByLeft = (worksheet: any, index: number, templateIndex: number) => {
    // 复制一列
    const templateCol = worksheet.getColumn(templateIndex);
    worksheet.spliceColumns(index, 0, templateCol);

    // 获取新插入的列对象
    const newColumn = worksheet.getColumn(index);

    // 复制样式和值
    templateCol.eachCell((cell: any, rowNumber: any) => {
        const newCell = worksheet.getRow(rowNumber).getCell(index);
        newCell.value = cell.value;
        newCell.style = Object.assign({}, cell.style); // 复制样式
    });
}

/**
 * 插入一行，按列名数组插入输入，并复制指定行的样式
 * 
 * @param worksheet 
 * @param index 要插入列的索引
 */
const insertRowAndType = (worksheet: any, rowIndex: number, order: number,
    templateRowIndex: number, colNames: string[], data: ExportRedord) => {
    // 将经验内容展开并翻译
    const { experiences, ...useData } = data;
    if (experiences) {
        experiences.forEach((exp: { expName: string; expLevel: string }) => {
            // @ts-ignore
            useData[exp.expName] = getExpLevelContext(exp.expLevel);
        });
    }

    // 取得模板行
    const templateRow = worksheet.getRow(templateRowIndex);

    // 插入新行
    const newRow = worksheet.insertRow(rowIndex);

    // 根据列名，整理出要插入的数据
    const newRowData = colNames.map((colName: string) => {
        // @ts-ignore
        if (useData[colName] !== undefined) {
            // @ts-ignore
            return useData[colName];
        } else {
            return '';
        }
    });

    // 设定序号
    newRowData.splice(0, 0, order + '');
    // 插入前面的空列( -1 是因为考虑了No.列)
    for (var i = 1; i < startColIndex - 1; i++) {
        newRowData.splice(0, 0, null);
    }

    // 设值
    newRow.values = newRowData;

    // 复制样式
    templateRow.eachCell((cell: any, colNumber: any) => {
        newRow.getCell(colNumber).style = cell.style;
    });
}

// 假数据
const kata_exportData = [{
    empId: "1001",
    empName: "王峰",
    gender: "男",
    age: 22,
    level: "3",
    joinDate: "2021-11-12",
    departmentName: "TIS一部",
    experiences: [{ expName: "JAVA", expLevel: "4" }, { expName: ".NET", expLevel: "2" }]
},
{
    empId: "1002",
    empName: "陈洁",
    gender: "女",
    age: 21,
    level: "2",
    joinDate: "2021-11-13",
    departmentName: "TIS二部",
    experiences: [{ expName: "Windows", expLevel: "2" }, { expName: "C#", expLevel: "5" }, { expName: "JAVA", expLevel: "1" }]
}];

const kata_columnsState = [{
    name: "empName",
    state: { show: true }
},
{
    name: "gender",
    state: { show: false }
},
{
    name: "age",
    state: { show: false }
},
{
    name: "level",
    state: { show: true }
},
{
    name: "joinDate",
    state: { show: false }
},
{
    name: "departmentName",
    state: { show: true }
},
{
    name: "JAVA",
    state: { show: true }
},
{
    name: ".NET",
    state: { show: true }
},
{
    name: "C#",
    state: { show: true }
},
{
    name: "Windows",
    state: { show: false }
}]

// buildSchema
const schema = buildSchema(`
${employeeSchemaTypes}

type Mutation {
  exportEmployee(exportData: [EmployeeExportInput], columnsState: [ColumnsState]): ExportResponse
}
`);

// root
const root = {
    exportEmployee: async (args: { exportData: ExportStatusDatas, columnsState: ColumnsState }, context: any): Promise<ExportResponse> => {
        // const exportData = args.exportData || {};
        // const columnsState = args.columnsState || {};
        // 使用假数据
        const exportData = kata_exportData;
        const columnsState = kata_columnsState;

        const generateExcel = async () => {
            // 读取模板文件
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(templatePath + 'EmployeeStatusListTemplate.xlsx');

            // 取得模板列
            const thisTempCols = [...templateColumns]

            // 取得工作表
            const worksheet = workbook.getWorksheet('main');

            // 删除不需要的列（show = false的列）
            columnsState.forEach(element => {
                if (element.state.show === false) {
                    // 判读该列是否存在于模板中
                    var index = thisTempCols.indexOf(element.name);
                    if (index !== -1) {
                        // 删除excel列
                        worksheet.spliceColumns(index + startColIndex, 1);
                        // 也从模板列数组中删除
                        thisTempCols.splice(index, 1);
                    }
                }
            });

            // 判断出哪些是 经验列
            const expColumns: string[] = [];
            columnsState.forEach(element => {
                // 如果某列 不存在于模板的列中，则为经验列
                if (element.state.show !== false && templateColumns.indexOf(element.name) === -1) {
                    expColumns.push(element.name);
                }
            });

            // 加入经验列
            expColumns.forEach(element => {
                // 加入列的数组
                thisTempCols.push(element);

                // 取得excel应在的列index
                const colIndex = (thisTempCols.length - 1) + startColIndex;
                // 加入excel并写列名
                copyColumnByLeft(worksheet, colIndex, startColIndex);
                worksheet.getRow(startRowIndex).getCell(colIndex).value = element;
            });

            // 按照列数组，逐行写入数据
            let index = 0;
            exportData.forEach((element: ExportRedord) => {
                index++;
                // 插入（从起始行 + 模板行一行 开始）
                insertRowAndType(worksheet, startRowIndex + 1 + index, index,
                    startRowIndex + 1, thisTempCols, element);
            });

            // 删除模板行
            worksheet.spliceRows(startRowIndex + 1, 1);

            // 生成Excel文件
            const buffer = await workbook.xlsx.writeBuffer();

            return buffer;
        };

        // 示例数据
        const jsonData = [
            { name: '张三', age: 28, occupation: '工程师' },
            { name: '李四', age: 32, occupation: '设计师' },
            { name: '王五', age: 24, occupation: '销售员' },
        ];

        // 调用生成Excel的函数
        try {
            const buffer = await generateExcel()

            // const fs = require('fs');
            // fs.writeFileSync('invoice.xlsx', buffer);
            console.log('Excel文件已生成');

            return {
                success: true, errorCode: 0, data: buffer.toString('base64'),
            };
        } catch (error: any) {
            return { success: false, errorCode: 1, errorMessage: '生成失败' };
        }
    }
};

module.exports = {
    schema: schema,
    root: root,
};