const birthDayIs = new Date('2025-07-11T11:53:00');
// 倒计时功能
document.addEventListener('DOMContentLoaded', function() {
  // 生日日期：2025年8月1日
  const birthdayDate = birthDayIs;
  
  // 获取倒计时元素
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const countdownContainer = document.getElementById('countdown');
  
  function updateCountdown() {
    const now = new Date();
    const diff = birthdayDate - now;
    
    // 如果生日已过或今天是生日
    if (diff <= 0) {
      // 清除倒计时
      clearInterval(countdownInterval);
      
      // 显示生日消息
      // countdownContainer.innerHTML = `
      //   <div class="birthday-message">
      //     <i class="fas fa-birthday-cake"></i>
      //     Happy Birthday! 李晓华2
      //     <i class="fas fa-birthday-cake"></i>
      //   </div>
      // `;
      // return;
    }
    
    // 计算剩余时间
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // 更新显示
    daysEl.textContent = days.toString().padStart(2, '0');
    hoursEl.textContent = hours.toString().padStart(2, '0');
    minutesEl.textContent = minutes.toString().padStart(2, '0');
    secondsEl.textContent = seconds.toString().padStart(2, '0');
  }
  
  // 初始更新
  updateCountdown();
  
  // 每秒更新一次
  const countdownInterval = setInterval(updateCountdown, 1000);
});

let isGiftUnlocked = false;
// 1. 导航栏滚动高亮 (可选)
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('#main-nav a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').slice(1) === current) {
      link.classList.add('active');
    }
  });
});

// ... 原有代码 ...

// 音乐控制功能
const bgMusic = document.getElementById('bgMusic');
const surpriseMusic = document.getElementById('surpriseMusic');
const musicControl = document.getElementById('musicControl');
let musicPlaying = false;

// 开启回忆之旅按钮点击事件
document.querySelector('.btn-explore').addEventListener('click', function(e) {
  e.preventDefault();
  
  // 滚动到回忆部分（平滑滚动）
  const targetId = this.getAttribute('href');
  const targetSection = document.querySelector(targetId);
  const targetPosition = targetSection.offsetTop - 100; // 减去导航栏高度
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const duration = 1500; // 1.5秒滚动时间
  let startTime = null;
  
  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }
  
  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }
  
  requestAnimationFrame(animation);
  
  // 播放音乐（如果尚未播放）
  if (!musicPlaying) {
    bgMusic.play().then(() => {
      musicPlaying = true;
      musicControl.innerHTML = '<i class="fas fa-volume-up"></i>';
    }).catch(error => {
      console.log('自动播放被阻止，需要用户交互:', error);
      alert('请点击右上角的音乐按钮开始播放音乐');
    });
  }
});

// 音乐控制按钮点击事件
musicControl.addEventListener('click', function() {
    if (musicPlaying) {
      bgMusic.pause();
      surpriseMusic.pause();
      this.innerHTML = '<i class="fas fa-volume-mute"></i>';
      musicPlaying = false;
    } else {
        console.log("3");
        bgMusic.play();
        this.innerHTML = '<i class="fas fa-volume-up"></i>';
        musicPlaying = true;
    }
  });

// // ... 原有代码 ...
// 礼物盒点击事件 - 添加密码功能
const passwordModal = document.getElementById('passwordModal');
const passwordContainer = document.getElementById('password-container');
const closePasswordModal = passwordModal.querySelector('.close-btn');
const passwordInput = document.getElementById('password');
const submitPassword = document.getElementById('submitPassword');
const passwordError = document.getElementById('passwordError');


// 2. 礼物盒点击事件 (必做！)
const giftWrap = document.getElementById('giftTrigger');
const giftReveal = document.getElementById('giftReveal');

giftWrap.addEventListener('click', () => {
    // 播放惊喜音乐
    if (musicPlaying) {
      surpriseMusic.pause();
      bgMusic.pause();
    }
    musicPlaying = true;
    musicControl.innerHTML = '<i class="fas fa-volume-up"></i>';
    surpriseMusic.play();
    
    // 显示密码输入界面
    passwordModal.style.display = 'flex';
    
    // 暂停礼物盒动画
    giftWrap.classList.remove('open');
    giftReveal.classList.add('hidden');
  });

// giftWrap.addEventListener('click', () => {
//   // 触发盖子动画 (CSS)
//   giftWrap.classList.toggle('open');
//   if (musicPlaying) {
//     surpriseMusic.pause();
//     bgMusic.pause();
//   }
//   surpriseMusic.play();
//   musicPlaying = true;
//   musicControl.innerHTML = '<i class="fas fa-volume-up"></i>';
//   passwordModal.display = 'flex';
  

//   // 显示礼物内容 (可添加延迟匹配动画时间)
//   setTimeout(() => {
//     giftReveal.classList.toggle('hidden');
//   }, 500);
//   passwordModal.style.display = 'flex';
// });

// 关闭密码模态框
closePasswordModal.addEventListener('click', () => {
  passwordModal.style.display = 'none';
});

// 点击模态框背景关闭
passwordModal.addEventListener('click', (e) => {
  if (e.target === passwordModal) {
    passwordModal.style.display = 'none';
  }
});

// 密码提交
let tryTimes = 0;
submitPassword.addEventListener('click', () => {
  const password = passwordInput.value;
  if (password === '060801') {
    tryTimes = 0;
    isGiftUnlocked = true;
    // 密码正确
    passwordError.textContent = '';
    passwordModal.style.display = 'none';
    // surpriseMusic.pause();
    
    document.body.classList.add('special-bg');
    // 触发盖子动画 (CSS)
    giftWrap.classList.add('open');
    
    // 显示礼物内容
    setTimeout(() => {
      giftReveal.classList.remove('hidden');
    }, 500);
  } else {
    tryTimes++;
    // 密码错误
    if (tryTimes < 3) {
      passwordError.textContent = '密码错误，请重新输入！';
    } else {
      passwordError.textContent = '小糖人，060801';
    }
    
    passwordInput.value = '';
    passwordInput.focus();
  }
});

// 按回车键提交密码
passwordInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    submitPassword.click();
  }
});


// 3. (可选) 相册模态框 - 点击小图显示大图

const photoItems = document.querySelectorAll('.photo-item');
// photoItems.forEach(item => {
//   item.addEventListener('click', () => {
//     const imgSrc = item.querySelector('img').src;
//     // 创建模态框元素 (需在CSS中定义modal样式)
//     // 显示大图和更详细的描述
//   });
// });


photoItems.forEach(item => {
	item.setAttribute('title', '点击有惊喜哦！');
    item.addEventListener('click', () => {
      // 获取预先存储的大图路径
      const largeImgSrc = item.getAttribute("data-large-img");
      console.log(largeImgSrc);
    //   const caption = item.querySelector('.photo-caption').textContent;
      
      // 创建模态框
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-content">
          <span class="close-btn">&times;</span>
          <img src="${largeImgSrc}" alt="大图" class="modal-image">
          <!-- <div class="modal-caption"></div> -->
        </div>
      `;
      
      // 添加到页面
      document.body.appendChild(modal);
      
      // 点击关闭按钮或模态框背景
      const closeBtn = modal.querySelector('.close-btn');
      closeBtn.onclick = () => modal.remove();
      modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
      };
    });
  });


// 4. (可选) 板块进入视口时的动画 (如果不用CSS)

const observerOptions = {
  threshold: 0.15 // 元素可见度达到15%时触发
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate__fadeInUp'); // 使用CSS类动画库或自定义
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.section > *').forEach(el => { // 为每个section的子元素添加
  observer.observe(el);
});


// 在main.js中添加以下代码

// 获取日期模态框元素
const dateModal = document.getElementById('dateModal');
const dateCloseBtn = document.querySelector('.date-close');
const btnRedeem = document.querySelector('.btn-redeem');

// 点击"领取惊喜"按钮显示日期模态框
btnRedeem.addEventListener('click', function(e) {
  e.preventDefault();
  
  // 显示日期模态框
  dateModal.style.display = 'flex';
  
  // 添加动画效果
  dateModal.querySelector('.date-modal').classList.add('show');
});

// 关闭日期模态框
dateCloseBtn.addEventListener('click', function() {
  dateModal.style.display = 'none';
  dateModal.querySelector('.date-modal').classList.remove('show');
});

// 点击模态框背景关闭
dateModal.addEventListener('click', function(e) {
  if (e.target === dateModal) {
    dateModal.style.display = 'none';
    dateModal.querySelector('.date-modal').classList.remove('show');
  }
});


// 添加信件解锁功能
const envelopeTrigger = document.getElementById('envelopeTrigger');
const letterReveal = document.getElementById('letterReveal');
const letterPasswordModal = document.getElementById('letterPasswordModal');
const letterPasswordInput = document.getElementById('letterPassword');
const submitLetterPassword = document.getElementById('submitLetterPassword');
const letterPasswordError = document.getElementById('letterPasswordError');
const letterCloseBtn = document.querySelector('.letter-close');

// 点击信封事件
envelopeTrigger.addEventListener('click', () => {
  if (!isGiftUnlocked) {
    // 如果礼物未解锁，显示提示
    alert('请先解锁礼物部分才能查看信件！');
    return;
  }
  console.log("Ok~");
  
  // 显示信件解锁模态框
  letterPasswordModal.classList.remove('hidden');
});

// 关闭信件解锁模态框
letterCloseBtn.addEventListener('click', () => {
  letterPasswordModal.classList.add('hidden');
});

// 点击模态框背景关闭
letterPasswordModal.addEventListener('click', (e) => {
  if (e.target === letterPasswordModal) {
    letterPasswordModal.classList.add('hidden');
  }
});

// 提交信件密码
submitLetterPassword.addEventListener('click', () => {
  const password = letterPasswordInput.value;
  if (password === '020626') {
    // 密码正确
    letterPasswordError.textContent = '';
    letterPasswordModal.classList.add('hidden');
    
    // 显示信件内容
    letterReveal.classList.remove('hidden');
    letterReveal.classList.add('visible');
    
    // 隐藏封闭的信封
    envelopeTrigger.classList.add('hidden');
    setTimeout(() => {
      document.getElementById('message').scrollIntoView({ behavior: 'smooth' });
    }, 300);
  } else {
    letterPasswordError.textContent = '密码错误，请重新输入！';
    letterPasswordInput.value = '';
    letterPasswordInput.focus();
  }
});

// 按回车键提交密码
letterPasswordInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    submitLetterPassword.click();
  }
});

// 在文档加载后添加生日检测逻辑
document.addEventListener('DOMContentLoaded', function() {
  const birthdayDate = birthDayIs;
  const now = new Date();
  
  // 检查是否为生日当天或之后
  if (now >= birthdayDate) {
    enableBirthdayMode();
  } else {
    // 显示倒计时
    setupCountdown(birthdayDate);
  }
  
  // 生日模式启用函数
  function enableBirthdayMode() {
    document.body.classList.add('birthday-active');
    
    // 移除倒计时（如果存在）
    const countdown = document.getElementById('countdown');
    if (countdown) countdown.remove();
    
    // 添加生日祝福
    // const heroContent = document.querySelector('.hero-content');
    // const birthdayMessage = document.createElement('div');
    // birthdayMessage.className = 'birthday-message';
    // birthdayMessage.innerHTML = `
    //   <i class="fas fa-birthday-cake"></i>
    //   Happy Birthday! 李晓华
    //   <i class="fas fa-birthday-cake"></i>
    // `;
    // heroContent.appendChild(birthdayMessage);
	const todayKey = 'birthdayMessageShown_' + new Date().toISOString().slice(0, 10);
	if (!localStorage.getItem(todayKey)) {
	  const heroContent = document.querySelector('.hero-content');
	  const birthdayMessage = document.createElement('div');
	  birthdayMessage.className = 'birthday-message';
	  birthdayMessage.innerHTML = `
	    <i class="fas fa-birthday-cake"></i>
	    Happy Birthday! 李晓华
	    <i class="fas fa-birthday-cake"></i>
	  `;
	  heroContent.appendChild(birthdayMessage);
	  localStorage.setItem(todayKey, 'true');
	}
	
    // 显示导航栏
    document.getElementById('main-nav').style.display = 'block';
  }
  
  // 设置倒计时函数
  function setupCountdown(targetDate) {
    const heroContent = document.querySelector('.hero-content');
    
    // 创建倒计时容器
    const countdownContainer = document.createElement('div');
    countdownContainer.id = 'countdown';
    countdownContainer.className = 'countdown-container';
    
    // 添加倒计时元素
    countdownContainer.innerHTML = `
      <div class="countdown-item">
        <span id="days">00</span>
        <span class="countdown-label">Days</span>
      </div>
      <div class="countdown-item">
        <span id="hours">00</span>
        <span class="countdown-label">Hours</span>
      </div>
      <div class="countdown-item">
        <span id="minutes">00</span>
        <span class="countdown-label">Minutes</span>
      </div>
      <div class="countdown-item">
        <span id="seconds">00</span>
        <span class="countdown-label">Seconds</span>
      </div>
    `;
    
    // 插入到欢迎内容中
    heroContent.appendChild(countdownContainer);
    
    // 获取倒计时元素
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    // 更新倒计时函数
    function updateCountdown() {
      const now = new Date();
      const diff = birthdayDate - now;
      
      if (diff <= 0) {
        clearInterval(countdownInterval);
        enableBirthdayMode();
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      daysEl.textContent = days.toString().padStart(2, '0');
      hoursEl.textContent = hours.toString().padStart(2, '0');
      minutesEl.textContent = minutes.toString().padStart(2, '0');
      secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
    
    // 初始更新
    updateCountdown();
    
    // 每秒更新一次
    const countdownInterval = setInterval(updateCountdown, 1000);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    alert('点击右上角音符按钮开启音乐！🎵\n点击礼物盒将有惊喜！🎁');
  }, 1000);
});