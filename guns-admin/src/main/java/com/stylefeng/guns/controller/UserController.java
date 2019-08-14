package com.stylefeng.guns.controller;

import com.mysql.jdbc.Blob;
import com.stylefeng.guns.Utils.FileUtils;
import com.stylefeng.guns.Utils.JinboyJSONResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


/**
 * @author tabjin
 * create at 2019-08-12 09:21
 * @program guns 2
 * @description 用户控制器
 */
@RestController
@RequestMapping(value = "/user")
public class UserController {

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


        // 获取前端传来的base64字符串，然后转换为文件对象再上传

        // 获取base64字符串
//        String base64Data = base64BO.getImgData();
        String pathTemp = "C:\\Users\\tabjin\\Desktop\\img\\" + "imgBase64.png";

        FileUtils.base64ToFile(pathTemp, base64);// 文件

        MultipartFile imageFile = FileUtils.fileToMultipart(pathTemp);

        return null;

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
}
