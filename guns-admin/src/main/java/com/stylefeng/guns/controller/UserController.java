package com.stylefeng.guns.controller;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.mysql.jdbc.Blob;
import com.stylefeng.guns.Utils.FileUtils;
import com.stylefeng.guns.Utils.JinboyJSONResult;
import com.stylefeng.guns.Utils.org.n3r.idworker.Sid;
import com.stylefeng.guns.modular.housemng.service.IHouseService;
import com.stylefeng.guns.modular.system.model.House;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.text.SimpleDateFormat;
import java.util.Date;


/**
 * @author tabjin
 * create at 2019-08-12 09:21
 * @program guns 2
 * @description 用户控制器
 */
@RestController
@RequestMapping(value = "/user")
public class UserController {

    @Autowired
    private IHouseService houseService;

    @Autowired
    private Sid sid;

    @RequestMapping(value = "/test", method = RequestMethod.POST)
    @ResponseBody
    public String test(Blob blob) {
        return "你好";
    }

    @RequestMapping(value = "/uploadFaceBase64", method = RequestMethod.POST)
    @ResponseBody
    public JinboyJSONResult uploadFaceBase64(@RequestParam(value = "base64") String base64) throws Exception {
//            @RequestParam(value = "base64", required = false)
//                                                     MultipartFile file,
//                                             HttpServletRequest request) throws Exception {

        Date date = new Date();
        SimpleDateFormat dateFormat= new SimpleDateFormat("yyyy-MM-dd-hh-mm-ss");
        System.out.println(dateFormat.format(date));
        // 获取前端传来的base64字符串，然后转换为文件对象再上传

        // 获取base64字符串
//        String base64Data = base64BO.getImgData();

        // 开发机本地存储
        String pathTemp = "C:\\Users\\tabjin\\Desktop\\img\\" + dateFormat.format(date) + "imgBase64.png";

        // 生产环境
//        String pathTemp = "/zj/data/card_img" + dateFormat.format(date) + ".png";

        FileUtils.base64ToFile(pathTemp, base64);// 文件

        MultipartFile imageFile = FileUtils.fileToMultipart(pathTemp);

        House house = new House();
        house.setId(sid.nextShort());
        house.setAddress(pathTemp);
        house.setDate(date);
        house.setDesc("这是测试数据");


        houseService.insert(house);

        return JinboyJSONResult.ok();

//        // 1. 定义文件保存的命名空间
//        String fileSpace = "C:\\Users\\tabjin\\Desktop\\img";
//
//        // 2. 保存到数据库的相对路径
//        String uploadPathDB = "/table_card_img";
//
//        FileOutputStream fileOutputStream = null;
//        InputStream inputStream = null;
//        try {
//            if (files != null && files.length > 0) {
//
//
//                // 获取文件名
//                String fileName = files[0].getOriginalFilename();
//                if (StringUtils.isNotBlank(fileName)) {
//                    // 文件上传的最终保存路径
//                    String finalPath = fileSpace + uploadPathDB + "/" + fileName;
//                    // 设置数据库保存的路径
//                    uploadPathDB += ("/" + fileName);
//
//                    File outFile = new File(finalPath);
//                    if (outFile.getParentFile() != null || !outFile.getParentFile().isDirectory()) {
//                        // 创建父文件夹
//                        outFile.getParentFile().mkdirs();
//                    }
//
//                    fileOutputStream = new FileOutputStream(outFile);
//                    inputStream = files[0].getInputStream();
//                    IOUtils.copy(inputStream, fileOutputStream);
//                }
//            }
//        } catch (IOException e) {
//            e.printStackTrace();
//        } finally {
//            if (fileOutputStream != null) {
//                fileOutputStream.flush();
//                fileOutputStream.close();
//            }
//        }
//        return null;
    }

    /**
     * 获取房屋管理列表
     */
    @RequestMapping(value = "/list")
    @ResponseBody
    public Object list(String condition) {

        // 1. 判断condition是否有值
        if (StringUtils.isEmpty(condition)) {
            // 1.1 condition无值，则查询全部
            return houseService.selectList(null);
        }else{
            // 1.2 condition有值，则按业务名称进行模糊查询
            EntityWrapper<House> houseEntityWrapper = new EntityWrapper<>();
            Wrapper<House> houseWrapper = houseEntityWrapper.like("user", condition);// 字段 + 字段值
            return houseService.selectList(houseWrapper);
        }
    }
}
