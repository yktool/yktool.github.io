!function(){
  // ============================================================
  // ダンジョン定義
  // ============================================================
  const DUNGEONS = {
    kyoto: {
      name: "無限ダンジョン・京都",
      cycle: ["雪女","貧乏神","天狗","猫又"],
      // ボス変化の挙動: "replace" = サイクルの次の1コマを差し替え(サイクルは温存)
      changeType: "replace",
      // 警告色の決め方: "positional" = 天狗相当なら位置(NEXT/NEXT2)で赤/黄が変わる
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
      // "insert" = サイクルに割り込むだけ(サイクル自体は崩れない)
      changeType: "insert",
      // "fixed" = ボス名ごとに固定の警告色を持つ(位置に依存しない)
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

  // ボス名 → 画像key のマッピング(未掲載名は画像なし=雑多など)
  const IMG_KEY = {
    // 京都
    "雪女":"yukionna",
    "貧乏神":"binbougami",
    "天狗":"tengu",
    "猫又":"nekomata",
    "九尾":"kyuubi",
    // 湘南
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

  // 四天王枠(2x2表示)のカテゴリ名 → そのダンジョンのサイクルを使う
  const QUAD_USES_CYCLE = new Set(["京都四天王","湘南四天王"]);

  // ============================================================
  // state
  // ============================================================
  let currentKey = "kyoto";
  let cycleIndex = 0;
  let queue = []; // [{name, isChange}]
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

  // ============================================================
  // 警告色判定
  // ============================================================
  // 戻り値: null | "red" | "yellow" | "purple"
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

  // ============================================================
  // アイコン描画
  // ============================================================
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

  // ============================================================
  // アイテムボタンUI
  // ============================================================
  function updateItemButtonUI(){
    const d = dungeon();
    const btn = document.getElementById('btnItem');
    const img = document.getElementById('itemBtnImg');
    const label = document.getElementById('itemBtnLabel');
    const sectionTitle = document.getElementById('itemSectionTitle');
    img.src = BOSS_IMAGES[d.item.key];
    label.textContent = "「" + d.item.name + "」入手チャンス：" + (itemOn ? "ON" : "OFF");
    sectionTitle.textContent = "「" + d.item.name + "」フラグ(NEXT対象)";
    btn.
