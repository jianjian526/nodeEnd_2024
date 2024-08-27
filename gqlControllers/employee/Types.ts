import { ResponseStructure } from '../../common/Types';

// # 社员情报一览
// type List {
//   list: [Employee]
// }

export const employeeSchemaTypes = `
  # 社员情报的的入力条件
  input EmployeeInput {
    empId: String,
    empName: String,
    gender: String,
    age: Int,
    level: String,
    joinDate: String,
    department: String,
    isActive: Boolean
  }

  # 社员情报
  type Employee {
    empId: String,
    empName: String,
    gender: String,
    age: Int,
    level: String,
    joinDate: String,
    department: String,
    isActive: Boolean
  }

  # export入力:社员情报
  input EmployeeExportInput {
    empId: String,
    empName: String,
    gender: String,
    age: Int,
    level: String,
    joinDate: String,
    department: String,
    departmentId: String,
    departmentName: String,
    isActive: Boolean,
    experiences: [ExportExperiences]
  }
  input ExportExperiences {
    expName: String,
    expLevel: String
  }

  interface ResponseStructure {
    success: String
    errorCode: Int
    errorMessage: String
  }
  
  # 社员情报一览
  type List {
    list: [Employee]
  }

  # 一览的response情报
  type EmployeeResponse implements ResponseStructure {
    success: String
    errorCode: Int
    errorMessage: String
    data: List
  }

  # export的response情报
  type ExportResponse implements ResponseStructure {
    success: String
    errorCode: Int
    errorMessage: String
    data: String
  }

  # 列状态（显示与否等）
  input ColumnsState {
    name: String
    state: StateType
  }

  input StateType {
    show: Boolean
  }

`;

// 列状态（显示与否）
export type ColumnsState = {
  name: string
  state: { show: boolean }
}[]

export type EmployeeResponse = ResponseStructure & {
  data?: { list: Employee[] };
}

export type Employee = {
    empId?: string;
    empName?: string;
    gender?: string;
    age?: number;
    level?: string;
    joinDate?: string;
    departmentId?: string;
    departmentName?: string;
    isActive?: boolean;
    birthDay?: string;
    maritalStatus?: boolean;
    phone?: string;
};

export type ExportRedord = {
  empId?: string;
  empName?: string;
  gender?: string;
  age?: number;
  level?: string;
  joinDate?: string;
  departmentId?: string;
  departmentName?: string;
  isActive?: boolean;
  birthDay?: string;
  maritalStatus?: boolean;
  phone?: string;
  experiences?: { expName: string; expLevel: string }[];
};

export type ExportResponse = ResponseStructure & {
  data?: string;
}

export type ExportStatusDatas = ExportRedord[]

export { ResponseStructure };
