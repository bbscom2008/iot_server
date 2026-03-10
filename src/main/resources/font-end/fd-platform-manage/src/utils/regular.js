
    /**
     * 用户名正则校验 用户名必须包含至少一个字母、一个数字，并且长度在6到20个字符之间
     */
    export const  REGULAR_USER_NAME = /^(?=.*[a-zA-Z])(?=.*\\d)[a-zA-Z\\d]{6,20}$/;

    /**
     * 用户昵称正则校验 用户昵称必须包含至少一个字母、一个数字，并且长度在6到20个字符之间
     */
    export const  REGULAR_NIKE_NAME = /^(?=.*[a-zA-Z])(?=.*\\d)[a-zA-Z\\d]{6,20}$/;

    /**
     * 登录密码正则校验 用户密码必须包含至少一个字母、一个数字，并且长度在8到20个字符之间
     */
    export const  REGULAR_USER_PASSWORD = /^(?=.*[a-zA-Z])(?=.*\\d)[a-zA-Z\\d]{8,20}$/;

    /**
     * 校验字符输入32位长度 至少一个字母、一个数字; 涉及字段：编码
     */
    export const  REGULAR_INPUT_MAX_SIZE_32 = /^(?=.*[a-zA-Z])(?=.*\\d)[a-zA-Z\\d]{2,32}$/;

    /**
     * 校验字符输入32位长度 只能输入汉字、字母及数字 涉及字段：名称、标题
     */
    export const  REGULAR_INPUT_NAME_MAX_SIZE_32 = /^[\\u4e00-\\u9fa5a-zA-Z0-9]{1,32}$/;


    /**
     * IP地址必须是有效的IPv4或IPv6地址
     */
    export const  REGULAR_IP_ADDRESS = /^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$|^(?:[a-fA-F0-9:]+:+)+[a-fA-F0-9]+$/;
