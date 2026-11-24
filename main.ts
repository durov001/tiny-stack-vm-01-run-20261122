import{mkdirSync as M,readdirSync as R,readFileSync as F,writeFileSync as W}from'node:fs';
import{join as J}from'node:path';
const B=[(a,b)=>a+b|0,(a,b)=>a-b|0,Math.imul,(a,b)=>a/b|0,(a,b)=>a%b|0,(a,b)=>(a>>>0)/(b>>>0)|0,(a,b)=>(a>>>0)%(b>>>0)|0,0,(a,b)=>a&b,(a,b)=>a|b,(a,b)=>a^b,0,(a,b)=>a<<(b&31),(a,b)=>a>>(b&31),(a,b)=>a>>>(b&31)|0,0,(a,b)=>+(a==b),(a,b)=>+(a<b),(a,b)=>+(a>>>0<b>>>0)];
const S='01146abfxxxxxxxx999999959995999x999xxxxxxxxxxxxx04400xxxxxxxxxxx58xxxxxxxxxxxxxx4414';
function run(p,i){
const D=[],C=[],m=new Int32Array(256),o=[];
let q=0,c=0,s=0,n=p.length;
const e=x=>({out:o,code:x});
for(;;){
if(s==1e6)return e(10);
if(c<0||c>=n)return e(9);
const g=p[c],k=parseInt(S[g],16);
if(isNaN(k))return e(5);
const a=k>>2,u=k&3;
const x=c+1+(g==1?1:g==2?4:g>47&&g<52?2:0);
if(x>n)return e(9);
s++;
const L=D.length;
if(L<a)return e(2);
if(L-a+u>256)return e(3);
c=x;
const t=L-1;
if(g<8){
if(g==0)return e(0);
if(g==1)D.push((p[x-1]<<24)>>24);
else if(g==2)D.push(p.readInt32LE(x-4));
else if(g==3)D.pop();
else if(g==4)D.push(D[t]);
else if(g==5)[D[t],D[t-1]]=[D[t-1],D[t]];
else if(g==6)D.push(D[t-1]);
else[D[t-2],D[t-1],D[t]]=[D[t-1],D[t],D[t-2]];
}else if(g>15&&g<35){
if(g==23)D[t]=-D[t]|0;
else if(g==27)D[t]=~D[t];
else{
const b=D.pop(),z=D.pop();
if(g>18&&g<23&&b==0)return e(4);
D.push(B[g-16](z,b));
}
}else if(g>47&&g<53){
if(g<51){
const r=p.readInt16LE(x-2);
if(g<49||(g==49)==(D.pop()==0))c=x+r;
}else if(g==51){
if(C.length==64)return e(7);
C.push(x);
c=p[x-2]|p[x-1]<<8;
}else{
if(!C.length)return e(8);
c=C.pop();
}
}else if(g==64){
const d=D[t];
if(d<0||d>255)return e(6);
D[t]=m[d];
}else if(g==65){
const d=D.pop(),v=D.pop();
if(d<0||d>255)return e(6);
m[d]=v;
}else if(g==80){
const z=String(D[t]);
if(o.length+z.length>65536)return e(11);
D.pop();
o.push(...Buffer.from(z));
}else if(g==81){
if(o.length>65535)return e(11);
o.push(D.pop()&255);
}else if(g==82)D.push(q<i.length?i[q++]:-1);
else return e(D.pop()&255);
}
}
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
for(const d of R(I).sort()){
const r=run(F(J(I,d,'program.bin')),F(J(I,d,'input.bin')));
M(J(O,d),{recursive:true});
W(J(O,d,'stdout.bin'),Buffer.from(r.out));
W(J(O,d,'exit.txt'),r.code+'\n');
}
