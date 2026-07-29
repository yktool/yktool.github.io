import { Render } from "//yktool.github.io/assets/js/Roll.mjs";
const names = [
  "ゆっくり魔法使い",
  "ゆっくり狩人",
  "ゆっくり盗賊",
  "ゆっくり剣士",
  "ゆっくり巫女",
  "ゆっくり重戦士",
  "ゆっくり鉱夫",
  "ゆっくり鍛冶屋",
  "ゆっくり騎士",
  "ゆっくり狂戦士",
  "ティロゆっくり",
  "反応速度ゆっくり",
  "ゆゆゆゆっくり",
  "ジャンプゆっくり",
  "目が赤いゆっくり",
  "ゆっくり魔法少女",
  "ゆっくりジェネラル",
  "ゆっくり雷神",
  "ヴァルキリー",
  "ゆっくり悪魔",
  "ゆっくり風神",
  "ゆっくり侍",
  "ゆっくり侍(変異種)",
  "隠しゆっくり",
  "ゆっくり～ん",
  "ゆっくりーざ",
  "ゆっくり抜刀斎",
  "ゆっくり雷帝",
  "ゆっくり雪女",
  "ゆっくり貧乏神",
  "ゆっくり天狗",
  "ゆっくり猫又",
  "ゆっくりフェニックス",
  "ゆっくりダークナイト",
  "ゆっくりマーメイド",
  "ゆっくりサキュバス",
  "ゆっくり獣巫女",
  "ゆっくり剣豪",
  "ゆっくり天使",
  "ゆっくり九尾分身体",
  "ゆっくり魔王(姉)",
  "ゆっくり魔王(妹)"
];
const dropdownBtn = document.getElementById("btn"),
     dropdownText = document.getElementById("dropdownText"),
      toggleArrow = document.getElementById("arrow");
const URLtag = location.href.match(/.+#(.+)/)?.[1];
if(URLtag){
  dropdownText.textContent = names[URLtag];
};
for(name in names){
  var Element_A = document.createElement("a"),
            text = names[name];
  Element_A.textContent = text;
  Element_A.href = `#${name}`;
  Element_A.addEventListener("click",function(){
    dropdownText.textContent = this.textContent;
    Render(text);
  });
  document.getElementById("dropdown").appendChild(Element_A);
};
const dropdownMenu = document.getElementById("dropdown");
const menus = dropdownMenu.getElementsByTagName("a");
function toggleDropdown(){
  dropdownMenu.classList.toggle("show");
  toggleArrow.classList.toggle("arrow");
};
dropdownBtn.addEventListener("click", function(e){
  e.stopPropagation();
  toggleDropdown();
});
document.documentElement.addEventListener("click", function(){
  if (dropdownMenu.classList.contains("show")) toggleDropdown();
});
/*document.getElementById("Roll").addEventListener("click",function{
  if()Render(document.getElementById("dropdownText").textContent)
})*/
