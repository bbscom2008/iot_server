package com.example.demo.service;

import com.example.demo.entity.DictData;
import com.example.demo.mapper.DictDataMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DictDataService {

    private final DictDataMapper dictDataMapper;

    /**
     * 根据字典类型查询字典数据
     */
    public List<DictData> getDictDataByType(String dictType) {
        return dictDataMapper.findByDictType(dictType);
    }
}

