export function SkillRoll(map,path,SkillLocks){
  var target = map[path],
      result = [];
  if(SkillLocks){
    if(Object.prototype.toString.call(SkillLocks) !== "[object Object]") throw new Error("引数SkillLocksにはObjectを入れて欲しい。");
    for (const pos in SkillLocks){
      if(!target[pos].includes(SkillLocks[pos])) throw new Error("ロックしているスキルが存在しません。");
    };
    target = target.map(function(candidate){
      return candidate.filter(function(one){
        return !(Object.values(SkillLocks).includes(one));
      })
    });
    target.forEach(function(candidate,index){
      if(SkillLocks[index]) {
        result.push(SkillLocks[index]);
        return;
      }
      var newSkill;
      do{
        newSkill = candidate[Math.floor(Math.random() * candidate.length)];
      } while (result.includes(newSkill));
      result.push(newSkill);
    });
  } else {
    target.forEach(function(candidate){
      var newSkill;
      do{
        newSkill = candidate[Math.floor(Math.random() * candidate.length)];
      } while (result.includes(newSkill));
      result.push(newSkill);
    });
  };
  return result;
}
