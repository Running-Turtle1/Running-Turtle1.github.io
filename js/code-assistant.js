/* Prewritten, browser-local replies based on homepage.html. No chat API. */
(function () {
  'use strict';

  var links = {
    home: ['Academic homepage', 'homepage.html'],
    papers: ['Publications', 'homepage.html#publications'],
    project: ['Projects', 'homepage.html#project'],
    news: ['News', 'homepage.html#news'],
    prism: ['PRISM project page', 'https://weipengchao.top/PRISM-page'],
    paper: ['Paper', 'https://arxiv.org/abs/2606.24072'],
    code: ['PRISM code', 'https://github.com/Running-Turtle1/Fabric-Demoireing'],
    dataset: ['Dataset', 'https://huggingface.co/datasets/running-Turtle/PRISM'],
    date: ['TJU Date', 'https://tjudate.com'],
    github: ['GitHub', 'https://github.com/Running-Turtle1'],
    mail: ['Email', 'mailto:wei954327649@gmail.com'],
    scholar: ['Google Scholar', 'https://scholar.google.com/citations?user=wj1AfUsAAAAJ&hl=en']
  };
  function answer(query) {
    var chinese = /[\u3400-\u9fff]/.test(query);
    function reply(en, zh, references, action) {
      return { text: chinese ? zh : en, links: references || [], action: action };
    }
    if (/^\/?help$|^\?$|帮助|怎么用/i.test(query)) {
      return reply(
        'Try asking about my research, PRISM, projects, news, or contact details. Chinese questions work too.\n\n/whoami  — introduce Pengchao\n/clear   — clear this conversation\n/help    — show these shortcuts\n\nopen readme — open the About Me window\nopen home / papers / projects / news — open that desktop app\n\nPress Esc while I am typing to show the complete reply.',
        '可以问我研究方向、PRISM 论文、项目、动态和联系方式。\n\n/whoami — 自我介绍\n/clear — 清空对话\n/help — 查看帮助\n\n打开介绍 — 打开 README 窗口\n打开主页 / 论文 / 项目 / 动态 — 打开对应的桌面应用\n\n回复过程中按 Esc 可以直接显示完整内容。'
      );
    }
    var open = query.match(/^(?:\/?open\s+|打开\s*)(.+)$/i);
    if (open) {
      var destination = open[1].trim();
      if (/^(readme(?:\.md)?|about(?: me)?|介绍|关于我)$/i.test(destination)) {
        return reply('Opening README.md…', '正在打开 README.md…', [], { window: 'welcome' });
      }
      var targets = [
        [/^(home(?:page)?|主页)$/i, 'home'],
        [/^(papers?|publications?|论文)$/i, 'papers'],
        [/^(projects?|项目)$/i, 'project'],
        [/^(news|动态)$/i, 'news']
      ];
      var target = targets.find(function (item) { return item[0].test(destination); });
      if (target) return reply('Opening ' + links[target[1]][0] + '…', '正在打开对应的桌面应用…', [], { desktop: target[1] });
      return reply('I can open home, readme, papers, projects, or news. Try "open papers".', '可以打开主页、介绍、论文、项目或动态。试试“打开论文”。');
    }
    if (/\b(ai|claude|gpt|llm|chatbot)\b|大模型|真.*智能|机器人/i.test(query)) {
      return reply('I am a scripted desktop companion, not a live AI model. My replies are prewritten, and this chat runs in your browser.', '我是桌面里的预设回复小机器人，没有接入大模型。这里的对话在你的浏览器中运行。');
    }
    if (/prism|demoir|fabric|去摩[尔尓]纹|织物/i.test(query)) {
      return reply(
        'PRISM is the project for “Fabric Image Demoiréing Benchmark from Synthesis to Restoration”, by Pengchao Wei and Xiaojie Guo, listed at ECCV 2026.\n\nYou can explore the project page, paper, code, and dataset below.',
        'PRISM 对应论文《Fabric Image Demoiréing Benchmark from Synthesis to Restoration》，作者为魏鹏超和郭晓杰，主页标注为 ECCV 2026。\n\n项目主页、论文、代码和数据集都在下面。',
        ['prism', 'paper', 'code', 'dataset']
      );
    }
    if (/paper|publication|论文|发表|eccv/i.test(query)) {
      return reply(
        'My listed publication:\n\nFabric Image Demoiréing Benchmark from Synthesis to Restoration\nPengchao Wei, Xiaojie Guo · ECCV 2026\n\nAsk me about PRISM, or open the publication links below.',
        '主页上的论文：\n\nFabric Image Demoiréing Benchmark from Synthesis to Restoration\n魏鹏超、郭晓杰 · ECCV 2026\n\n可以继续问我 PRISM，或点下面的链接查看。',
        ['papers', 'paper', 'prism']
      );
    }
    if (/project|tju\s*date|dating|项目|交友/i.test(query)) {
      return reply(
        'I founded TJU Date, a campus dating platform for Tianjin University students. My homepage also links to my PRISM research code, a Jittor RetinaNet implementation, MCM/ICM materials, and QUST computer science course materials.',
        '我创办了 TJU Date，面向天津大学学生的校园交友平台。主页里还收录了 PRISM 研究代码、基于 Jittor 的 RetinaNet 实现、MCM/ICM 资料和青科大计算机课程资料。',
        ['project', 'date', 'github']
      );
    }
    if (/news|recent|latest|update|动态|近况|最近/i.test(query)) {
      return reply(
        'News listed on my homepage:\n\n2026.09.07–09.12 — ECCV 2026 in Malmö, Sweden.\n2026.08.20 — BAAI Community ECCV 2026 Preview Seminar in Beijing.',
        '主页记录的动态：\n\n2026.09.07–09.12 — 参加瑞典马尔默的 ECCV 2026。\n2026.08.20 — 参加北京智源社区 ECCV 2026 论文预讲会。',
        ['news']
      );
    }
    if (/contact|email|mail|reach|联系|邮箱/i.test(query)) {
      return reply('Email: wei954327649@gmail.com\nGitHub: Running-Turtle1\n\nI am always open to collaborations and new friendships!', '邮箱：wei954327649@gmail.com\nGitHub：Running-Turtle1\n\n欢迎交流、合作，也欢迎认识新朋友！', ['mail', 'github', 'scholar']);
    }
    if (/research|working on|work on|vision|研究|方向/i.test(query)) {
      return reply('I began my research in 2026, focusing on computer vision at X-Lab, Tianjin University. My listed work is on fabric image demoiréing; ask me about PRISM to see the paper and resources.', '我从 2026 年开始做研究，在天津大学 X-Lab 主要关注计算机视觉。目前主页上的研究工作是织物图像去摩尔纹，可以继续问我 PRISM。', ['papers', 'prism']);
    }
    if (/collab|work with|合作/i.test(query)) {
      return reply('I am open to collaborations! Send me a short introduction and your idea by email.', '欢迎合作！可以发邮件简单介绍一下你自己和想交流的方向。', ['mail']);
    }
    if (/^\/?whoami$|who are|about you|introduce|pengchao|你是谁|介绍|魏鹏超/i.test(query)) {
      return reply('I am Pengchao Wei, a first-year master’s student at Tianjin University, working with Prof. Xiaojie Guo at X-Lab. I studied Computer Science and Technology at Qingdao University of Science and Technology, where I was part of the ACM team.', '我是魏鹏超，天津大学计算机科学与技术专业研一学生，在 X-Lab 跟随郭晓杰老师学习。本科就读于青岛科技大学计算机科学与技术专业，曾是 ACM 队的一员。', ['home', 'scholar']);
    }
    if (/^(hi|hello|hey)\b|你好|嗨/i.test(query)) {
      return reply('Hi! I am Pengchao’s little scripted desktop companion. Ask me about his research, papers, projects, or how to get in touch.', '你好！我是鹏超的桌面小机器人。可以问我他的研究、论文、项目，或者联系方式。');
    }
    return reply('I do not have a scripted reply for that yet. Try /help, or ask about research, papers, projects, news, or contact details.', '这个问题我还没有预设回答。试试 /help，或者问我研究、论文、项目、动态和联系方式。');
  }

  var panel = document.getElementById('code-window');
  var form = document.getElementById('code-form');
  var input = document.getElementById('code-input');
  var log = document.getElementById('code-log');
  var scroll = document.getElementById('code-scroll');
  var status = document.getElementById('code-status');
  var chips = Array.from(document.querySelectorAll('[data-code-prompt]'));
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var timer = null;
  var pending = null;

  function setBusy(busy) {
    panel.classList.toggle('is-busy', busy);
    log.setAttribute('aria-busy', String(busy));
    status.textContent = busy ? 'Thinking… Esc to finish' : '? for shortcuts · Enter to send';
    chips.forEach(function (button) { button.disabled = busy && button.dataset.codePrompt !== '/clear'; });
  }
  function scrollToReply() { scroll.scrollTop = scroll.scrollHeight; }
  function clearConversation() {
    window.clearTimeout(timer);
    timer = null;
    pending = null;
    log.replaceChildren();
    setBusy(false);
    scrollToReply();
  }
  function append(className, text) {
    var item = document.createElement('div');
    item.className = className;
    if (text) item.textContent = text;
    log.appendChild(item);
    return item;
  }
  function finishReply() {
    if (!pending) return;
    window.clearTimeout(timer);
    var current = pending;
    pending = null;
    current.thinking.remove();
    current.row.hidden = false;
    current.body.textContent = current.reply.text;
    if (current.reply.links.length) {
      var list = document.createElement('div');
      list.className = 'code-reply-links';
      current.reply.links.forEach(function (key) {
        var link = document.createElement('a');
        link.textContent = links[key][0] + ' ↗';
        link.href = links[key][1];
        if (/^https:/.test(links[key][1])) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
        list.appendChild(link);
      });
      current.body.appendChild(list);
    }
    setBusy(false);
    scrollToReply();
    if (current.reply.action) {
      if (current.reply.action.window) window.desktopWindows.open(current.reply.action.window);
      else window.desktopNavigation.open(current.reply.action.desktop);
    }
  }
  function typeReply() {
    if (!pending) return;
    pending.thinking.remove();
    pending.row.hidden = false;
    pending.position = Math.min(pending.position + 4, pending.characters.length);
    pending.body.textContent = pending.characters.slice(0, pending.position).join('');
    scrollToReply();
    if (pending.position === pending.characters.length) finishReply();
    else timer = window.setTimeout(typeReply, 18);
  }
  function submit(query) {
    query = query.trim().slice(0, 500);
    if (!query) return;
    if (/^\/?clear$|^清空(?:对话)?$/i.test(query)) {
      clearConversation();
      input.value = '';
      input.focus({ preventScroll: true });
      return;
    }
    if (pending) return;
    input.value = '';
    input.focus({ preventScroll: true });
    setBusy(true);
    append('code-user', '> ' + query);
    var reply = answer(query);
    var thinking = append('code-thinking', 'Thinking…');
    var row = append('code-reply');
    row.hidden = true;
    var body = document.createElement('div');
    body.className = 'code-reply-body';
    row.appendChild(body);
    pending = { reply: reply, thinking: thinking, row: row, body: body, characters: Array.from(reply.text), position: 0 };
    scrollToReply();
    if (reducedMotion.matches) finishReply();
    else timer = window.setTimeout(typeReply, 450);
  }
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    submit(input.value);
  });
  chips.forEach(function (button) {
    button.addEventListener('click', function () { submit(button.dataset.codePrompt); });
  });
  input.addEventListener('keydown', function (event) {
    if (event.isComposing) return;
    if (event.key === '?' && !input.value) { event.preventDefault(); submit('/help'); }
  });
  panel.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && pending) {
      event.preventDefault();
      event.stopPropagation();
      finishReply();
    }
  });
  document.addEventListener('desktop:windowchange', function (event) {
    if (event.detail.id === 'code' && event.detail.action === 'close') clearConversation();
  });
})();
