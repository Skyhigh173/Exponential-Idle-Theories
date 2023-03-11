import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "deri_eq";
var name = "Derivative Equation";
var description = "\
A simple theory with a single function - f(x)\n\
x increase over time,\n\
however with caps. \n\
you can buy upgrades to make f(x) and x gain more powerful but reset x.\n\
\n\
feeling slow? Try idling.\n\
";
var authors = "skyhigh173#3120";
var version = 3;

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
var getC = (level=c.level) => Utils.getStepwisePowerSum(level, 1.8, 11, 0) / BigNumber.TWO;
var getN = (level=n.level) => BigNumber.TWO.pow(level * 0.3); //Utils.getStepwisePowerSum(level, 2.4, 8, 2) / BigNumber.TWO;
var getCapX = (level=capX.level) => BigNumber.from(1024) * getExtraCapX().pow(level);
var getExtraCapX = () => BigNumber.from(5 + extraCap.level * 4);
var getNExp = () => BigNumber.from(1.2 - 0.6 * nExp.level);

var isCappedX = () => x >= getCapX();
var isTauOver = (over) => theory.tau.pow(10) >= BigNumber.from(over);

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
    let getDesc = (level) => "n = " + getN(level).toString(1);
    let getInfo = (level) => `n = 2^{${BigNumber.from(0.3 * level).toString(1)}}`
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
  }

  theory.createPublicationUpgrade(0, rho, 5e8);
  theory.createBuyAllUpgrade(1, rho, 1e15);
  theory.createAutoBuyerUpgrade(2, rho, 1e40);

  // capX
  {
    capX = theory.createPermanentUpgrade(3, rho, new ExponentialCost(1e7, 12));
    capX.getDescription = (amount) => `$\\times x\\text{'s cap by } ${getExtraCapX().pow(amount).toString(0)}$`;
    capX.getInfo = (amount) => `$\\times 1 \\rightarrow \\times ${getExtraCapX().pow(amount).toString(0)} \\text{ (cap:${getCapX().toString(0)})}$`
    capX.boughtOrRefunded = (_) => resetX();
  }

  // dev
  {
    dev.rho = theory.createPermanentUpgrade(4, rho, new FreeCost());
    dev.rho.getDescription = (amount) => `dev : $\\times 1e10 \\rho$`;
    dev.rho.getInfo = (amount) => `will remove soon`;
    dev.rho.boughtOrRefunded = (_) => {rho.value *= BigNumber.from(1e10)};
  }

  theory.setMilestoneCost(new LinearCost(2, 2.5));
  // 1e20, e25

    {
      extraCap = theory.createMilestoneUpgrade(0, 4);
      extraCap.description = Localization.getUpgradeIncCustomDesc("x \\text{'s cap multiplier} ", "4");
      extraCap.info = "increase $x$'s cap multiplier by 4"
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
    }
  
}

var getPrimaryEquation = () => {
  theory.primaryEquationHeight = 100;
  theory.primaryEquationScale = 1.2;
  
  let r = "\\begin{matrix}";
  r += "\\dot{\\rho} = n \\frac{d}{dx} f(x) \\\\";
  r += "f(w) = aw + bw^{2}";
  if (c.isAvailable) {r += " + \\frac{cw^{3}}{\\log_{1.1}(\\max(\\rho,2))}"}
  r += "\\end{matrix}";

  return r;
}
var getSecondaryEquation = () => {
  let e = getNExp();
  let nExpText = e == BigNumber.ZERO ? "a" : `\\frac{a}{n^{${e.toString(1)}}}`
  let r = `\\dot{x} = n\\ln\\left(\\max\\left(${nExpText},e\\right)\\right)`;
  
  return r;
}
var getTertiaryEquation = () => {
  
  return `\\dot{\\rho} = ${dotrho.toString(1)} \\qquad x = ${x.toString(1)} ${isCappedX() ? `\\text{ (capped at ${getCapX().toString()})}` : ""}`;
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
  dotrho = sums * getN();
  rho.value += dotrho * dt * bonus;

  if (rho.value != BigNumber.ZERO) {
    x += getN() * (BigNumber.E.max(getA()/(getN().pow(getNExp())))).log() * dt;
    if (isCappedX()) {
      x = getCapX();
    }
  }

  theory.invalidateTertiaryEquation();
  capX.isAvailable = isTauOver(1e7);
  cMS.isAvailable = isTauOver(1e80);
  c.isAvailable = cMS.level > 0;
}


var ach_x_1 = theory.createAchievement(100, "x have limitations", "reach x cap", isCappedX);
var ach_x_2 = theory.createAchievement(101, "broken x!", "increase x's cap", () => capX.level > 0);
var ach_x_2 = theory.createAchievement(102, "POWER", "reach x = 1e10", () => x >= BigNumber.from(1e10));
var ach_x_3 = theory.createAchievement(103, "faster than f(t)", "reach x = 1e15", () => x >= BigNumber.from(1e15));
var ach_rho_1 = theory.createAchievement(200, "like x^2 gain", "reach 1e10 rho", () => rho.value >= BigNumber.from(1e10));
var ach_rho_2 = theory.createAchievement(201, "like 2^x gain", "reach 1e25 rho", () => rho.value >= BigNumber.from(1e25));
var ach_rho_3 = theory.createAchievement(202, "rho explodes", "reach 1e50 rho", () => rho.value >= BigNumber.from(1e50));
var ach_rho_4 = theory.createAchievement(203, "nice number", "reach 6.9e69 rho", () => rho.value >= BigNumber.from(6.9e69));
var ach_rho_5 = theory.createAchievement(204, "like going into rocket", "reach 1e100 rho", () => rho.value >= BigNumber.from(1e100));
var ach_mile_1 = theory.createAchievement(301, "5 stars rating", "unlock first milestone", () => rho.value >= BigNumber.from(1e20));
var ach_mile_2 = theory.createAchievement(302, "another variable!?!?", "unlock c", () => c.isAvailable);


//var ach2 = theory.createSecretAchievement(1, "Achievement 2", "Description 2", "Maybe you should buy two levels of c2?", () => c2.level > 1);




init();


