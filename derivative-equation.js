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
var version = 2;

// currency
var rho;
var dotrho = BigNumber.ZERO;

// upgrades
var n,a,b;

// x
var x = BigNumber.ZERO;

// perm
var capX;

// milestone
var extraCap, nExp;

// func
var getA = (level=a.level) => Utils.getStepwisePowerSum(level, 2.2, 5, 0);
var getB = (level=b.level) => Utils.getStepwisePowerSum(level, 3, 7, 0);
var getN = (level=n.level) => BigNumber.TWO.pow(level * 0.3); //Utils.getStepwisePowerSum(level, 2.4, 8, 2) / BigNumber.TWO;
var getCapX = (level=capX.level) => BigNumber.from(1024) * getExtraCapX().pow(level);
var getExtraCapX = () => BigNumber.from(5 + extraCap.level * 4);
var getNExp = () => BigNumber.from(1.2 - 0.6 * nExp.level);

var isCappedX = () => x >= getCapX();
var isTauOver = (over) => theory.tau.pow(5) >= BigNumber.from(over);

var get2DGraphValue = () => rho.value.sign * (BigNumber.ONE + rho.value.abs()).log10().toNumber();
var getPublicationMultiplier = (tau) => tau.pow(0.8) / BigNumber.TWO;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.8}}{2}";
var getTau = () => rho.value.pow(BigNumber.from(0.2));
var getCurrencyFromTau = (tau) => [tau.pow(5), rho.symbol];

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
    capX.getDescription = (amount) => `$\\times x\\text{'s cap by } ${getExtraCapX().pow(amount).toString(0)}$`;
    capX.getInfo = (amount) => `$\\times 1 \\rightarrow \\times ${getExtraCapX().pow(amount).toString(0)} \\text{ (cap:${getCapX()})}$`
    capX.boughtOrRefunded = (_) => resetX();
  }

  theory.setMilestoneCost(new LinearCost(4, 4));

    {
      extraCap = theory.createMilestoneUpgrade(0, 4);
      extraCap.description = Localization.getUpgradeIncCustomDesc("x \\text{'s cap multiplier} ", "4");
      extraCap.info = "increase $x$'s cap multiplier by 4"
    }
    {
      nExp = theory.createMilestoneUpgrade(1, 2);
      nExp.getDescription = () => nExp.level == 1 ? "no longer ${\\div n^{0.6}}$" : "$\\downarrow n$'s exponent by $0.6$";
      nExp.getInfo = () => nExp.level == 1 ? "no longer $\\div n$ in $\\dot{x}$ term" : "decrease $n$'s exponent by $0.6$ in $\\dot{x}$ term"
      nExp.boughtOrRefunded = (_) => theory.invalidateSecondaryEquation();
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
    BigNumber.TWO * getB() * x
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
}


init();

