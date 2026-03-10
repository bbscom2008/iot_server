
import { isAndroidApp } from '@/utils'
import { getToken } from '@/utils/auth'

const APK_VERSION = 6
const DOWNLOAD_URL = 'https://pub-a4de62c620034eb68b03d5063c3ef430.r2.dev/apk/app1.6.apk'


let debounceFlag = false

/**
 * 启动 app 端的 通知 webSocket 
 */
export function startAppNotifySocket() {

    const token = getToken()
    if (!token) {
        console.log('-----startAppNotifySocket---token-is null--');
        return
    }
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const url = `${wsProtocol}//` + location.host + '/websapi/ws/providerOrderMessage'

    if (typeof AndroidBridge !== 'undefined') {
        // 3 秒防抖开关，避免重复启动
        if (debounceFlag) {
            return
        }
        console.log('-----startAppNotifySocket---debounceFlag---', debounceFlag);
        AndroidBridge.startNotifySocket(url, token)
        debounceFlag = true
        setTimeout(() => {
            debounceFlag = false
        }, 3000);
    }
}

export function notifyAndroidSetSoundState(state) {

    if (typeof AndroidBridge !== 'undefined') {
        console.log('-----notifyAndroidSetSoundState---state---', state);
        AndroidBridge.setSoundSwitch(state)
    }
}


export function getApkVersion() {
    if (typeof AndroidBridge !== 'undefined') {
        let apkVersion = AndroidBridge.getAppVersion()
        return apkVersion
    }
    return null
}


export function checkApkVersion() {
    console.log('---------checkApkVersion---------');
    
    if (isAndroidApp()) {
        console.log('======AndroidBridge===1====', AndroidBridge);

        if (typeof AndroidBridge !== 'undefined') {

            let apkVersion = AndroidBridge.getAppVersion()

            console.log('=======checkApkVersion===apkVersion:', apkVersion + " , APK_VERSION : " + APK_VERSION);

            if (apkVersion && Number(apkVersion) < APK_VERSION) {

                uni.showModal({
                    title: '发现新的版本',
                    content: '发现新版本，请下载安装最新版本！',
                    success: (res) => {
                        if (res.confirm) {
                            AndroidBridge.openInBrowser(DOWNLOAD_URL)
                        }
                    }
                })
            } else {
                uni.showToast({
                    title: '已经是最新版本',
                    icon: 'none'
                })
            }
        } else {
            uni.showToast({
                title: '当前版本过低，请联系客服升级！',
                icon: 'none'
            })
        }
    } else {
        uni.showToast({
            title: '网页版无需更新',
            icon: 'none'
        })
    }
}