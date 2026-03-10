const mockDb = require('./mockdb.js')

const tokens = {
  admin: {
    token: "admin-token",
  },
  editor: {
    token: "editor-token",
  },
};

const users = {
  "admin-token": {
    roles: ["admin"],
    introduction: "I am a super administrator",
    avatar:
      "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
    name: "Super Admin",
  },
  "editor-token": {
    roles: ["editor"],
    introduction: "I am an editor",
    avatar:
      "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
    name: "Normal Editor",
  },
};

async function sleep(s){
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve()
    }, s)
  })
}


module.exports = [
  // user login
  {
    url: "/vue-element-admin/user/login",
    type: "post",
    response: (config) => {
      const { username, googleCode } = config.body;
      const token = tokens[username];

      console.log('--server-----login--username-'+username);
      console.log('--server-----login--googleCode-'+googleCode);
      
      // await sleep(1000)
      if (!token) {
        return {
          code: 60204,
          message: "Account and password are incorrect.",
        };
      }

      if(googleCode && googleCode.length > 0){ // 有 opt
        return {
          code: 200,
          message: "success",
          data: { ...token, isFirstLogin: false, isBindGoogleCode: true },
        };
      }else{
        return {
          code: 200,
          message: "success",
          data: { isFirstLogin: true, isBindGoogleCode: false },
        };
      }

      
      
    },
  },

  {
    url: "/vue-element-admin/user/pageSetting",
    type: "post",
    response: (config) => {

      const { subUrl } = config.body;

      console.log('subUrl : '+subUrl);
      
      let color = "#2d3a4b"
      let name = '登录页面'
      if(subUrl.startsWith("test01")){
        color = "#1f1f1f"
        name = '天王盖地虎'
      }else if(subUrl.startsWith("test02")){
        color = "#072c13"
        name = '宝塔镇河妖'
      }
      let ret = {
        "code": 200,
        "message": "success",
        "data": {
            "platformName": name,
            "platformId": "52",
            "platformLogoUrl": "https://avatars.githubusercontent.com/u/70080948",
            "platformBgUrl": "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1xp9n3.img?w=640&h=355&m=6",
            "platformBgColor": color,
          }
     }


      return ret;
    },
  },

  {
    url: "/vue-element-admin/home/dashboard",
    type: "post",
    response: (config) => {
      let ret = {
        "code": 200,
        "data": mockDb.dashBoardData,
        "message": "success"
    }
      return ret;
    },
  },
  //userlist
   {
    url: "/vue-element-admin/userRole/userList",
    type: "post",
    response: (config) => {
      let ret = {
        "code": 200,
        "message": "success",
        "data": mockDb.userList
    }

      return ret;
    },
  },
  //rolelist
   {
    url: "/vue-element-admin/userRole/roleList",
    type: "post",
    response: (config) => {
      let ret = {
        "code": 200,
        "message": "success",
        "data": mockDb.roleList
    }

      return ret;
    },
  },
  //payOrder List
   {
    url: "/vue-element-admin/merchantOrder/payOrderList",
    type: "post",
    response: (config) => {
      let ret = {
        "code": 200,
        "message": "success",
        "data": mockDb.payOrderList
    }

      return ret;
    },
  },
   {
       // 收银台访问记录
       url: '/vue-element-admin/merchantOrder/cash_visit',
       type: 'post',
       response: (config) => {
         let ret = {
           "code": 200,
           "message": "success",
           "total": 16,
           "data": mockDb.cashVisitList
         }
         
         return ret;
       }
     },
  //recharge  List
   {
    url: "/vue-element-admin/merchantCash/rechargeList",
    type: "post",
    response: (config) => {
      let ret = {
        "code": 200,
        "message": "success",
        "data": mockDb.rechargeList
    }

      return ret;
    },
  },


  // get user info
  {
    url: "/vue-element-admin/user/info.*",
    type: "get",
    response: (config) => {
      const { token } = config.query;
      const info = users[token];

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: "Login failed, unable to get user details.",
        };
      }

      return {
        code: 200,
        data: info,
      };
    },
  },

  // user logout
  {
    url: "/vue-element-admin/user/logout",
    type: "post",
    response: (_) => {
      return {
        code: 200,
        data: "success",
      };
    },
  },
  //addrole
  {
    url: "/vue-element-admin/userRole/addRole",
    type: "post",
    response: (config) => {
      const { roleName, description } = config.body;
      console.log('--server-------roleName-'+roleName);
      console.log('--server-------description-'+description);
      let newData={
              "rolename": roleName,
              "description": description,
              "id": 6199039438916984,
              "createTime": "2025-01-22 11:11:11"
            }
      mockDb.roleList=[
        ...mockDb.roleList,newData
      ]
      let ret = {
            "code": 200,
            "message": "success",
            "data": mockDb.roleList
        }
      return ret
    },
  },
];
