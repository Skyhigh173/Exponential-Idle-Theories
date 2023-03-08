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
feeling slow? Try idling.\
";
var authors = "skyhigh173#3120";
var version = 1;

// currency
var rho;
var dotrho = BigNumber.ZERO;

// upgrades
var n,a,b;

// x
var x = BigNumber.ZERO;

// perm
var capX;

// func
var getA = (level=a.level) => Utils.getStepwisePowerSum(level, 2.2, 5, 0);
var getB = (level=b.level) => Utils.getStepwisePowerSum(level, 3, 7, 0);
var getN = (level=n.level) => BigNumber.TWO.pow(level * 0.3); //Utils.getStepwisePowerSum(level, 2.4, 8, 2) / BigNumber.TWO;
var getCapX = (level=capX.level) => BigNumber.from(1024) * BigNumber.FIVE.pow(level);

var isCappedX = () => x >= getCapX();

var get2DGraphValue = () => rho.value.sign * (BigNumber.ONE + rho.value.abs()).log10().toNumber();
var getPublicationMultiplier = (tau) => tau.pow(0.8) / BigNumber.TWO;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.8}}{2}";
var getTau = () => rho.value.pow(0.2);

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

  theory.createPublicationUpgrade(0, rho, 5e8);
  theory.createBuyAllUpgrade(1, rho, 1e15);
  theory.createAutoBuyerUpgrade(2, rho, 1e40);

  // capX
  {
    capX = theory.createPermanentUpgrade(3, rho, new ExponentialCost(1e7, 12));
    capX.getDescription = (_) => "$\\times x\\text{'s cap by } 5$";
    capX.getInfo = (amount) => `$\\times 1 \\rightarrow \\times ${BigNumber.FIVE.pow(amount).toString(0)} \\text{ (cap:${getCapX()})}$`
    capX.boughtOrRefunded = (_) => resetX();
  }
}

var getPrimaryEquation = () => {
  theory.primaryEquationHeight = 100;
  theory.primaryEquationScale = 1.2;
  
  let r = "\\begin{matrix}";
  r += "\\dot{\\rho} = n \\frac{d}{dx} f(x) \\\\";
  r += "f(w) = aw + bw^{2}";
  r += "\\end{matrix}";

  return r;
}
var getSecondaryEquation = () => {
  let r = "\\dot{x} = n\\ln\\left(\\max\\left(\\frac{a}{n^2},e\\right)\\right)";
  
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
    BigNumber.TWO * getB() * x
  ];
  let sums = BigNumber.ZERO;
  terms.forEach(val => {sums += val});
  dotrho = sums * getN();
  rho.value += dotrho * dt * bonus;

  if (rho.value != BigNumber.ZERO) {
    x += getN() * (BigNumber.E.max(getA()/(getN().pow(BigNumber.TWO)))).log() * dt;
    if (isCappedX()) {
      x = getCapX();
    }
  }

  theory.invalidateTertiaryEquation();
  capX.isAvailable = theory.tau >= BigNumber.TEN; // 10^5
}


init();
