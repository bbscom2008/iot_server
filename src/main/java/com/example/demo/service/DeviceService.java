package com.example.demo.service;

import com.example.demo.dto.DeviceStatistics;
import com.example.demo.dto.PageResult;
import com.example.demo.entity.Device;
import com.example.demo.entity.Sensor;
import com.example.demo.mapper.DeviceMapper;
import com.example.demo.mapper.SensorMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DeviceService {

    private final DeviceMapper deviceMapper;
    private final SensorMapper sensorMapper;

    /**
     * 获取设备列表（分页）
     */
    public PageResult<Device> getDeviceList(Long userId, Integer pageNum, Integer pageSize,
                                             String search, Integer deviceType) {
        Map<String, Object> params = new HashMap<>();
        params.put("userId", userId);
        params.put("search", search);
        params.put("deviceType", deviceType);

        // 分页参数
        if (pageNum != null && pageSize != null) {
            int offset = (pageNum - 1) * pageSize;
            params.put("offset", offset);
            params.put("pageSize", pageSize);
        }

        List<Device> list = deviceMapper.findList(params);
        Long total = deviceMapper.countDevice(params);

        return PageResult.of(list, total);
    }

    /**
     * 获取设备统计
     */
    public DeviceStatistics getStatistics(Long userId) {
        Long allDevice = deviceMapper.countAllByUserId(userId);
        Long lineDevice = deviceMapper.countOnlineByUserId(userId);
        Long warningDevice = deviceMapper.countWarningByUserId(userId);

        return new DeviceStatistics(allDevice, lineDevice, warningDevice);
    }

    /**
     * 获取设备详情
     */
    public Device getDeviceDetail(Long deviceId) {
        Device device = deviceMapper.findById(deviceId);
        if (device == null) {
            throw new RuntimeException("设备不存在");
        }
        return device;
    }
    
    /**
     * 获取设备的传感器列表
     */
    public List<Sensor> getDeviceSensors(Long deviceId) {
        return sensorMapper.findByDeviceId(deviceId);
    }

    /**
     * 绑定设备
     */
    @Transactional
    public void bindDevice(Long userId, String deviceNum, String deviceName) {
        // 检查设备是否已被绑定
        Device existDevice = deviceMapper.findByDeviceNum(deviceNum);
        if (existDevice != null) {
            throw new RuntimeException("设备已被绑定");
        }

        // 创建新设备
        Device device = new Device();
        device.setUserId(userId);
        device.setDeviceNum(deviceNum);
        device.setDeviceName(deviceName);
        device.setDeviceType(0); // 默认类型
        device.setDeviceLineState(0); // 默认离线

        deviceMapper.insert(device);
    }

    /**
     * 解绑设备
     */
    @Transactional
    public void unbindDevice(Long deviceId, Long userId) {
        Device device = deviceMapper.findById(deviceId);
        if (device == null) {
            throw new RuntimeException("设备不存在");
        }

        // 验证设备归属
        if (!device.getUserId().equals(userId)) {
            throw new RuntimeException("无权操作此设备");
        }

        deviceMapper.deleteById(deviceId);
    }
}

