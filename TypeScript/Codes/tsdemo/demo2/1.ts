#!/usr/bin/env ts-node

function createPrefix(n: number): string {
  return '----'.repeat(n);
}

{
  class Person {
    public children: Person[] = [];
    constructor(public name: string) {}
    addChild(child: Person): void {
      this.children.push(child);
    }
    introduceFamily(n?: number): void {
      n = n || 1
      console.log(`${createPrefix(n-1)}${this.name}`);
      this.children.forEach(child => {
        child.introduceFamily(n + 1);
      });
    }
  }

  let grandPa = new Person('wangmazi');
  let child1 = new Person('wangzi');
  let child2 = new Person('wangdachui');
  let person11 = new Person('wangmao');
  let person12 = new Person('wangshui');
  let person21 = new Person('wanglongyao');
  let person22 = new Person('wangrongyao');

  grandPa.addChild(child1);
  grandPa.addChild(child2);

  child1.addChild(person11);
  child1.addChild(person12);

  child2.addChild(person21);
  child2.addChild(person22);

  grandPa.introduceFamily();
}
// console.log(process.argv)
// console.log('hello world')