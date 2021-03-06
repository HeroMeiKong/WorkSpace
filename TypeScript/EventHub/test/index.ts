import EventHub from '../src/index';

type TestCase = (message: string) => void

const test1: TestCase = message => {
  const eventHub = new EventHub();
  console.assert(eventHub instanceof Object === true, "eventhub 是个对象");
  console.log(message);
};

const test2: TestCase = message => {
  const eventHub = new EventHub();
  let called = false;
  eventHub.on("xxx", y => {
    called = true;
    console.assert(y === "猜对了");
  });
  eventHub.emit("xxx", "猜对了");
  console.assert(called);
  console.log(message);
};

const test3: TestCase = message => {
  const eventHub = new EventHub();
  let called = false;
  const f1 = () => { called = true; };
  eventHub.on("yyy", f1);
  eventHub.off("yyy", f1);
  eventHub.emit("yyy");
  console.assert(called === false);
  console.log(message);
};

test1("EventHub可以创建对象");
test2(".on注册时候，使用.emit触发.on函数");
test3(".off函数有用");