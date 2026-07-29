import { SkillMap } from "//yktools.github.io/assets/js/SkillMap.mjs";
import { SkillRoll } from "//yktools.github.io/assets/js/SkillRoll.mjs";
export function Render(type,locks){
  const results = SkillRoll(SkillMap,type,locks);
  var i = 12;
  while(i--){
    document.getElementById(`Skill${i}`).textContent = results[i] || "";
  }
}
