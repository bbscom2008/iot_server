package com.example.demo.service;

import com.example.demo.dto.DeviceDetailDTO;
import com.example.demo.dto.DeviceListDTO;
import com.example.demo.dto.DeviceStatistics;
import com.example.demo.dto.PageResult;
import com.example.demo.entity.Device;
import com.example.demo.entity.FrequencyMotor;
import com.example.demo.entity.MotorFan;
import com.example.demo.entity.Sensor;
import com.example.demo.mapper.DeviceMapper;
import com.example.demo.mapper.FrequencyMotorMapper;
import com.example.demo.mapper.MotorFanMapper;
import com.example.demo.mapper.SensorMapper;
import com.example.demo.mapper.SensorDataMapper;
import com.example.demo.util.DtoConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeviceService {

    private final DeviceMapper deviceMapper;
    private final SensorMapper sensorMapper;
    private final MotorFanMapper motorFanMapper;
    private final FrequencyMotorMapper frequencyMotorMapper;
    private final SensorDataMapper sensorDataMapper;
    private final DtoConverter dtoConverter;

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

        return PageResult.of(list, total, pageNum, pageSize);
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
     * 获取设备详情（返回 Entity）
     */
    public Device getDeviceDetail(Long deviceId) {
        Device device = deviceMapper.findById(deviceId);
        if (device == null) {
            throw new RuntimeException("设备不存在");
        }
        return device;
    }
    
    /**
     * 获取设备详情 DTO（包含所有关联数据）
     */
    public DeviceDetailDTO getDeviceDetailDTO(Long deviceId) {
        Device device = getDeviceDetail(deviceId);
        List<Sensor> sensors = sensorMapper.findByDeviceId(deviceId);
        List<MotorFan> motorFans = motorFanMapper.findByDeviceId(deviceId);
        List<FrequencyMotor> frequencyMotors = frequencyMotorMapper.findByDeviceId(deviceId);
        
        return dtoConverter.toDeviceDetailDTO(device, sensors, motorFans, frequencyMotors);
    }
    
    /**
     * 获取设备列表 DTO（批量查询传感器）
     */
    public PageResult<DeviceListDTO> getDeviceListDTO(Long userId, Integer pageNum, Integer pageSize,
                                                       String search, Integer deviceType) {
        PageResult<Device> deviceResult = getDeviceList(userId, pageNum, pageSize, search, deviceType);
        
        // 批量转换为 DTO，减少数据库查询次数
        List<DeviceListDTO> deviceListDTO = deviceResult.getList().stream()
                .map(device -> {
                    List<Sensor> sensors = sensorMapper.findByDeviceId(device.getId());
                    return dtoConverter.toDeviceListDTO(device, sensors);
                })
                .collect(Collectors.toList());
        
        return PageResult.of(deviceListDTO, deviceResult.getTotal(), pageNum, pageSize);
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

    /**
     * 删除设备（级联删除所有关联数据）
     */
    @Transactional
    public void deleteDevice(Long deviceId, Long userId) {
        Device device = deviceMapper.findById(deviceId);
        if (device == null) {
            throw new RuntimeException("设备不存在");
        }

        // 验证设备归属
        if (!device.getUserId().equals(userId)) {
            throw new RuntimeException("无权操作此设备");
        }

        // 1. 删除传感器历史数据
        sensorDataMapper.deleteByDeviceId(deviceId);

        // 2. 删除传感器
        sensorMapper.deleteByDeviceId(deviceId);

        // 3. 删除风机
        motorFanMapper.deleteByDeviceId(deviceId);

        // 4. 删除变频电机
        frequencyMotorMapper.deleteByDeviceId(deviceId);

        // 5. 删除设备本身
        deviceMapper.deleteById(deviceId);
    }
}

