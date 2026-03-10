package com.example.cameratest;
import android.content.Context;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

public class SoundPlayer {
    private static final String TAG = "SoundPlayer";
    private MediaPlayer mediaPlayer;
    private AudioManager audioManager;

    /**
     * 播放通知声音（兼容所有版本）
     */
    public void playNotificationSound(Context context, int soundResId) {
        // 1. 首先检查是否静音或免打扰模式
        if (shouldMuteNotificationSound(context)) {
            Log.d(TAG, "Notification sound muted by system settings");
            return;
        }

        // 2. 在后台线程中准备和播放
        new Thread(() -> {
            try {
                prepareMediaPlayer(context, soundResId);
                playSound();
            } catch (Exception e) {
                Log.e(TAG, "Error playing sound", e);
            }
        }).start();
    }

    /**
     * 检查是否应该静音
     */
    private boolean shouldMuteNotificationSound(Context context) {
        audioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
        if (audioManager == null) {
            return false;
        }

        // 检查铃声模式
        int ringerMode = audioManager.getRingerMode();
        if (ringerMode == AudioManager.RINGER_MODE_SILENT ||
                ringerMode == AudioManager.RINGER_MODE_VIBRATE) {
            return true;
        }

        // Android 6.0+ 检查免打扰模式
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            android.app.NotificationManager notificationManager =
                    (android.app.NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (notificationManager != null &&
                    notificationManager.getCurrentInterruptionFilter() ==
                            android.app.NotificationManager.INTERRUPTION_FILTER_NONE) {
                return true;
            }
        }

        return false;
    }

    /**
     * 准备 MediaPlayer（兼容性处理）
     */
    private void prepareMediaPlayer(Context context, int soundResId) {
        try {
            // 先释放之前的实例
            releaseMediaPlayer();

            mediaPlayer = MediaPlayer.create(context, soundResId);
            if (mediaPlayer == null) {
                Log.e(TAG, "Failed to create MediaPlayer");
                return;
            }

            // 设置音频属性（Android 5.0+）
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                AudioAttributes audioAttributes = new AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .build();
                mediaPlayer.setAudioAttributes(audioAttributes);
            } else {
                // Android 5.0 以下使用流类型
                mediaPlayer.setAudioStreamType(AudioManager.STREAM_NOTIFICATION);
            }

            // 设置音量（根据系统设置）
            setVolumeAccordingToSettings();

            // 设置监听器
            mediaPlayer.setOnCompletionListener(mp -> {
                Log.d(TAG, "Sound playback completed");
                releaseMediaPlayer();
            });

            mediaPlayer.setOnErrorListener((mp, what, extra) -> {
                Log.e(TAG, "MediaPlayer error: what=" + what + ", extra=" + extra);
                releaseMediaPlayer();
                return true;
            });

            // 请求音频焦点（避免与其他音频冲突）
            requestAudioFocus();

        } catch (Exception e) {
            Log.e(TAG, "Error preparing MediaPlayer", e);
            releaseMediaPlayer();
        }
    }

    /**
     * 请求音频焦点
     */
    private void requestAudioFocus() {
        if (audioManager == null) {
            return;
        }

        int result;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // Android 8.0+ 新的音频焦点API
            AudioAttributes playbackAttributes = new AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .build();

            AudioFocusRequest focusRequest = new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK)
                    .setAudioAttributes(playbackAttributes)
                    .setAcceptsDelayedFocusGain(true)
                    .setOnAudioFocusChangeListener(afChangeListener)
                    .build();

            result = audioManager.requestAudioFocus(focusRequest);
        } else {
            // Android 8.0 以下
            result = audioManager.requestAudioFocus(
                    afChangeListener,
                    AudioManager.STREAM_NOTIFICATION,
                    AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK
            );
        }

        if (result == AudioManager.AUDIOFOCUS_REQUEST_GRANTED) {
            Log.d(TAG, "Audio focus granted");
        } else {
            Log.w(TAG, "Audio focus not granted, result=" + result);
        }
    }

    /**
     * 音频焦点变化监听器
     */
    private final AudioManager.OnAudioFocusChangeListener afChangeListener =
            new AudioManager.OnAudioFocusChangeListener() {
                @Override
                public void onAudioFocusChange(int focusChange) {
                    switch (focusChange) {
                        case AudioManager.AUDIOFOCUS_LOSS:
                            // 长时间失去焦点，停止播放
                            if (mediaPlayer != null && mediaPlayer.isPlaying()) {
                                mediaPlayer.pause();
                            }
                            break;
                        case AudioManager.AUDIOFOCUS_LOSS_TRANSIENT:
                            // 短暂失去焦点，暂停播放
                            if (mediaPlayer != null && mediaPlayer.isPlaying()) {
                                mediaPlayer.pause();
                            }
                            break;
                        case AudioManager.AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK:
                            // 降低音量
                            if (mediaPlayer != null) {
                                mediaPlayer.setVolume(0.2f, 0.2f);
                            }
                            break;
                        case AudioManager.AUDIOFOCUS_GAIN:
                            // 重新获得焦点
                            if (mediaPlayer != null && !mediaPlayer.isPlaying()) {
                                mediaPlayer.start();
                                mediaPlayer.setVolume(1.0f, 1.0f);
                            }
                            break;
                    }
                }
            };

    /**
     * 根据系统设置调整音量
     */
    private void setVolumeAccordingToSettings() {
        if (audioManager == null || mediaPlayer == null) {
            return;
        }

        // 获取当前通知音量（0.0-1.0）
        float currentVolume;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            // Android 9.0+ 可以直接获取音量比例
            currentVolume = audioManager.getStreamVolume(AudioManager.STREAM_NOTIFICATION) /
                    (float) audioManager.getStreamMaxVolume(AudioManager.STREAM_NOTIFICATION);
        } else {
            // 旧版本估算
            int maxVolume = audioManager.getStreamMaxVolume(AudioManager.STREAM_NOTIFICATION);
            int current = audioManager.getStreamVolume(AudioManager.STREAM_NOTIFICATION);
            currentVolume = current / (float) maxVolume;
        }

        // 设置音量
        mediaPlayer.setVolume(currentVolume, currentVolume);
        Log.d(TAG, "Set volume to: " + currentVolume);
    }

    /**
     * 播放声音
     */
    private void playSound() {
        if (mediaPlayer != null) {
            try {
                // 确保在主线程播放
                new Handler(Looper.getMainLooper()).post(() -> {
                    if (mediaPlayer != null) {
                        mediaPlayer.start();
                        Log.d(TAG, "Sound started playing");
                    }
                });
            } catch (Exception e) {
                Log.e(TAG, "Error starting playback", e);
                releaseMediaPlayer();
            }
        }
    }

    /**
     * 释放 MediaPlayer 资源
     */
    private void releaseMediaPlayer() {
        if (mediaPlayer != null) {
            try {
                // 先停止播放
                if (mediaPlayer.isPlaying()) {
                    mediaPlayer.stop();
                }
                mediaPlayer.release();
                mediaPlayer = null;
                Log.d(TAG, "MediaPlayer released");
            } catch (Exception e) {
                Log.e(TAG, "Error releasing MediaPlayer", e);
            }
        }

        // 放弃音频焦点
        if (audioManager != null) {
            audioManager.abandonAudioFocus(afChangeListener);
        }
    }

    /**
     * 外部调用停止播放
     */
    public void stop() {
        releaseMediaPlayer();
    }
}