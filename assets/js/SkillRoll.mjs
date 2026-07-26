export function SkillRoll(map,path,SkillLocks){
  var target = map[path],
      result = [];
  if(SkillLocks){
    if(Object.prototype.toString.call(SkillLocks) !== "[object Object]") throw new Error("引数SkillLocksにはObjectを入れて欲しい。");
    for (const pos of SkillLocks){
      if(!target[pos].includes(SkillLocks[pos])) throw new Error("ロックしているスキルが存在しません。");
    };
    target.forEach(function(candidate,index){
      if(SkillLocks[index]) {
        result.push(SkillLocks[index]);
        return;
      }
      var newSkill;
      do{
        newSkill = candidate[Math.floor(Math.random() * candidate.length)];
      } while (!result.includes(newSkill));
    });
  } else {
    target.forEach(function(candidate){
      var newSkill;
      do{
        newSkill = candidate[Math.floor(Math.random() * candidate.length)];
      } while (!result.includes(newSkill));
    });
  };
  return result;
}
