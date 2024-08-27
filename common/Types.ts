export type ResponseStructure = {
    success: boolean,
    data?: {};
    errorCode?: number;
    errorMessage?: string;
    // showType?: ErrorShowType;
}

// 错误处理方案： 错误类型
export enum ErrorShowType {
    SILENT = 0,
    WARN_MESSAGE = 1,
    ERROR_MESSAGE = 2,
    NOTIFICATION = 3,
    REDIRECT = 9,
}

export type IdentityInfo = {
    useId: string;
    userName: string;
    permission: string;
    token?: string;
};