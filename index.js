var img = document.getElementsByClassName("img")[0];
var leftBtn = document.getElementsByClassName("leftBtn")[0];
var rightBtn = document.getElementsByClassName("rightBtn")[0];
var sliderIndex = document.getElementsByClassName("sliderIndex")[0];
var slider = sliderIndex.getElementsByTagName("i");

var sliderLen = slider.length;
var lock = true;

// 点击事件
leftBtn.addEventListener("click", function () {
  nextPic("left");
}, false);

rightBtn.addEventListener("click", function () {
  nextPic("right");
}, false);

for (var i = 0; i < sliderLen; i++) {
  (function (i) {
    slider[i].addEventListener("click", function () {
      nextPic("", i);
    }, false);
  }(i))
}

// 定时自动切换
var autoTimer = setInterval(function () {
  nextPic("right");
}, 5000);

// 重新计时
function Restart () {
  clearInterval(autoTimer);
  autoTimer = setInterval(function () {
    nextPic("right");
  }, 5000);
}


// 判断下一个圆点及图片
function nextPic (dir, next) {
  if (lock) {
    lock = false;
    Restart();
    var now = img.offsetLeft;
    var nextSlider;
    if (dir) {
      var count = dir === "right" ? 1 : -1;
      next = -now / 400 + count;
      if (next === 4) {
        nextSlider = 0;
      } else if (next === -1) {
        nextSlider = next = 3;
        now = -1600;
      } else {
        nextSlider = next;
      }
    } else {
      nextSlider = next;
      dir = now > next * -400 ? "eight" : "left";
      // if (now > next * -400) {
      //   dir = "right";
      // } else {
      //   dir = "left";
      // }
    }
    cutSlider(nextSlider);
    cutPic(dir, now, next * -400);
  }
}

// 切换圆点
function cutSlider (next) {
  for (var i = 0; i < sliderLen; i++) {
    slider[i].className = next === i ? "active" : "";
    // if (next === i) {
    //   slider[i].className = "active";
    // } else {
    //   slider[i].className = "";
    // }
  }
}

// 切换图片
function cutPic (dir, now, next) {
  if (dir === "left" && now === 0) {
    now = -1600;
    img.style.left = "-1600px";
  }
  speed = (next - now) / 4;
  var timer = setInterval(function () {
    now += speed
    img.style.left = now + "px";
    if (img.offsetLeft === next) {
      clearInterval(timer);
      lock = true;
    }
    if (now === -1600) {
      img.style.left = "0px";
    }
  }, 100);
}