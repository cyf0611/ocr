# 一款简单识别名片的系统
### 功能：
#### 实现拍照和本地上传照片，识别生成格式化的数据（姓名，公司，电话，email，地址等）
### 实现步骤：
#### 1. 将拍照或本地图片转换为base64
#### 2. 将base64发送至自己服务器，可保存其上传的图片
#### 3. 后台将到的base64，基于[阿里云的第三方API](https://help.aliyun.com/document_detail/44224.html)识别，得到其识别结果，返回至前端展示
