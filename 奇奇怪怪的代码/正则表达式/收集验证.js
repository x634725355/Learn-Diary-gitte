const a = /^<zx>(.+?\.[\w]*)<\/zx>$/.test();

// 视频
const video = /(mp4)|(ogg)|(webm)<\/zx>$/.test();

// 图片
const image = /(jp(e)?g)|(png)|(gif)<\/zx>$/.test();

// 奇数个a和偶数个b正则表达式
let strReg = /(a|b(bb|aa)*(ba|ab))(bb|aa|(ba|ab)(bb|aa)*(ba|ab))*/.test();

