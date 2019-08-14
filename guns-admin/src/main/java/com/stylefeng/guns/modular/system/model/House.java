package com.stylefeng.guns.modular.system.model;

import java.io.Serializable;

import java.util.Date;
import com.baomidou.mybatisplus.activerecord.Model;
import com.baomidou.mybatisplus.annotations.TableName;

/**
 * <p>
 * 
 * </p>
 *
 * @author tabjin123
 * @since 2019-07-05
 */
@TableName("sys_house")
public class House extends Model<House> {

    private static final long serialVersionUID = 1L;

    private String id;
    private String user;
    private String address;
    private Date date;
    private String desc;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    @Override
    protected Serializable pkVal() {
        return this.id;
    }

    @Override
    public String toString() {
        return "House{" +
        "id=" + id +
        ", user=" + user +
        ", address=" + address +
        ", date=" + date +
        ", desc=" + desc +
        "}";
    }
}
