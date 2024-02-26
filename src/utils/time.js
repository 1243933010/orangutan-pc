export const convertTimestampToDateString=(timestamp)=> {
    console.log(timestamp)
    if(timestamp==0){
        return '无'
    }
    // 将十位数时间戳转换为毫秒级时间戳
    var date = new Date(timestamp * 1000);

    // 获取年、月、日
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2); // 月份从0开始，需要加1，并保证两位数格式
    var day = ('0' + date.getDate()).slice(-2); // 保证两位数格式

    // 拼接成年月日字符串
    var dateString = year + '-' + month + '-' + day;

    return dateString;
}


export const generateRandomString = ()=> {
    // 生成随机字符串
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < 6; i++) {
      randomString += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    
    // 获取当前时间戳，并转换为十六进制
    const timestamp = new Date().getTime().toString(16);
  
    // 组合随机字符串和时间戳
    const finalString = timestamp + randomString;
  
    return finalString;
  }