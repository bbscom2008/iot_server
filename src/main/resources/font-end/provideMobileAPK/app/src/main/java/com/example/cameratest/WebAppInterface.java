package com.example.cameratest;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.Toast;

public class WebAppInterface {

    // 安前 APK 的版本
    private static  String APP_VERSION = "0";
    private Activity activity;
    private WebView webView;
    private final String TAG = "WebAppInterface";


    public static String getVersionName(Context context) {
        try {
            PackageManager packageManager = context.getPackageManager();
            PackageInfo packageInfo = packageManager.getPackageInfo(context.getPackageName(), 0);
            return ""+packageInfo.versionCode;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
            return "未知版本";
        }
    }

    public WebAppInterface(Activity activity, WebView webView) {
        this.activity = activity;
        this.webView = webView;

        APP_VERSION = getVersionName(activity);
    }

    @JavascriptInterface
    public void setSoundSwitch(boolean isOpen){

        Log.i(TAG, "setSoundSwitch isOpen : "+ isOpen);
        WebSocketService.SOUND_SWITCH = isOpen;
    }

    @JavascriptInterface
    public void startNotifySocket(String url, String token){

        Log.i(TAG, "startNotifySocket url : "+ url);
        Log.i(TAG, "startNotifySocket token : "+ token);

        Intent svc = new Intent(this.activity, WebSocketService.class);
        svc.setAction(WebSocketService.ACTION_START);
        svc.putExtra(WebSocketService.EXTRA_URL, url);
        svc.putExtra(WebSocketService.EXTRA_TOKEN, token);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            this.activity.startForegroundService(svc);
        } else {
            this.activity.startService(svc);
            Toast.makeText(this.activity, "版本太低，请使用Android 8 及以上版本！", Toast.LENGTH_LONG).show();
        }

    }

    @JavascriptInterface
    public void refreshPage() {
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Log.i("WebApp","refreshPage=======");
                // 清除缓存并重新加载
                webView.clearCache(true);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    // 只清除HTTP缓存
                    WebView.clearClientCertPreferences(null);
                }
                webView.reload();
            }
        });
    }

    @JavascriptInterface
    public void openInBrowser(String url) {
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    activity.startActivity(intent);
                } catch (Exception e) {
                    // 如果没有浏览器应用，显示Toast提示
                    Toast.makeText(activity, "无法打开浏览器", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    @JavascriptInterface
    public String getAppVersion() {
        return APP_VERSION;
    }

}