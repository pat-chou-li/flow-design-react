function a() {
  this.b = 3;
}
var c = new a();
// a.prototype.b = 9;
var b = 7;
// a();

//分别输出什么？为什么？
console.log(b);
console.log(c.b);
