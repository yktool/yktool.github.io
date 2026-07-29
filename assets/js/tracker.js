!function(){
  "use strict";
  const DUNGEONS = {
    kyoto: {
      name: "無限ダンジョン・京都",
      cycle: ["雪女","貧乏神","天狗","猫又"],
      changeType: "replace",
      warningMode: "positional",
      positionalWarnSet: ["天狗","京都四天王","九尾"],
      interruptRows: [
        [
          { name:"雑多", label:"雑多", sub:"通常個体", accent:null },
          { name:"京都四天王", label:"京都四天王", sub:"天狗相当", accent:"red", quad:true },
          { name:"九尾", label:"九尾", sub:"天狗相当", accent:"red" }
        ]
      ],
      item: { name:"古", key:"inishie", color:"green" }
    },
    shonan: {
      name: "無限ダンジョン・湘南",
      cycle: ["ゆっくり〜ん","ゆっくりーざ","抜刀斎","雷帝"],
      changeType: "insert",
      warningMode: "fixed",
      fixedWarnColors: {
        "抜刀斎":"yellow",
        "雷帝":"red",
        "湘南四天王":"red",
        "絶望":"purple",
        "ゆゆゆ":"yellow"
      },
      interruptRows: [
        [
          { name:"雑多", label:"雑多", sub:"通常個体", accent:null },
          { name:"湘南四天王", label:"湘南四天王", sub:"雷帝相当", accent:"red", quad:true },
          { name:"絶望", label:"絶望", sub:"警戒", accent:"purple" }
        ],
        [
          { name:"ティロ", label:"ティロ", sub:"", accent:null },
          { name:"反応速度", label:"反応速度", sub:"", accent:null },
          { name:"ゆゆゆ", label:"ゆゆゆ", sub:"警戒", accent:"yellow" },
          { name:"ジャンプ", label:"ジャンプ", sub:"", accent:null }
        ]
      ],
      item: { name:"幻", key:"maboroshi", color:"pink" }
    }
  };
  const IMG_KEY = {
    "雪女":"yukionna",
    "貧乏神":"binbougami",
    "天狗":"tengu",
    "猫又":"nekomata",
    "九尾":"kyuubi",
    
    "ゆっくり〜ん":"yukkuriin",
    "ゆっくりーざ":"yukkuriiza",
    "抜刀斎":"battousai",
    "雷帝":"raitei",
    "絶望":"zetsubou",
    "ティロ":"thiro",
    "反応速度":"hannnousokudo",
    "ゆゆゆ":"yuyuyu",
    "ジャンプ":"jump"
  };
  const QUAD_USES_CYCLE = new Set(["京都四天王","湘南四天王"]);
  let currentKey = "kyoto";
  let cycleIndex = 0;
  let queue = []; 
  let itemOn = false;

  function dungeon(){ return DUNGEONS[currentKey]; }
  function nextFromCycle(){
    const d = dungeon();
    const b = d.cycle[cycleIndex % d.cycle.length];
    cycleIndex++;
    return b;
  }
  function ensureQueue(){
    while(queue.length < 2){
      queue.push({ name: nextFromCycle(), isChange:false });
    }
  }
  function resetState(){
    cycleIndex = 0;
    queue = [];
    itemOn = false;
  }
  function warnColorFor(bossName, position /* "next" | "next2" */){
    const d = dungeon();
    if(d.warningMode === "positional"){
      if(!d.positionalWarnSet.includes(bossName)) return null;
      return position === "next" ? "red" : "yellow";
    }
    if(d.warningMode === "fixed"){
      return d.fixedWarnColors[bossName] || null;
    }
    return null;
  }
  function renderIcon(container, bossName){
    container.innerHTML = "";
    if(QUAD_USES_CYCLE.has(bossName)){
      container.classList.add('quad');
      dungeon().cycle.forEach(function(name){
        const img = document.createElement('img');
        img.src = BOSS_IMAGES[IMG_KEY[name]];
        img.alt = name;
        container.appendChild(img);
      });
      return;
    }
    container.classList.remove('quad');
    const key = IMG_KEY[bossName];
    if(key && BOSS_IMAGES[key]){
      const img = document.createElement('img');
      img.src = BOSS_IMAGES[key];
      img.alt = bossName;
      container.appendChild(img);
      container.classList.remove('empty');
    }else{
      container.classList.add('empty');
    }
  }
  function updateItemButtonUI(){
    const d = dungeon();
    const btn = document.getElementById('btnItem');
    const img = document.getElementById('itemBtnImg');
    const label = document.getElementById('itemBtnLabel');
    const sectionTitle = document.getElementById('itemSectionTitle');
    img.src = BOSS_IMAGES[d.item.key];
    label.textContent = "「" + d.item.name + "」入手チャンス：" + (itemOn ? "ON" : "OFF");
    sectionTitle.textContent = "「" + d.item.name + "」フラグ(NEXT対象)";
    btn.classList.remove('color-green','color-pink');
    btn.classList.add('color-' + d.item.color);
    btn.classList.toggle('active', itemOn);
  }

  function render(){
    ensureQueue();
    const d = dungeon();
    const n1 = queue[0];
    const n2 = queue[1];

    document.getElementById('stageName').textContent = d.name;

    document.getElementById('nameNext').textContent = n1.name;
    document.getElementById('nameNext2').textContent = n2.name;

    document.getElementById('originNext').textContent = n1.isChange ? "ランダム変化" : "通常サイクル";
    document.getElementById('originNext2').textContent = n2.isChange ? "ランダム変化" : "通常サイクル";

    renderIcon(document.getElementById('iconNext'), n1.name);
    renderIcon(document.getElementById('iconNext2'), n2.name);

    const slotNext = document.getElementById('slotNext');
    const slotNext2 = document.getElementById('slotNext2');
    const badgeNext = document.getElementById('badgeNext');
    const badgeNext2 = document.getElementById('badgeNext2');

    const c1 = warnColorFor(n1.name, "next");
    const c2 = warnColorFor(n2.name, "next2");

    ['warn-red','warn-yellow','warn-purple'].forEach(function(cls){
      slotNext.classList.remove(cls);
      slotNext2.classList.remove(cls);
    });
    if(c1){ slotNext.classList.add('warn-' + c1); }
    if(c2){ slotNext2.classList.add('warn-' + c2); }

    badgeNext.classList.toggle('show', !!c1);
    badgeNext2.classList.toggle('show', !!c2);
    badgeNext.textContent = c1 ? "⚠ 警戒" : "";
    badgeNext2.textContent = c2 ? "⚠ 注意" : "";

    const itemTag = document.getElementById('itemTagNext');
    const itemTagImg = document.getElementById('itemTagNextImg');
    itemTagImg.src = BOSS_IMAGES[d.item.key];
    itemTag.classList.remove('color-green','color-pink');
    itemTag.classList.add('color-' + d.item.color);
    itemTag.classList.toggle('on', itemOn);
    updateItemButtonUI();
    renderInterruptButtons();
  }
  
  function renderInterruptButtons(){
    const d = dungeon();
    const wrap = document.getElementById('interruptWrap');
    wrap.innerHTML = "";
    d.interruptRows.forEach(function(row){
      const grid = document.createElement('div');
      grid.className = 'change-grid ' + (row.length === 4 ? 'cols-4' : 'cols-3');
      row.forEach(function(entry){
        const btn = document.createElement('button');
        btn.className = 'change-btn' + (entry.accent ? ' accent-' + entry.accent : '');
        btn.setAttribute('data-change', entry.name);
        const icon = document.createElement('span');
        icon.className = 'icon' + (entry.quad ? ' quad' : '');
        if(entry.quad){
          dungeon().cycle.forEach(function(name){
            const img = document.createElement('img');
            img.src = BOSS_IMAGES[IMG_KEY[name]];
            img.alt = name;
            icon.appendChild(img);
          });
        }else if(IMG_KEY[entry.name] && BOSS_IMAGES[IMG_KEY[entry.name]]){
          const img = document.createElement('img');
          img.src = BOSS_IMAGES[IMG_KEY[entry.name]];
          img.alt = entry.name;
          icon.appendChild(img);
        }
        btn.appendChild(icon);
        const textNode = document.createTextNode(entry.label);
        btn.appendChild(textNode);
        if(entry.sub){
          const sub = document.createElement('span');
          sub.className = 'sub';
          sub.textContent = entry.sub;
          btn.appendChild(sub);
        }
        btn.addEventListener('click', function(){
          onChangeBoss(entry.name);
        });

        grid.appendChild(btn);
      });

      wrap.appendChild(grid);
    });
  }
  function onChangeBoss(bossName){
    ensureQueue();
    const d = dungeon();
    if(d.changeType === "replace"){
      queue[0] = { name: bossName, isChange:true };
    } else if(d.changeType === "insert"){
      if(queue[0].isChange){
        queue[0] = { name: bossName, isChange:true };
      }else{
        queue.unshift({ name: bossName, isChange:true });
      }
    }
    render();
  }
  function renderDungeonOptions(){
    const dropdown = document.getElementById('stageDropdown');
    dropdown.innerHTML = "";
    Object.keys(DUNGEONS).forEach(function(key){
      const opt = document.createElement('button');
      opt.className = 'stage-option' + (key === currentKey ? ' current' : '');
      opt.textContent = DUNGEONS[key].name;
      opt.addEventListener('click', function(){
        if(key !== currentKey){
          currentKey = key;
          resetState();
        }
        closeDropdown();
        render();
        renderDungeonOptions();
      });
      dropdown.appendChild(opt);
    });
  }

  function openDropdown(){
    document.getElementById('stageDropdown').classList.add('open');
    document.getElementById('stageSelectBtn').classList.add('open');
  }
  function closeDropdown(){
    document.getElementById('stageDropdown').classList.remove('open');
    document.getElementById('stageSelectBtn').classList.remove('open');
  }
  function toggleDropdown(){
    const isOpen = document.getElementById('stageDropdown').classList.contains('open');
    if(isOpen) closeDropdown(); 
         else  openDropdown(); 
  }
  document.getElementById('stageSelectBtn').addEventListener('click', function(e){
    e.stopPropagation();
    toggleDropdown();
  });
  document.addEventListener('click', function(){
    closeDropdown();
  });
  document.getElementById('stageDropdown').addEventListener('click', function(e){
    e.stopPropagation();
  });
  document.getElementById('btnAdvance').addEventListener('click', function(){
    queue.shift();
    itemOn = false; 
    ensureQueue();
    render();
  });
  document.getElementById('btnItem').addEventListener('click', function(){
    itemOn = !itemOn;
    render();
  });
  document.getElementById('btnReset').addEventListener('click', function(){
    resetState();
    render();
  });
  renderDungeonOptions();
  render();
}();
