# 原生JS实现轮播图

---
### 大概思路：
需要轮播的图片一共有四张，所以放五个<img>，前四个<img>分别放四张不同图片，第五个<img>放第一张图片。设置定时器，让图片每5秒自动向右切换。设置点击事件，点击左侧按钮则向左切换，点击右侧按钮则向右切换，点击圆点则切换到该圆点索引对应的图片。点击按钮向左切换时，如果当前显示图片为第一张图片，则将当前显示图片改为第五张（与第一张图片相同）。点击按钮向右切换时，如果当前图片为第四张（下一个图片应为第一张），则将圆点索引改为0（第一个圆点）。图片切换完成后，如果当前显示图片为第五张（与第一张相同），则改为显示第一张。

---
### 详细代码：
#### 一、变量声明
```
var sliderLen = slider.length; // 索引（小圆点）数量
var lock = true; // 如果lock为true则可切换图片，否则不切换
```
#### 二、创建需要的方法
##### 1.判断下一个圆点索引和下一个图片
```
function nextPic(dir, next) {
  // 如果lock为true则可切换图片，否则不切换
  if (lock) {
    lock = false; // 将lock改为false（本次切换完成后才可进行下一次切换）
    Restart(); // 重新计时
    var now = img.offsetLeft; // img现在的left
    var nextSlider; // 下一个圆点索引
    // 如果dir有值，则是点击了左右按钮,否则是点击了小圆点索引
    if (dir) {
      var count = dir === "right" ? 1 : -1; // 如果点击的是右侧按钮则count为1，否则为-1
      next = -now / 400 + count; // 下一个图片的索引
      // 如果下一个图片索引是4（下一张图片为第五张图片），则将圆点索引改为0，如果是-1（下一张图片为第四张图片），则将next和圆点索引改为3
      if (next === 4) {
        nextSlider = 0;
      } else if (next === -1) {
        nextSlider = next = 3;
        // now = -1600;
      } else {
        nextSlider = next;
      }
    } else {
      nextSlider = next;
      dir = -now / 400 < next ? "right" : "left"; // 如果现在的图片在下一个图片的左边，则向右切换图片，否则想左切换图片
    }
    cutSlider(nextSlider); // 切换圆点索引
    cutPic(dir, now, next * -400); // 切换图片
  }
}
```
##### 2.切换圆点索引
```
function cutSlider(next) {
  // 将该圆点索引的class改为active， 其他的圆点索引class清空
  for (var i = 0; i < sliderLen; i++) {
    slider[i].className = next === i ? "active" : "";
  }
}
```
##### 3.切换图片
```
function cutPic(dir, now, next) {
  // 如果向左切换且现在显示的图片是第一张图片，则将显示图片改为第五张图片（和第一张图片相同）
  if (dir === "left" && now === 0) {
    now = -1600;
    img.style.left = "-1600px";
  }
  speed = (next - now) / 4; // 图片切换速度
  // 启动定时器
  var timer = setInterval(function () {
    now += speed; // 下一次的left
    img.style.left = now + "px"; // 改变left
    // 如果当前位置等于next（切换完成），则清除定时器，并将lock改为true（可再次切换）
    if (img.offsetLeft === next) {
      clearInterval(timer);
      lock = true;
    }
    // 如果当前显示图片为第五张图片，则改为第一张（相同）
    if (now === -1600) {
      img.style.left = "0px";
    }
  }, 100);
}
```
##### 4.定时自动切换
```
var autoTimer = setInterval(function () {
  nextPic("right"); // 向右切换图片
}, 5000);
```
##### 5.重新计时
```
function Restart() {
  clearInterval(autoTimer); // 清除定时器
  // 重新启动定时器
  autoTimer = setInterval(function () {
    nextPic("right"); // 向右切换图片
  }, 5000);
}
```
#### 三、事件
##### 1.左侧和右侧按钮点击事件，点击左侧按钮向左切换，点击右侧按钮向右切换
```
leftBtn.addEventListener("click", function () {
  nextPic("left"); // 向左切换图片
}, false);
rightBtn.addEventListener("click", function () {
  nextPic("right"); // 向右切换图片
}, false);
```
##### 2.圆点索引点击事件，点击圆点则切换到该圆点索引对应的图片
```
for (var i = 0; i < sliderLen; i++) {
  (function (i) {
    slider[i].addEventListener("click", function () {
      nextPic("", i); // 切换到指定图片
    }, false);
  }(i))
}
```