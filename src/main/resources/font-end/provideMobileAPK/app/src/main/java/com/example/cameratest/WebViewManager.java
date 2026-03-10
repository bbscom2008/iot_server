package com.example.cameratest;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;
import android.view.View;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.Toast;
import android.content.ClipData;
import androidx.core.content.FileProvider;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class WebViewManager {

    private final Activity activity;
    private final WebView webView;
    private final LinearLayout errorLayout;
    private final ProgressBar progressBar;
    private final Button btnRetry;
    
    private ValueCallback<Uri[]> filePathCallback;
    private String cameraPhotoPath;

    private static final int FILE_CHOOSER_RESULT_CODE = 1;
//    private static final String TARGET_URL = "http://192.168.1.199:8080/";
    private static final String TARGET_URL = "https://test0010bc6f19b8d-mobile.fykknn.xyz/";


    public WebViewManager(Activity activity, WebView webView, LinearLayout errorLayout, 
                         ProgressBar progressBar, Button btnRetry) {
        this.activity = activity;
        this.webView = webView;
        this.errorLayout = errorLayout;
        this.progressBar = progressBar;
        this.btnRetry = btnRetry;
    }

    public void initWebView() {
        WebSettings webSettings = webView.getSettings();

        // 获取默认User-Agent
        String defaultUserAgent = webSettings.getUserAgentString();

        // 添加自定义标识
        String customUserAgent = defaultUserAgent + " provide-mobile-app/1.0";
        webSettings.setUserAgentString(customUserAgent);

        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setAllowFileAccessFromFileURLs(true);
        webSettings.setAllowUniversalAccessFromFileURLs(true);
        webSettings.setMediaPlaybackRequiresUserGesture(false);

        // 添加JavaScript桥接
        webView.addJavascriptInterface(new WebAppInterface(activity, webView), "AndroidBridge");

        // 添加对HTTP的支持
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }

        // 设置WebView客户端
        webView.setWebViewClient(new WebViewClient() {

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                // 允许加载HTTP链接
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    view.loadUrl(url);
                    return true;
                }
                return false;
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                progressBar.setVisibility(View.GONE);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                if (request.isForMainFrame()) {
                    showErrorPage();
                }
            }

            @SuppressWarnings("deprecation")
            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                showErrorPage();
            }
        });

        // 设置WebChromeClient处理文件选择和进度
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView webView,
                                             ValueCallback<Uri[]> filePathCallback,
                                             FileChooserParams fileChooserParams) {

                if (WebViewManager.this.filePathCallback != null) {
                    WebViewManager.this.filePathCallback.onReceiveValue(null);
                }
                WebViewManager.this.filePathCallback = filePathCallback;

                String[] acceptTypes = fileChooserParams.getAcceptTypes();
                String mediaType = getMediaType(acceptTypes);

                return showMediaChooser(mediaType);
            }
        });

        // 初始化重试按钮
        btnRetry.setOnClickListener(v -> reloadPage());

        // 加载网页
        loadUrl();
    }

    public void loadUrl() {
        webView.loadUrl(TARGET_URL);
    }

    public void reloadPage() {
        // 隐藏错误页面
        hideErrorPage();
        // 显示进度条
        progressBar.setVisibility(View.VISIBLE);
        // 重新加载页面
        webView.reload();
    }

    public void showErrorPage() {
        activity.runOnUiThread(() -> {
            webView.setVisibility(View.GONE);
            errorLayout.setVisibility(View.VISIBLE);
            progressBar.setVisibility(View.GONE);
        });
    }

    public void hideErrorPage() {
        activity.runOnUiThread(() -> {
            webView.setVisibility(View.VISIBLE);
            errorLayout.setVisibility(View.GONE);
        });
    }

    private String getMediaType(String[] acceptTypes) {
        if (acceptTypes == null || acceptTypes.length == 0) {
            return "all";
        }

        for (String acceptType : acceptTypes) {
            if (acceptType.contains("image")) {
                return "image";
            } else if (acceptType.contains("video")) {
                return "video";
            }
        }

        return "all";
    }

    private boolean showMediaChooser(String mediaType) {
        Intent galleryIntent = new Intent(Intent.ACTION_GET_CONTENT);
        galleryIntent.addCategory(Intent.CATEGORY_OPENABLE);

        if ("image".equals(mediaType)) {
            galleryIntent.setType("image/*");
        } else if ("video".equals(mediaType)) {
            galleryIntent.setType("video/*");
        } else {
            galleryIntent.setType("*/*");
            galleryIntent.putExtra(Intent.EXTRA_MIME_TYPES, new String[]{"image/*", "video/*"});
        }

        Intent[] cameraIntents = createCameraIntents(mediaType);
        Intent chooserIntent = Intent.createChooser(galleryIntent, "选择文件");

        if (cameraIntents.length > 0) {
            chooserIntent.putExtra(Intent.EXTRA_INITIAL_INTENTS, cameraIntents);
        }

        try {
            activity.startActivityForResult(chooserIntent, FILE_CHOOSER_RESULT_CODE);
            return true;
        } catch (Exception e) {
            Toast.makeText(activity, "无法打开文件选择器: " + e.getMessage(), Toast.LENGTH_LONG).show();
            return false;
        }
    }

    private Intent[] createCameraIntents(String mediaType) {
        Intent photoIntent = null;
        Intent videoIntent = null;

        // 图片相机 - 针对华为设备的特殊处理
        if ("image".equals(mediaType) || "all".equals(mediaType)) {
            photoIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);

            // 更严格的相机应用检查
            List<ResolveInfo> cameraApps = activity.getPackageManager().queryIntentActivities(photoIntent, PackageManager.MATCH_DEFAULT_ONLY);
            if (!cameraApps.isEmpty()) {
                File photoFile = createMediaFile("image");
                if (photoFile != null) {
                    Uri photoUri = FileProvider.getUriForFile(
                            activity,
                            activity.getPackageName() + ".fileprovider",
                            photoFile
                    );
                    photoIntent.putExtra(MediaStore.EXTRA_OUTPUT, photoUri);
                    cameraPhotoPath = photoFile.getAbsolutePath();

                    // 为所有可能的相机应用授予临时权限
                    for (ResolveInfo resolveInfo : cameraApps) {
                        String packageName = resolveInfo.activityInfo.packageName;
                        activity.grantUriPermission(packageName, photoUri,
                                Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
                    }

                    // 添加ClipData确保Uri权限
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        photoIntent.setClipData(ClipData.newRawUri("", photoUri));
                    }
                    photoIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
                }
            }
        }

        // 视频相机保持不变
        if ("video".equals(mediaType) || "all".equals(mediaType)) {
            videoIntent = new Intent(MediaStore.ACTION_VIDEO_CAPTURE);
            List<ResolveInfo> videoCameraApps = activity.getPackageManager().queryIntentActivities(videoIntent, PackageManager.MATCH_DEFAULT_ONLY);
            if (!videoCameraApps.isEmpty()) {
                videoIntent.putExtra(MediaStore.EXTRA_VIDEO_QUALITY, 1);
                videoIntent.putExtra(MediaStore.EXTRA_DURATION_LIMIT, 300);
            }
        }

        // 返回非空的Intent数组
        if (photoIntent != null && videoIntent != null) {
            return new Intent[]{photoIntent, videoIntent};
        } else if (photoIntent != null) {
            return new Intent[]{photoIntent};
        } else if (videoIntent != null) {
            return new Intent[]{videoIntent};
        } else {
            return new Intent[]{};
        }
    }

    private File createMediaFile(String type) {
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(new Date());
        String fileName = type.toUpperCase() + "_" + timeStamp;
        File storageDir = activity.getExternalFilesDir(Environment.DIRECTORY_PICTURES);

        try {
            String suffix = "image".equals(type) ? ".jpg" : ".mp4";
            return File.createTempFile(fileName, suffix, storageDir);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public void handleActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == FILE_CHOOSER_RESULT_CODE) {
            if (filePathCallback == null) return;

            Uri[] results = null;

            if (resultCode == Activity.RESULT_OK) {
                // 华为设备可能返回data为null，即使使用了EXTRA_OUTPUT
                if (data == null || data.getData() == null) {
                    // 优先使用相机文件路径
                    if (cameraPhotoPath != null) {
                        File file = new File(cameraPhotoPath);
                        if (file.exists() && file.length() > 0) {
                            try {
                                Uri photoUri = FileProvider.getUriForFile(
                                        activity,
                                        activity.getPackageName() + ".fileprovider",
                                        file
                                );
                                results = new Uri[]{photoUri};

                                // 确保文件可读
                                file.setReadable(true, false);

                            } catch (Exception e) {
                                Log.e("Camera", "Error creating URI for file: " + e.getMessage());
                                // 备用方案：使用FileProvider直接生成Uri
                                results = new Uri[]{Uri.fromFile(file)};
                            }
                        } else {
                            Log.e("Camera", "Camera file not found or empty: " + cameraPhotoPath);
                        }
                    }
                } else {
                    // 如果是从相册选择或有正常返回数据
                    Uri resultUri = data.getData();
                    if (resultUri != null) {
                        results = new Uri[]{resultUri};
                    }
                }

                // 华为设备特殊处理：如果results仍为null但文件存在
                if (results == null && cameraPhotoPath != null) {
                    File file = new File(cameraPhotoPath);
                    if (file.exists()) {
                        results = new Uri[]{Uri.fromFile(file)};
                    }
                }
            }

            // 确保回调被执行
            if (results == null) {
                Log.w("Camera", "No results obtained, calling callback with null");
                filePathCallback.onReceiveValue(null);
            } else {
                filePathCallback.onReceiveValue(results);
            }

            filePathCallback = null;
            cameraPhotoPath = null;
        }
    }

    public WebView getWebView() {
        return webView;
    }

    public void goBack() {
        if (webView.canGoBack()) {
            webView.goBack();
        }
    }
}
