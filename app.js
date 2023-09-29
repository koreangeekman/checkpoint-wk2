// SECTION GLOBAL VARIABLES
let interrupts = 0;
let interruptsQueued = 0;

const clickUpgrades = [
  { // adds 'right-click' aka the second mouse button as an option - requires upgrades lvl 2
    name: 'secondMouseBtn',
    cost: 16,
    qty: 1, // max of 1
    bonus: 1,
    lvl: 1,
    enabled: false
  },
  { // adds mouse button 3 - requires upgrades lvl 3
    name: 'mouseBtn3',
    cost: 32,
    qty: 1, // max of 1
    bonus: 1,
    lvl: 1,
    enabled: false
  },
  { // adds mouse button 4  - requires upgrades lvl 4
    name: 'mouseBtn4',
    cost: 64,
    qty: 1, // max of 1
    bonus: 1,
    lvl: 1,
    enabled: false
  },
  { // default scrolls 3 lines at a time... or just mouse button 3 - requires upgrades lvl 5
    name: 'scrollWheel',
    cost: 128,
    qty: 1, // max of 1
    bonus: 3,
    lvl: 1,
    enabled: false
  },
  {
    name: 'gamerMouse',
    cost: 256,
    qty: 1, // max of 1
    bonus: 12, // ALL the extra buttons!; does not get modified by level
  },
  {
    name: 'mouseMovements',
    cost: 65536,
    qty: 1, // max of 1
    bonus: 0, // aka false; disabled until purchased
    lvl: 1,
    enabled: false
  },
  {
    name: 'mouseDPI',
    cost: 8192,
    qty: 1, // max of 1
    bonus: 100, // default: 100, max: 32,000?; dependent on mouseMovements being TRUE; DPI doubles per level - secondary continual upgrade
    lvl: 1,
    enabled: false
  },
  {
    name: 'additionalMice',
    cost: 4096,
    qty: 1, // max of 127
    bonus: 1, // default:1, max 127; as a multiplier, duplicates the potential per mouse added! - primary continual upgrade
    lvl: 1,
    enabled: false
  },
  { // default: 1, a multiplier against the upgrades' effectiveness
    name: 'upgradesLVL',
    cost: 8080,
    qty: 1, // max of 127
    bonus: 1,
    lvl: 1,
    enabled: false
  }]

const autoUpgrades = [
  { // an actual mouse in a mouse wheel with a tab that clicks a computer mouse per rotation - levels add tabs to the wheel
    name: 'mouseWheel',
    cost: 69,
    qty: 1,
    bonus: 1,
    lvl: 1, // decreases interval in steps of 10ms? min 1ms; mouse running faster
    interval: 1000 // in ms
  },
  { // default: 1, a multiplier against the upgrades' effectiveness
    upgradeLVL: 1
  }]
// !SECTION GLOBAL VARIABLES

// SECTION FUNCTIONS

// primary 'resource' gathering method
// example object contents
// {
//   name: 'secondMouseBtn',
//   cost: 16,
//   qty: 1, // max of 1
//   bonus: 1,
//   lvl: 1,
//   enabled: false
// }
function interrupt() {
  let interruptSubtotal = 1;
  clickUpgrades.forEach(upgrade => {
    let upgradeSubtotal = 1;
    if (upgrade.enabled) {
      interruptSubtotal += upgradeSubtotal * upgrade.bonus * upgrade.qty * upgrade.lvl
    }
  })
  interrupts += interruptSubtotal;
  interruptsQueued += interruptSubtotal;
  drawALL()
}

function drawALL() {
  drawStats()
  drawGrandTotal()
}

function drawStats() {
  console.log('boop')
}

function drawGrandTotal() {
  document.getElementById('grandTotal').innerText = interrupts;
}
// init draw
drawGrandTotal()