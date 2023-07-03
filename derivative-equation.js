import { CompositeCost, CustomCost, ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "derivative_equation";
var name = "Derivative Equation";
var description = "\
A simple theory.\n\
x increase over time,\n\
however there is cap. \n\
you can buy upgrades to make f(x) and x more powerful but reset x.\n\
\n\
Active or Idle? You can decide on your own.\n\n\
DEV VERSION : 4\
";
var authors = "skyhigh173";
var version = 4;

// currency
var rho;
var dotrho = BigNumber.ZERO;

// upgrades
var n,a,b,c;

// x
var x = BigNumber.ZERO;

// perm
var capX;

// dev
var dev = {}

// milestone
var extraCap, nExp, cMS;

// func
var getA = (level=a.level) => Utils.getStepwisePowerSum(level, 2.2, 5, 0);
var getB = (level=b.level) => Utils.getStepwisePowerSum(level, 3, 7, 0);
let getCoshT = X => (BigNumber.TEN+(X.exp()-(BigNumber.ZERO-X).exp())/BigNumber.TWO).log10();
var getG = () => getCoshT(getQ1()*getQ2()/getC().max(1));
var getC = (level=c.level) => cMS.level == 0 ? BigNumber.ZERO :  Utils.getStepwisePowerSum(level, 1.8, 11, 0) / BigNumber.TWO;
var getN = (level=n.level) => BigNumber.TWO.pow(level * 0.3); //Utils.getStepwisePowerSum(level, 2.4, 8, 2) / BigNumber.TWO;
var getCapX = (level=capX.level) => BigNumber.from(1024) * getExtraCapX().pow(level);
var getExtraCapX = () => BigNumber.from(5 + extraCap.level * 3);
var getNExp = () => BigNumber.from(1.2 - 0.6 * nExp.level);

var getQ1 = (level=q1.level) => q1.level < 1106 ? Utils.getStepwisePowerSum(level, 1.1, 20, 0) : Utils.getStepwisePowerSum(level+773, 1.05, 20, 0);
var getQ2 = (level=q2.level) => BigNumber.from(1.2).pow(level/2);

var isCappedX = () => x >= getCapX();
var isMaxRhoOver = (over) => theory.tau.pow(10) >= BigNumber.from(over);

var get2DGraphValue = () => rho.value.sign * (BigNumber.ONE + rho.value.abs()).log10().toNumber();
var getPublicationMultiplier = (tau) => tau.pow(1.6) / BigNumber.TWO;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{1.6}}{2}";
var getTau = () => rho.value.pow(BigNumber.from(0.1));
var getCurrencyFromTau = (tau) => [tau.pow(10), rho.symbol];

var resetX = () => {
  x = BigNumber.ZERO;
}

var postPublish = () => {
  resetX();
}

var getInternalState = () => {
  let r = x.toString();
  return r;
}

var setInternalState = (state) => {
  x = BigNumber.from(state)
}

var init = () => {
  rho = theory.createCurrency();

  // n
  {
    let getInfo = (level) => "n = " + getN(level).toString(2);
    let getDesc = (level) => `n = 2^{${BigNumber.from(0.3 * level).toString(1)}}`
    n = theory.createUpgrade(0, rho, new ExponentialCost(200, Math.log2(2.2)));
    n.getDescription = (_) => Utils.getMath(getDesc(n.level));
    n.getInfo = (amount) => Utils.getMathTo(getInfo(n.level), getInfo(n.level + amount));
    n.boughtOrRefunded = (_) => resetX();
  }
  // a
  {
    let getDesc = (level) => "a = " + getA(level).toString(0);
    a = theory.createUpgrade(10, rho, new FirstFreeCost(new ExponentialCost(3, Math.log2(1.6))));
    a.getDescription = (_) => Utils.getMath(getDesc(a.level));
    a.getInfo = (amount) => Utils.getMathTo(getDesc(a.level), getDesc(a.level + amount));
    a.boughtOrRefunded = (_) => resetX();
  }
  // b
  {
    let getDesc = (level) => "b = " + getB(level).toString(0);
    b = theory.createUpgrade(11, rho, new ExponentialCost(50, Math.log2(1.74)));
    b.getDescription = (_) => Utils.getMath(getDesc(b.level));
    b.getInfo = (amount) => Utils.getMathTo(getDesc(b.level), getDesc(b.level + amount));
    b.boughtOrRefunded = (_) => resetX();
  }
  // c
  {
    let getDesc = (level) => "c = " + getC(level).toString(2);
    c = theory.createUpgrade(12, rho, new ExponentialCost(1e75, Math.log2(3.3)));
    c.getDescription = (_) => Utils.getMath(getDesc(c.level));
    c.getInfo = (amount) => Utils.getMathTo(getDesc(c.level), getDesc(c.level + amount));
    c.boughtOrRefunded = (_) => resetX();
    c.isAvailable = false;
  }

  let calcCost = (costs) => {
    let costModel;
    let last = new ExponentialCost(costs[costs.length-1][1],costs[costs.length-1][2]);
    for (let i = costs.length-1; i>0; i--) {
      costModel = last;
      let last2 = new ExponentialCost(costs[i-1][1],costs[i-1][2]);
      costModel = new CompositeCost(costs[i][0],last2,last);
      last = last2;
    }
    return costModel;
  }
  // q1
  {
    let costs = [
      [0,1e272,Math.log2(1.7)],
      [60,3e286,Math.log2(2)],
      [320,BigNumber.from('2e365'),Math.log2(8)],
      [500,BigNumber.from('2e419'),4],
      [1420,BigNumber.from('1e696'),7]
    ];
    
    let getDesc = (level) => "q_1 = " + getQ1(level).toString(2);
    q1 = theory.createUpgrade(20, rho, calcCost(costs));
    //q1 = theory.createUpgrade(20, rho, new ExponentialCost(1e272, Math.log2(2.1)));
    q1.getDescription = (_) => Utils.getMath(getDesc(q1.level));
    q1.getInfo = (amount) => Utils.getMathTo(getDesc(q1.level), getDesc(q1.level + amount));
    q1.boughtOrRefunded = (_) => resetX();
    q1.isAvailable = false;
  }

  // q2
  {
    let costs = [
      [0,1e280,4],
      //[142,BigNumber.from('1e451'),4],
      [250,BigNumber.from('1e590'),12],
    ]
    let getDesc = (level) => "q_2=1.2^{" + level/2 + "}";
    q2 = theory.createUpgrade(21, rho, calcCost(costs));
    q2.getDescription = (_) => Utils.getMath(getDesc(q2.level));
    q2.getInfo = (amount) => Utils.getMathTo('q_2='+getQ2(q2.level), 'q_2='+getQ2(q2.level + amount));
    q2.boughtOrRefunded = (_) => resetX();
    q2.isAvailable = false;
    
  }

  {
    let getDesc = (level) => "\\theta = " + getCapX(level).toString(0);
    capX = theory.createUpgrade(13, rho, new CompositeCost(47,new ExponentialCost(1e7, 12),new ExponentialCost(1e175, 16)));
    capX.getDescription = (_) => Utils.getMath(getDesc(capX.level));
    capX.getInfo = (amount) => Utils.getMathTo(getDesc(capX.level), getDesc(capX.level + amount));
    capX.boughtOrRefunded = (_) => resetX();
  }


  pubUpg = theory.createPublicationUpgrade(0, rho, 5e8);
  buyAllUpg = theory.createBuyAllUpgrade(1, rho, 1e20);
  autoUpg = theory.createAutoBuyerUpgrade(2, rho, 1e40);

  /* capX
  {
    capX = theory.createPermanentUpgrade(3, rho, new ExponentialCost(1e7, 12));
    capX.getDescription = (amount) => `$\\times x\\text{'s cap by } ${getExtraCapX().pow(amount).toString(0)}$`;
    capX.getInfo = (amount) => `$\\times 1 \\rightarrow \\times ${getExtraCapX().pow(amount).toString(0)} \\text{ (cap:${getCapX().toString(0)})}$`
    capX.boughtOrRefunded = (_) => resetX();
  }*/
  

  /* dev
  {
    dev.rho = theory.createPermanentUpgrade(4, rho, new FreeCost());
    dev.rho.getDescription = (amount) => `dev : $\\times 1e10 \\rho$`;
    dev.rho.getInfo = (amount) => `will remove soon`;
    dev.rho.boughtOrRefunded = (_) => {rho.value *= BigNumber.from(1e10)};
  }
  */

  /*
  milestone cost (rho) :
  e20 , e45 , e70 ,     -> x mul
  e95 , e120, e145,     -> n exp
  e170, e250, e550      -> coshT
  e650, e750, e850,     -> q2 lv
  e950, 1050, 1150      -> q2 lv
  */

  
  let msCostFunc = new CompositeCost(7, new LinearCost(2,2.5), new CompositeCost(1, new LinearCost(25,10), new LinearCost(55,10)))
  //theory.setMilestoneCost(new LinearCost(2, 2.5));
  theory.setMilestoneCost(msCostFunc);
  // 1e20, e25

    {
      extraCap = theory.createMilestoneUpgrade(0, 4);
      extraCap.description = Localization.getUpgradeIncCustomDesc("x \\text{'s cap multiplier} ", "3");
      extraCap.info = "increase $x$'s cap multiplier by 3"
    }
    {
      nExp = theory.createMilestoneUpgrade(1, 2);
      nExp.getDescription = () => "$\\downarrow n$'s exponent by $0.6$";
      nExp.getInfo = () => nExp.level == 1 ? "no longer $\\div n$ in $\\dot{x}$ term" : "decrease $n$'s exponent by $0.6$ in $\\dot{x}$ term"
      nExp.boughtOrRefunded = (_) => theory.invalidateSecondaryEquation();
    }
    {
      cMS = theory.createMilestoneUpgrade(2, 1);
      cMS.getDescription = () => "Unlock $c$";
      cMS.getInfo = () => "Unlock new variable $c$"
      cMS.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
      cMS.canBeRefunded = (_) => c.level == 0 && coshT.level == 0;
    }
    {
      coshT = theory.createMilestoneUpgrade(3, 1);
      coshT.getDescription = () => Localization.getUpgradeAddTermDesc('\\cosh(x)');
      coshT.getInfo = () => Localization.getUpgradeAddTermInfo('\\cosh(x)');
      coshT.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
      coshT.canBeRefunded = (_) => false;
    }
    {
      q2Cap = theory.createMilestoneUpgrade(4, 7);
      q2Cap.getDescription = () => Localization.getUpgradeIncCustomDesc('q_2 \\text{\'s max level}','50')
      q2Cap.getInfo = () => Localization.getUpgradeIncCustomInfo('q_2 \\text{\'s max level}','50')
      q2Cap.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
      q2Cap.canBeRefunded = (_) => q2.level <= (q2Cap.level-1) * 50 + 250;
    }
  
}

var getPrimaryEquation = () => {
  theory.primaryEquationHeight = 85;
  theory.primaryEquationScale = 1;
  
  let r = "\\begin{matrix}";
  r += `\\dot{\\rho} = n f(x) ${coshT.level > 0 ? '\\log(10+g)' : ''}  \\\\`;
  r += "f(x) = \\frac{d}{dx} \\left(ax + bx^{2}";
  if (c.isAvailable) {r += " + \\frac{cx^{3}}{\\log_{1.1}(\\max(\\rho,2))}\\right)"} else { r += '\\right)'}
  if (coshT.level > 0) r += `\\\\ g = \\frac{d}{dx}(\\cosh(\\frac{q_1q_2}{c}))`;
  r += "\\end{matrix}";

  return r;
}
var getSecondaryEquation = () => {
  theory.secondaryEquationScale = 0.95
  let e = getNExp();
  let nExpText = e == BigNumber.ZERO ? "a" : `\\frac{a}{n^{${e.toString(1)}}}`
  let r = `\\dot{x} = \\left\\{x < \\theta : n\\ln\\left(\\max\\left(${nExpText},e\\right)\\right) , \\theta - x \\right\\}`;
  r += `\\qquad ${theory.latexSymbol} = \\max \\rho^{0.1}`;
  return r;
}
var getTertiaryEquation = () => {
  
  return `\\dot{\\rho} = ${dotrho.toString(1)} ${coshT.level > 0 ? `\\qquad \\log(10+g) = ${getG()}`: ''} \\qquad x = ${x.toString(1)} ${isCappedX() ? `\\text{ (capped at ${getCapX().toString()})}` : ""}`;
}

var tick = (elapsedTime, multiplier) => {
  let dt = BigNumber.from(elapsedTime * multiplier);
  let bonus = theory.publicationMultiplier;

  let terms = [
    // ax^1 -> a
    getA(),
    // bx^2 -> 2bx
    BigNumber.TWO * getB() * x,
    // cx^3 -> 3cx^2
    BigNumber.THREE * getC() * x.square() / (rho.value.max(BigNumber.TWO).log10() / BigNumber.from(1.1).log10())
  ];
  let sums = BigNumber.ZERO;
  terms.forEach(val => {sums += val});
  // log(10+d/dx cosh(x)) : log(10+(exp(x)-exp(-x))/2)
  
  dotrho = sums * getN() * (coshT.level > 0 ? getG() : BigNumber.ONE);
  rho.value += dotrho * dt * bonus;

  if (rho.value != BigNumber.ZERO) {
    x += getN() * (BigNumber.E.max(getA()/(getN().pow(getNExp())))).log() * dt;
    if (isCappedX()) {
      x = getCapX();
    }
  }
  theory.invalidatePrimaryEquation();
  theory.invalidateTertiaryEquation();
  cMS.isAvailable = isMaxRhoOver(1e80);
  coshT.isAvailable = cMS.level > 0 && isMaxRhoOver(1e245);
  q2Cap.isAvailable = isMaxRhoOver('1e500') && coshT.level > 0;
  q2.maxLevel = 250 + q2Cap.level * 50;
  c.isAvailable = cMS.level > 0;
  q1.isAvailable = coshT.level > 0;
  q2.isAvailable = coshT.level > 0;
}

var ach_0 = theory.createAchievementCategory(0,'x');
var ach_1 = theory.createAchievementCategory(1,'rho');
var ach_2 = theory.createAchievementCategory(2,'other');
var ach_s = theory.createAchievementCategory(3,'secret');


var ach_x_1 = theory.createAchievement(100, ach_0, "min(x,cap)", "reach x's cap", isCappedX);
var ach_x_2 = theory.createAchievement(101, ach_0, "hardcap is gone!", "increase x's cap", () => capX.level > 0);
var ach_x_3 = theory.createAchievement(102, ach_0, "POWER", "reach x = 1e10", () => x >= BigNumber.from(1e10));
var ach_x_4 = theory.createAchievement(103, ach_0, "even faster than light speed", "reach x = 1e15", () => x >= BigNumber.from(1e15));
var ach_x_5 = theory.createAchievement(104, ach_0, "e'X'ponential growth", "reach x = 1e50", () => x >= BigNumber.from(1e50));
var ach_x_6 = theory.createAchievement(105, ach_0, "it justs keep growing...", "reach x = 1e150", () => x >= BigNumber.from(1e150));
var ach_x_7 = theory.createAchievement(106, ach_0, "No way, you can reach infinity?", "reach x = 1e200", () => x >= BigNumber.from(1e200));
var ach_rho_1 = theory.createAchievement(200, ach_1, "f(x) = x^2", "reach 1e10 rho", () => rho.value >= BigNumber.from(1e10));
var ach_rho_2 = theory.createAchievement(201, ach_1, "g(x) = 2^x", "reach 1e25 rho", () => rho.value >= BigNumber.from(1e25));
var ach_rho_3 = theory.createAchievement(202, ach_1, "why did my rho explodes?", "reach 1e50 rho", () => rho.value >= BigNumber.from(1e50));
var ach_rho_4 = theory.createAchievement(203, ach_1, "nice number", "reach 6.9e69 rho", () => rho.value >= BigNumber.from(6.9e69));
var ach_rho_5 = theory.createAchievement(204, ach_1, "like jumping into the rocket", "reach 1e100 rho", () => rho.value >= BigNumber.from(1e100));
var ach_rho_6 = theory.createAchievement(205, ach_1, "IT'S OVER CENTILLION!!!", "reach 1e303 rho", () => rho.value >= BigNumber.from('1e303'));
var ach_rho_7 = theory.createAchievement(206, ach_1, "No way, you can reach eternity?", "reach 3.23e616 rho ((2^1024)^2)", () => rho.value >= BigNumber.TWO.pow(1024).pow(2));
var ach_rho_8 = theory.createAchievement(207, ach_1, "I feel like it is decaying", "reach 1e500 rho", () => rho.value >= BigNumber.from('1e500'));
var ach_rho_9 = theory.createAchievement(208, ach_1, "Googol to the power of ten", "reach 1e1000 rho", () => rho.value >= BigNumber.from('1e1000'));
var ach_mile_1 = theory.createAchievement(301, ach_2, "DLC required", "unlock first milestone", () => rho.value >= BigNumber.from(1e20));
var ach_mile_2 = theory.createAchievement(302, ach_2, "third alphabet", "unlock c", () => c.isAvailable);
var ach_mile_3 = theory.createAchievement(303, ach_2, "what do you mean by cosh()?", "unlock cosh() term", () => q1.isAvailable);
var ach_mile_4 = theory.createAchievement(304, ach_2, "Yeah I just broke the limit", "upgrade q2's max level", () => q2Cap.level > 0);

var ach_sec1 = theory.createSecretAchievement(1000,ach_s , 'I thought it would be useful', "Buy 100 level of c when rho > 1e500", "No progress", () => c.level >= 100 && rho.value >= BigNumber.from('1e500'));




init();

var canResetStage = () => isMaxRhoOver('1e50');
var getResetStageMessage = () => `You can perform a reset when your rho is stuck. You WILL NOT get any award IF your current tau value is lower than pevious publication's.`
var resetStage = () => {
  if (theory.canPublish) {
    theory.publish();
    return;
  }
  for (let i = 0; i < theory.upgrades.length; i++) {
    theory.upgrades[i].level = 0;
  }
  rho.value = 0;
  postPublish();

  theory.clearGraph();
}
