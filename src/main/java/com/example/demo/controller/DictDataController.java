package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.entity.DictData;
import com.example.demo.service.DictDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user/dict")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DictDataController {

    private final DictDataService dictDataService;

    /**
     * 获取字典数据
     * GET /user/dict/data/list
     */
    @GetMapping("/data/list")
    public ApiResponse<Map<String, Object>> getDictDataList(@RequestParam String dictType) {
        List<DictData> list = dictDataService.getDictDataByType(dictType);
        Map<String, Object> result = new HashMap<>();
        result.put("data", list);
        return ApiResponse.success(result);
    }
}

