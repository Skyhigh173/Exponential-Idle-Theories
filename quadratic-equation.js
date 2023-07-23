import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber, parseBigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "quad_eq";
var name = "Quadratic Equation";
var description = "alpha version 1\nlooking for the sum of solves of quadratic equations, however this time we take its absolute value.\nmay have balance change and new terms etc.\nI tried to keep this ct simple and clean, style like T1-8.";
var authors = "skyhigh173";
var version = 1;

var currency;
var a,b,c;
var q1,q2;
var q = BigNumber.ONE;
var vx0, vx1;

var aBase, qExp;

var getPrimaryEquation = () => {
  let r = `ax^2+bx+c=0 \\\\ \\dot \\rho = q${qExp.level == 0 ? "" : `^{${1+0.05*qExp.level}}`}(|x_0| + |x_1|)`;
  return "\\begin{matrix}" + r + "\\end{matrix}";
}
var getSecondaryEquation = () => {
  return `\\dot q = q_1q_2/q \\quad ${theory.latexSymbol} = \\max \\rho`;
}
var getTertiaryEquation = () => {
  return `q = ${q.toString(2)} \\quad x_0 = ${vx0} \\quad x_1 = ${vx1}`;
}
var init = () => {
  theory.primaryEquationHeight = 60;
  currency = theory.createCurrency();

  // a
  {
    let getDesc = (level) => `a=${Math.round((5.3+aBase.level*0.3)*10)/10}^{` + (level == 0 ? "" : "-") + level + "}";
    //let getInfo = (level) => "a=" + (5.3+aBase.level*0.3) ** (-level);//getA(level).toString();
    a = theory.createUpgrade(0, currency, new ExponentialCost(20, Math.log2(30)));
    a.getDescription = (amount) => Utils.getMath(getDesc(a.level));
    a.getInfo = (amount) => Utils.getMathTo(getDesc(a.level), getDesc(a.level + amount));
  }

  // b
  {
    let getDesc = (level) => `b= ` + getPB(level).toString(0) + `\\times ${level % 2 == 0 ? "1" : "-1" }`;
    //let getInfo = (level) => "b=" + getB(level).toString(0);
    b = theory.createUpgrade(1, currency, new ExponentialCost(40, Math.log2(1.6)));
    b.getDescription = (amount) => Utils.getMath(getDesc(b.level));
    b.getInfo = (amount) => Utils.getMathTo(getDesc(b.level), getDesc(b.level + amount));
  }

  // c
  {
    let getDesc = (level) => "c=" + getC(level).toString(0);
    let getInfo = (level) => "c=" + getC(level).toString(0);
    c = theory.createUpgrade(2, currency, new FirstFreeCost(new ExponentialCost(8, Math.log2(1.6))));
    c.getDescription = (amount) => Utils.getMath(getDesc(c.level));
    c.getInfo = (amount) => Utils.getMathTo(getInfo(c.level), getInfo(c.level + amount));
  }

  // q1
  {
    let getDesc = (level) => "q_1=" + getQ1(level).toString(0);
    let getInfo = (level) => "q_1=" + getQ1(level).toString(0);
    q1 = theory.createUpgrade(3, currency, new ExponentialCost(100, Math.log2(3.8)));
    q1.getDescription = (amount) => Utils.getMath(getDesc(q1.level));
    q1.getInfo = (amount) => Utils.getMathTo(getInfo(q1.level), getInfo(q1.level + amount));
  }

  // q2
  {
    let getDesc = (level) => "q_2=" + getQ2(level).toString(0);
    let getInfo = (level) => "q_2=" + getQ2(level).toString(0);
    q2 = theory.createUpgrade(4, currency, new ExponentialCost(1500, Math.log2(4)));
    q2.getDescription = (amount) => Utils.getMath(getDesc(q2.level));
    q2.getInfo = (amount) => Utils.getMathTo(getInfo(q2.level), getInfo(q2.level + amount));
  }

  theory.createPublicationUpgrade(0, currency, 1e10);
  theory.createBuyAllUpgrade(1, currency, 1e18);
  theory.createAutoBuyerUpgrade(2, currency, 1e30);

  theory.setMilestoneCost(new LinearCost(25, 25));
  {
    let getBase = lv => Math.round((5.3 + 0.3 * lv) * 10) / 10;
    let getDesc = lv => `a = ${getBase(lv)}^{-\\text{level}}`;
    aBase = theory.createMilestoneUpgrade(0, 2);
    aBase.getInfo = (_) => {
      if (aBase.level == 2) return Utils.getMath(getDesc(2));
      return Utils.getMathTo(getDesc(aBase.level),getDesc(aBase.level+1));
    }
    aBase.getDescription = (_) => Utils.getMath("\\uparrow a \\text{'s base by } 0.3");
    aBase.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
  }
  {
    qExp = theory.createMilestoneUpgrade(1, 6);
    qExp.getDescription = (_) => Localization.getUpgradeIncCustomExpDesc("q","0.05");
    qExp.getInfo = (_) => Localization.getUpgradeIncCustomExpInfo("q","0.05");
    qExp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
  }
}

var getInternalState = () => `${q}`;
var setInternalState = (state) => {
  let values = state.split(" ");
  if (values.length > 0) q = parseBigNumber(values[0]);
}

var postPublish = () => {
  q = BigNumber.ONE;
}


var tick = (elapsedTime, multiplier) => {
  let va =  getA();
  let vb =  getB();
  let vc =  getC();
  let vq1 = getQ1();
  let vq2 = getQ2();
  vx0 = (-vb + (vb.square() - BigNumber.FOUR * va * vc).sqrt()) / (va * BigNumber.TWO);
  vx1 = (-vb - (vb.square() - BigNumber.FOUR * va * vc).sqrt()) / (va * BigNumber.TWO);

  let dt = elapsedTime * multiplier;
  let bonus = theory.publicationMultiplier;

  if (q < BigNumber.ONE) q = BigNumber.ONE;
  q += vq1 * vq2 / q * dt;
  currency.value += dt * bonus * q.pow(1 + 0.05 * qExp.level) * (vx0.abs() + vx1.abs());
  theory.invalidateTertiaryEquation();
}

var getA = (level = a.level)  =>  BigNumber.from(5.3+0.3*aBase.level).pow(-level);
var getPB = (level = b.level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getB = (level = b.level)  => Utils.getStepwisePowerSum(level, 2, 10, 0) * (level % 2 == 0 ? BigNumber.ONE : -BigNumber.ONE);
var getC = (level = c.level)  => -Utils.getStepwisePowerSum(level, 3, 10, 0);
var getQ1 = (level = q1.level) => Utils.getStepwisePowerSum(level, 2, 8, 0);
var getQ2 = (level = q2.level) => Utils.getStepwisePowerSum(level, 3, 10, 1);

var getPublicationMultiplier = (tau) => tau.pow(0.225) / BigNumber.TEN;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.225}}{10}";
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();


init();
