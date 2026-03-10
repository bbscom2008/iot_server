package com.example.cameratest;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.PowerManager;
import android.provider.Settings;
import android.util.Log;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.Toast;
import android.webkit.WebView;

import java.util.Locale;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private LinearLayout errorLayout;
    private ProgressBar progressBar;
    private Button btnRetry;
    private WebViewManager webViewManager;

    private static final int PERMISSION_REQUEST_CODE = 100;
    private static final int REQUEST_CODE_POST_NOTIFICATIONS = 1001;
    private static final int REQUEST_CODE_IGNORE_BATTERY_OPTIMIZATIONS = 1002;
    private static final int FILE_CHOOSER_RESULT_CODE = 1;

    private static final String TAG = "MainActivity";
    public static final String ACTION_NOTIFICATION = "ACTION_NOTIFICATION";

    private final BroadcastReceiver wsReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            // 暂时不需要处理广播内容
            // String evt = intent.getStringExtra(WebSocketService.EXTRA_EVENT);
            // if (evt != null) showToast(evt);
        }
    };


    private void showToast(String info){
        Toast.makeText(this, info, Toast.LENGTH_SHORT).show();
    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 检查并请求权限
        checkPermissionsAndStartService();

        initViews();
        webViewManager = new WebViewManager(this, webView, errorLayout, progressBar, btnRetry);
        webViewManager.initWebView();
        checkPermissions();

        String action = getIntent().getAction();
        Log.i(TAG, "onCreate: action: "+action);
        if(ACTION_NOTIFICATION.equals(action)){
            // 清空 notification
            updateNotification("");
        }

    }

    private void updateNotification(String info){
        Intent msg = new Intent(this, WebSocketService.class);
        msg.setAction(WebSocketService.ACTION_SEND);
        msg.putExtra(WebSocketService.EXTRA_MESSAGE, info);
        startService(msg);
    }



    private void initViews() {
        webView = findViewById(R.id.webView);
        errorLayout = findViewById(R.id.errorLayout);
        progressBar = findViewById(R.id.progressBar);
        btnRetry = findViewById(R.id.btnRetry);
    }



    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == FILE_CHOOSER_RESULT_CODE) {
            webViewManager.handleActivityResult(requestCode, resultCode, data);
            return;
        }

        // 其他的 Activity 结果处理（如果有）
    }

    private void checkPermissionsAndStartService() {
        // 1. 检查通知权限（Android 13+）
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this,
                    Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {

                ActivityCompat.requestPermissions(this,
                        new String[]{Manifest.permission.POST_NOTIFICATIONS},
                        REQUEST_CODE_POST_NOTIFICATIONS);
                return;
            }
        }

        // 2. 请求忽略电池优化（可选但建议）
        requestIgnoreBatteryOptimization();

        // 3. 注册广播 ， 开启服务
        registerMyReceiver();
    }

    @SuppressLint("UnspecifiedRegisterReceiverFlag")
    public void registerMyReceiver() {
        IntentFilter filter = new IntentFilter(WebSocketService.BROADCAST_EVENT);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            // API 33+（Android 13）的推荐写法
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
                // API 34+ 必须指定标志
                registerReceiver(wsReceiver, filter,
                        Context.RECEIVER_NOT_EXPORTED);
            } else {
                // API 33 及以下
                registerReceiver(wsReceiver, filter);
            }
        } else {
            // 旧 API
            registerReceiver(wsReceiver, filter);
        }
    }

    private void requestIgnoreBatteryOptimization() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            String packageName = getPackageName();
            PowerManager powerManager = (PowerManager) getSystemService(Context.POWER_SERVICE);

            if (!powerManager.isIgnoringBatteryOptimizations(packageName)) {
                Intent intent = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
                intent.setData(Uri.parse("package:" + packageName));
                try {
                    startActivityForResult(intent, REQUEST_CODE_IGNORE_BATTERY_OPTIMIZATIONS);
                } catch (Exception e) {
                    Log.e("MainActivity", "无法打开电池优化设置", e);
                }
            }
        }
    }

    private void checkPermissions() {
        String[] permissions = {
                Manifest.permission.CAMERA,
                Manifest.permission.WRITE_EXTERNAL_STORAGE,
                Manifest.permission.READ_EXTERNAL_STORAGE,
                Manifest.permission.RECORD_AUDIO
        };

        boolean allGranted = true;
        for (String permission : permissions) {
            if (checkSelfPermission(permission) != PackageManager.PERMISSION_GRANTED) {
                allGranted = false;
                break;
            }
        }

        if (!allGranted) {
            requestPermissions(permissions, PERMISSION_REQUEST_CODE);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if (requestCode == PERMISSION_REQUEST_CODE) {
            boolean allGranted = true;
            for (int result : grantResults) {
                if (result != PackageManager.PERMISSION_GRANTED) {
                    allGranted = false;
                    break;
                }
            }

            if (!allGranted) {
                Toast.makeText(this, "部分功能需要权限才能正常使用", Toast.LENGTH_LONG).show();
            }
        }

        if (requestCode == REQUEST_CODE_POST_NOTIFICATIONS) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // 权限已授予，继续启动服务
                checkPermissionsAndStartService();
            } else {
                Toast.makeText(this, "需要通知权限显示服务状态", Toast.LENGTH_SHORT).show();
            }
        }

    }

    @SuppressLint("GestureBackNavigation")
    @Override
    public void onBackPressed() {
        if (webViewManager != null && webViewManager.getWebView().canGoBack()) {
            webViewManager.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        try {
            unregisterReceiver(wsReceiver);
        } catch (Exception ignored) {
        }
        // optionally stop service when activity destroyed
//        Intent stop = new Intent(this, WebSocketService.class);
//        stop.setAction(WebSocketService.ACTION_STOP);
//        startService(stop);
    }


}