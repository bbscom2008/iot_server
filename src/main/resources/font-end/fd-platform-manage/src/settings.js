module.exports = {
  title: '平台管理端',

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: true,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: false,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',

  /**
   * 图片上传服务器地址  // http://13.212.178.152:8099
   */
  // imageUploadServer:'http://192.168.12.125:8090/upload'
  // imageUploadServer:'http://18.138.228.73:8099/upload'
  
  // imageUploadServer: 'http://13.212.178.152:8099/upload'
  // imageUploadServer: 'http://192.168.12.123:11001/master/system/file'
  
  imageUploadServer: '/nginxapi/master/system/file'
  

  // imageUploadServer:'http://127.0.0.1:8090/upload'
}
