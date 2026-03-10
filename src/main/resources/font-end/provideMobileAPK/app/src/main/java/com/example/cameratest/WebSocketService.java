package com.example.cameratest;

import android.Manifest;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;

import com.google.gson.Gson;

import java.util.HashMap;
import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;
import okio.ByteString;

public class WebSocketService extends Service {

    public static final String ACTION_START = "com.example.myapplication.action.START";
    public static final String ACTION_STOP = "com.example.myapplication.action.STOP";
    /**
     * 发送到 notification
     */
    public static final String ACTION_SEND = "com.example.myapplication.action.SEND";
    public static final String ACTION_RECONNECT = "com.example.myapplication.action.RECONNECT";
    public static final String EXTRA_MESSAGE = "message";
    public static final String EXTRA_URL = "ws.url";
    public static final String EXTRA_TOKEN = "ws.token";
    /**
     * 声音的开关
     */
    public static boolean SOUND_SWITCH = false;
    public static final String BROADCAST_EVENT = "com.example.myapplication.WS_EVENT";
    public static final String EXTRA_EVENT = "event";
    public static final String EXTRA_EVENT_DATA = "event_data";

    private static final String TAG = "WebSocketService";
    private static final String CHANNEL_ID = "ws_service_channel";
    private static final String CHANNEL_NAME = "WebSocket Service";
    private static final int NOTIF_ID = 1;
    private static String WS_URL = "wss://test0010bc6f19b8d-mobile.fykknn.xyz/websapi/ws/providerOrderMessage";

    private static String TOKEN = "test.token.12123";

    private OkHttpClient client;
    private WebSocket webSocket;
    private Handler handler;
    private boolean isForeground = false;
    private int reconnectAttempts = 0;
    private final int MAX_RECONNECT_ATTEMPTS = 20;
    private final long INITIAL_RECONNECT_DELAY = 1000; // 1秒
    private final Gson gson = new Gson();

    private SoundPlayer soundPlayer;

    /**
     * wssocket 是否认证成功
     */
    private boolean isAuthSuccess = false;
    private final  String RE_CONNECT = "重新连接";


    // 添加心跳任务标识
    private final Runnable heartbeatRunnable = new Runnable() {
        @Override
        public void run() {
            Log.i(TAG, "run: startHeartbeat----");
            if (webSocket != null) {
                try {
                    HashMap<String, String> heartbeat = new HashMap<>();
                    heartbeat.put("type", "heartbeat");
                    heartbeat.put("token", TOKEN);

                    String heartbeatMsg = gson.toJson(heartbeat);
                    boolean sent = webSocket.send(heartbeatMsg);
                    Log.d(TAG, "Heartbeat sent: " + sent);

                    // 每30秒发送一次心跳
                    handler.postDelayed(this, 20000);
                } catch (Exception e) {
                    Log.e(TAG, "Failed to send heartbeat", e);
                }
            }
        }
    };


    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "Service onCreate");

        soundPlayer = new SoundPlayer();

        // 创建 Handler 用于主线程操作
        handler = new Handler(Looper.getMainLooper());

        // 创建通知渠道（所有版本都需要）
        createNotificationChannel();

        // 创建 OkHttpClient 配置
        createOkHttpClient();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, "onStartCommand, action: " + (intent != null ? intent.getAction() : "null"));
        // 检查是否有前台服务权限
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            if (!hasForegroundServicePermission()) {
                Log.e(TAG, "Missing foreground service permission");
                stopSelf();
                return START_NOT_STICKY;
            }
        }

        if (intent != null) {
            String action = intent.getAction();
            if (ACTION_START.equals(action)) {

//                WS_URL = intent.getStringExtra(EXTRA_URL);
                TOKEN = intent.getStringExtra(EXTRA_TOKEN);

                Log.i(TAG, "onStartCommand: ACTION_START :" + TOKEN);
                startServiceAsForeground();

                if(TOKEN != null && !TOKEN.isEmpty()){
                    connectWebSocket();
                }

            } else if (ACTION_SEND.equals(action)) {
                String msg = intent.getStringExtra(EXTRA_MESSAGE);
                updateNotification(msg);

            } else if (ACTION_STOP.equals(action)) {
                stopServiceGracefully();

            } else if (ACTION_RECONNECT.equals(action)) {
                reconnectWebSocket();
            }
        } else {
            // 如果是系统重启服务，确保在前台运行
            startServiceAsForeground();
            reconnectWebSocket();
        }

        return START_STICKY;
    }

    @RequiresApi(Build.VERSION_CODES.P)
    private boolean hasForegroundServicePermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            // Android 14+ 检查特定权限
            return checkSelfPermission(Manifest.permission.FOREGROUND_SERVICE_DATA_SYNC)
                    == PackageManager.PERMISSION_GRANTED;
        } else {
            // Android 9-13 检查基础权限
            return checkSelfPermission(Manifest.permission.FOREGROUND_SERVICE)
                    == PackageManager.PERMISSION_GRANTED;
        }
    }

    /**
     * 启动为前台服务（兼容所有版本）
     */
    private void startServiceAsForeground() {
        if (!isForeground) {
            Notification notification = buildNotification("正在连接服务器...");

            // Android 8.0+ 需要特殊处理
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                // 注意：调用 startForeground 时指定服务类型（Android 10+）
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    startForeground(NOTIF_ID, notification,
                            android.content.pm.ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC);
                } else {
                    startForeground(NOTIF_ID, notification);
                }
            } else {
                // Android 7.1 及以下
                startForeground(NOTIF_ID, notification);
            }

            isForeground = true;
            Log.d(TAG, "Service started as foreground");
        }
    }

    /**
     * 创建 OkHttpClient 并配置超时
     */
    private void createOkHttpClient() {
        client = new OkHttpClient.Builder()
                .connectTimeout(10, TimeUnit.SECONDS)
                .writeTimeout(10, TimeUnit.SECONDS)
                .readTimeout(10, TimeUnit.SECONDS)
                .pingInterval(30, TimeUnit.SECONDS) // 每30秒发送Ping帧
                .retryOnConnectionFailure(true)
                .build();
    }

    /**
     * 连接 WebSocket
     */
    private void connectWebSocket() {
        // 1. 先停止所有心跳任务
        stopHeartbeat();

        if (webSocket != null  ) {
            webSocket.close(1000, RE_CONNECT); // 此处断开链接是异步的，有可能，下面的已经创建了，又被这个断开了，
        }else{
            doConnectWSocket();
        }
    }

    /**
     * 启动心跳检测
     */
    private void startHeartbeat() {
        // 先停止可能已经存在的心跳
        stopHeartbeat();

        // 启动新的心跳
        handler.postDelayed(heartbeatRunnable, 20000);
    }

    /**
     * 停止心跳检测
     */
    private void stopHeartbeat() {
        if (handler != null) {
            // 移除心跳任务
            handler.removeCallbacks(heartbeatRunnable);
            Log.d(TAG, "Heartbeat stopped");
        }
    }


    private void doConnectWSocket() {

        Log.i(TAG, "connectWebSocket: WS_URL : "+WS_URL);
        this.isAuthSuccess = false;
        Request request = new Request.Builder()
                .url(WS_URL)
                .addHeader("User-Agent", "Android-WebSocket-Client")
                .build();

        webSocket = client.newWebSocket(request, new WebSocketListener() {
            @Override
            public void onOpen(WebSocket webSocket, Response response) {
                Log.i(TAG, "WebSocket opened successfully");
                reconnectAttempts = 0; // 重置重连次数

                // 发送认证消息
                HashMap<String, String> message = new HashMap<>();
                message.put("type", "auth");
                message.put("token", TOKEN);

                String jsonMessage = gson.toJson(message);
                webSocket.send(jsonMessage);
                Log.d(TAG, "Auth message sent: " + jsonMessage);

                // 10 秒内没有收到 认证成功 的 消息，停止当前 socket
                authFailStopSocket();
            }

            @Override
            public void onMessage(WebSocket webSocket, String text) {
                Log.i(TAG, "Message received: " + text);
                sendBroadcastEvent("MESSAGE_RECEIVED", text);

                // 处理心跳响应
                if (text.contains("pong") || text.contains("heartbeat")) {
                    Log.d(TAG, "Heartbeat response received");
                }

                if(text.contains("NOTIFICATION")){
                    updateNotification("有新订单");
                    playNotificationSound();
                }

                if(text.contains("认证成功")){
                    isAuthSuccess = true;
                    sendBroadcastEvent("CONNECTED", "连接成功");
                    updateNotification("连接成功");
                    // 启动心跳检测
                    startHeartbeat();
                }
            }

            @Override
            public void onMessage(WebSocket webSocket, ByteString bytes) {
                Log.i(TAG, "Binary message received, size: " + bytes.size());
                sendBroadcastEvent("BINARY_MESSAGE_RECEIVED", bytes.hex());
            }

            @Override
            public void onClosing(WebSocket webSocket, int code, String reason) {
                Log.i(TAG, "WebSocket closing, code: " + code + ", reason: " + reason);
                sendBroadcastEvent("CLOSING", "连接关闭中: " + reason);
                updateNotification("连接断开");
//                // 清理资源
                cleanupWebSocket();
            }

            @Override
            public void onClosed(WebSocket webSocket, int code, String reason) {
                Log.i(TAG, "WebSocket closed, code: " + code + ", reason: " + reason);
                sendBroadcastEvent("CLOSED", "连接已关闭");
                updateNotification("连接已关闭");

                // 正常逻辑 重连
                if (reason.equals(RE_CONNECT) ) {
                    doConnectWSocket();
                }

                // 如果不是正常关闭，出错，尝试重连
                if (code != 1000 ) {
                    scheduleReconnect();
                }
            }

            @Override
            public void onFailure(WebSocket webSocket, Throwable t, Response response) {
                Log.e(TAG, "WebSocket error: " + t.getMessage(), t);
                sendBroadcastEvent("ERROR", "连接错误: " + t.getMessage());
                updateNotification("连接错误");

                // 清理资源
                cleanupWebSocket();

                // 尝试重连
                scheduleReconnect();
            }
        });
    }

    private void authFailStopSocket() {
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                Log.i(TAG, "run: authFailStopSocket----");
                if (webSocket != null && !isAuthSuccess ) {
                    webSocket.close(1000, "认证失败");
                }
            }
        }, 10000); // 链接成功，10 秒没有认证成功，就断开链接
    }


    /**
     * 启动心跳检测
     */
//    private void startHeartbeat() {
//        handler.postDelayed(new Runnable() {
//            @Override
//            public void run() {
//                Log.i(TAG, "run: startHeartbeat----");
//                if (webSocket != null) {
//                    try {
//                        HashMap<String, String> heartbeat = new HashMap<>();
//                        heartbeat.put("type", "heartbeat");
//                        heartbeat.put("token", TOKEN);
//
//                        String heartbeatMsg = gson.toJson(heartbeat);
//                        boolean sent = webSocket.send(heartbeatMsg);
//                        Log.d(TAG, "Heartbeat sent: " + sent);
//
//                        // 每30秒发送一次心跳
//                        handler.postDelayed(this, 20000);
//                    } catch (Exception e) {
//                        Log.e(TAG, "Failed to send heartbeat", e);
//                    }
//                }
//            }
//        }, 20000); // 30秒后开始第一次心跳
//    }

    /**
     * 清理 WebSocket 资源
     */
    private void cleanupWebSocket() {
        // 停止心跳
        stopHeartbeat();

        if (webSocket != null) {
            try {
                webSocket.close(1000, "Cleaning up");
            } catch (Exception e) {
                Log.e(TAG, "Error closing websocket", e);
            }
            webSocket = null;
        }
    }

    /**
     * 安排重连
     */
    private void scheduleReconnect() {
        if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
            Log.w(TAG, "Max reconnect attempts reached, stopping service");
            sendBroadcastEvent("MAX_RECONNECT_REACHED", "已达到最大重连次数");

            updateNotification("联网失败，请检查");

            stopSelf();
            return;
        }

        reconnectAttempts++;
        long delay = INITIAL_RECONNECT_DELAY * (long) Math.pow(2, reconnectAttempts - 1);
        delay = Math.min(delay, 60000); // 最大延迟60秒

        Log.d(TAG, "Scheduling reconnect attempt " + reconnectAttempts + " after " + delay + "ms");
        updateNotification("重连中(" + reconnectAttempts + "/" + MAX_RECONNECT_ATTEMPTS + ")");

        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                if (isForeground) {
                    connectWebSocket();
                }
            }
        }, delay);
    }

    /**
     * 手动重连
     */
    private void reconnectWebSocket() {
        reconnectAttempts = 0;
        connectWebSocket();
    }

    /**
     * 优雅停止服务
     */
    private void stopServiceGracefully() {
        // 清除所有回调
        if (handler != null) {
            handler.removeCallbacksAndMessages(null);
        }

        // 关闭 WebSocket
        if (webSocket != null) {
            webSocket.close(1000, "Service stopped by user");
            webSocket = null;
        }

        // 停止前台服务
        stopForeground(true);

        // 停止服务
        stopSelf();

        isForeground = false;
        Log.d(TAG, "Service stopped gracefully");
    }

    /**
     * 发送广播事件
     */
    private void sendBroadcastEvent(String event, String data) {
        Intent intent = new Intent(BROADCAST_EVENT);
        intent.putExtra(EXTRA_EVENT, event);
        intent.putExtra(EXTRA_EVENT_DATA, data);

        // 对于 Android 8.0+，需要指定包名
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            intent.setPackage(getPackageName());
        }

        sendBroadcast(intent);
    }

    /**
     * 创建通知渠道（Android 8.0+）
     */
    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    CHANNEL_NAME,
                    NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("WebSocket连接服务");
            channel.setShowBadge(false);

            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }

    /**
     * 构建通知（兼容所有版本）
     */
    private Notification buildNotification(String content) {
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("通知服务")
                .setContentText(content)
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .setOngoing(true)
                .setOnlyAlertOnce(true)
                .setCategory(NotificationCompat.CATEGORY_SERVICE)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC);

        // 点击通知打开 MainActivity
        Intent intent = new Intent(this, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        intent.setAction(MainActivity.ACTION_NOTIFICATION);

        int pendingFlags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            pendingFlags |= PendingIntent.FLAG_IMMUTABLE;
        }
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, pendingFlags);
        builder.setContentIntent(pendingIntent);

        // 对于 Android 7.1 及以下，不需要渠道ID
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            builder.setChannelId(null);
        }

        return builder.build();
    }

    /**
     * 更新通知
     */
    private void updateNotification(String content) {
        Notification notification = buildNotification(content);
        NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (nm != null) {
            nm.notify(NOTIF_ID, notification);
        }
    }

    @Override
    public void onDestroy() {
        Log.d(TAG, "Service onDestroy");

        // 清理所有资源
        if (handler != null) {
            handler.removeCallbacksAndMessages(null);
        }

        cleanupWebSocket();

        if (client != null) {
            try {
                client.dispatcher().executorService().shutdown();
            } catch (Exception e) {
                Log.e(TAG, "Error shutting down client", e);
            }
            client = null;
        }

        // 移除通知
        stopForeground(true);
        isForeground = false;

        if (soundPlayer != null) {
            soundPlayer.stop();
            soundPlayer = null;
        }

        super.onDestroy();
    }

    /**
     * 播放通知声音（自定义 dingdong.mp3）
     */
    private void playNotificationSound() {

        // 声音开关 关着，直接返回
        if(!SOUND_SWITCH){
            return ;
        }

        try {
            // 使用兼容的播放器
            if (soundPlayer != null) {
                soundPlayer.playNotificationSound(this, R.raw.dingdong);
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to play notification sound", e);
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}