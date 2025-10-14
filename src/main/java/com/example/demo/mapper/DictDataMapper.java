package com.example.demo.mapper;

import com.example.demo.entity.DictData;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface DictDataMapper {

    /**
     * 根据字典类型查询
     */
    List<DictData> findByDictType(@Param("dictType") String dictType);
}

