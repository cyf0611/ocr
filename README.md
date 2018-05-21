# 一款简单识别名片的系统
### 功能：
#### 实现拍照和本地上传照片，识别生成格式化的数据（姓名，公司，电话，email，地址等）
### 原理：
#### 1. 将拍照或本地图片转换为base64
#### 2. 基于[阿里云的第三方API](https://help.aliyun.com/document_detail/44224.html)，post传入得到的base64
