package com.example.demo.mapper;

import com.example.demo.entity.Device;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface DeviceMapper {

    /**
     * 查询设备列表
     */
    List<Device> findList(Map<String, Object> params);

    /**
     * 查询设备总数
     */
    Long countDevice(Map<String, Object> params);

    /**
     * 根据ID查询设备
     */
    Device findById(@Param("id") Long id);

    /**
     * 根据设备编号查询
     */
    Device findByDeviceNum(@Param("deviceNum") String deviceNum);

    /**
     * 绑定设备
     */
    int insert(Device device);

    /**
     * 解绑设备
     */
    int deleteById(@Param("id") Long id);

    /**
     * 统计用户所有设备数
     */
    Long countAllByUserId(@Param("userId") Long userId);

    /**
     * 统计用户在线设备数
     */
    Long countOnlineByUserId(@Param("userId") Long userId);

    /**
     * 统计用户报警设备数
     */
    Long countWarningByUserId(@Param("userId") Long userId);
}

