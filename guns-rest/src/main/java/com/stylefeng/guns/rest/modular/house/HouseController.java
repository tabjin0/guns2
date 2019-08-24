package com.stylefeng.guns.rest.modular.house;

import com.stylefeng.guns.rest.modular.house.service.ISysHouseService;
import com.stylefeng.guns.rest.persistence.model.SysHouse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author tabjin
 * create at 2019-08-19 11:26
 * @program guns2
 * @description 控制器
 */
@RestController
@RequestMapping("/housemng")
public class HouseController {

    @Autowired
    private ISysHouseService iSysHouseService;

    public SysHouse test02(SysHouse sysHouse) {
        System.out.println("house:" + sysHouse);
        boolean flag = iSysHouseService.insert(sysHouse);
        return  sysHouse;
    }

    @RequestMapping("test")
    public String test(String str) {
        System.out.println(str);
        return "hello";
    }
}
