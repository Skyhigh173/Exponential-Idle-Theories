import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber, parseBigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "Quadratic_Equation";
var name = "Quadratic Equation";
var description = "alpha version 2\nin test. things won't go so smoothly yet.";
var authors = "skyhigh173";
var version = 1;

var currency;
var a, b, c, n, refA;
var highestALevel;
var delta;
var X1 = BigNumber.ZERO, X2 = BigNumber.ZERO;

var bExp, deltaCurrency, refundA;

function gcd(x, y) {
  while (y !== 0) {
    let temp = y;
    y = x % y;
    x = temp;
  }
  return Math.abs(x);
}

var simplify = (a, b) => [a / gcd(a,b), b / gcd(a,b)];

var getPrimaryEquation = () => {
  let r = `ax^2+bx+c=0 \\\\ \\\\ \\dot \\Delta = ${deltaCurrency.level == 0 ? '' : 'n'} \\sqrt{b^{${getBExp()}} - 4ac} \\qquad \\dot \\rho = \\Delta^{2/3} |x_1||x_2|`;
  return "\\begin{matrix}" + r + "\\end{matrix}";
}

var getSecondaryEquation = () => {
  return `|x_1| = ${X1.toString()}, |x_2| = ${X2.toString()} ${deltaCurrency.level == 0 ? `, \\Delta = ${delta.value.toString()}` : ''}`;
}

//var getTertiaryEquation = () => `b^${getBExp()}: ${getB().pow(getBExp())}, 4ac: ${-BigNumber.FOUR*getC()/getinvA()}`;

var init = () => {
  currency = theory.createCurrency();
  delta = theory.createCurrency('Δ', '\\Delta');
  theory.primaryEquationHeight = 60;

  // a
  {
    let getDesc = (level) => `a=2^{-${level}}`;
    a = theory.createUpgrade(0, currency, new ExponentialCost(10000, Math.log2(140)));
    a.getDescription = (amount) => Utils.getMath(getDesc(a.level));
    a.getInfo = (amount) => Utils.getMathTo('a=1/'+getinvA(a.level), 'a=1/'+getinvA(a.level + amount));
    highestALevel = 0;
  }

  // b
  {
    let getDesc = (level) => `b = ${getB(level)}`;
    b = theory.createUpgrade(1, currency, new ExponentialCost(100, Math.log2(4)));
    b.getDescription = (amount) => Utils.getMath(getDesc(b.level));
    b.getInfo = (amount) => Utils.getMathTo(getDesc(b.level), getDesc(b.level + amount));
  }

  // c
  {
    let getDesc = (level) => `c=-(4/3)^{${level}}`;
    c = theory.createUpgrade(2, currency, new FirstFreeCost(new ExponentialCost(5, Math.log2(1.8))));
    c.getDescription = (amount) => Utils.getMath(getDesc(c.level));
    c.getInfo = (amount) => Utils.getMathTo('c='+getC(c.level), 'c='+getC(c.level + amount));
  }

  // n
  {
    let getDesc = (level) => `n=${getN(level)}`;
    n = theory.createUpgrade(3, delta, new ExponentialCost(1e10, Math.log2(6)));
    n.getDescription = (amount) => Utils.getMath(getDesc(n.level));
    n.getInfo = (amount) => Utils.getMathTo('n='+getN(n.level), 'n='+getN(n.level + amount));
  }

  theory.createPublicationUpgrade(0, currency, 1e10);
  theory.createBuyAllUpgrade(1, currency, 1e15);
  theory.createAutoBuyerUpgrade(2, currency, 1e30);

  {
    refA = theory.createPermanentUpgrade(3, currency, new FreeCost());
    refA.description = 'Refund $a$.';
    refA.getInfo = () => `refund $a$.`;
    refA.bought = (_) => a.level -= 1;
  }

  theory.setMilestoneCost(new LinearCost(25, 25));


  {
    bExp = theory.createMilestoneUpgrade(0, 6);
    bExp.description = Localization.getUpgradeIncCustomExpDesc("b", "0.05");
    bExp.info = Localization.getUpgradeIncCustomExpInfo("b", "0.05");
    bExp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    bExp.canBeRefunded = () => deltaCurrency.level == 0;
  }

  {
    deltaCurrency = theory.createMilestoneUpgrade(1, 1);
    deltaCurrency.description = 'Unlock $\\Delta$ upgrades';
    deltaCurrency.info = 'Unlock $\\Delta$ upgrades';
    deltaCurrency.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
  }

  {
    refundA = theory.createMilestoneUpgrade(2, 2);
    refundA.getDescription = () => `You can refund ${getRefundALevel(refundA.level + 1)} levels of $a$.`;
    refundA.getInfo = () => `Refund $a$ to ($\\text{highest }a\\text{ level }- \\text{ } ${getRefundALevel(refundA.level + 1)} $)`;
    refundA.canBeRefunded = (_) => getRefundALevel(refundA.level - 1) >= refA.level;
  }
}

var update = () => {
  deltaCurrency.isAvailable = bExp.level > 1;
  refundA.isAvailable = bExp.level > 1;

  n.isAvailable = deltaCurrency.level == 1;
  refA.isAvailable = refundA.level > 0;
}

var tick = (elapsedTime, multiplier) => {
  let dt = elapsedTime * multiplier * 1;
  let bonus = theory.publicationMultiplier;
  update();

  let A = getinvA(), B = getB(), C = getC();

  X1 = (-B-(B*B - BigNumber.FOUR * C / A).sqrt() / BigNumber.TWO * A).abs();
  X2 = (-B+(B*B - BigNumber.FOUR * C / A).sqrt() / BigNumber.TWO * A).abs();
  theory.invalidateSecondaryEquation();

  if (a.level > highestALevel) highestALevel = a.level;
  refA.level = highestALevel - a.level;
  refA.maxLevel = getRefundALevel();
  
  if (c.level == 0) return;
  delta.value += (B.pow(getBExp()) - BigNumber.FOUR / A * C).sqrt() * (deltaCurrency.level == 0 ? BigNumber.ONE : getN()) * dt;
  currency.value += delta.value.pow(2/3) * X1 * X2 * dt * bonus;
}

var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();
var getTau = () => currency.value;

var canResetStage = () => true;
var resetStage = () => { a.level = 0; b.level = 0; c.level = 0; delta.value = BigNumber.ONE; currency.value = BigNumber.ZERO; theory.clearGraph(); highestALevel = 0; }
var getResetStageMessage = () => 'You are about to reset this publication.';

var getPublicationMultiplier = (tau) => (tau * tau.max(BigNumber.TEN).log10()).pow(0.18);
var getPublicationMultiplierFormula = (symbol) => `(${symbol} \\log ${symbol})^{0.18}`;
var postPublish = () => resetStage();

var getinvA = (level = a.level) => BigNumber.TWO.pow(level);
var getB = (level = b.level) => Utils.getStepwisePowerSum(level, 5, 6, 0);
var getC = (level = c.level) => -BigNumber.from(4/3).pow(level);
var getN = (level = n.level) => Utils.getStepwisePowerSum(level, 3, 10, 1);
var getBExp = (level = bExp.level) => 2+0.05*level;
var getRefundALevel = (level = refundA.level) => Math.min(10, 5*level);

var isCurrencyVisible = index => index == 0 || (index == 1 && deltaCurrency.level == 1);

init();
