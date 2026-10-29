const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
class Element {
 constructor(value=''){this.value=value;this.hidden=false;this.disabled=false;this.checked=false;this.textContent='';this.dataset={};this.events={};this.attrs={};const set=new Set();this.classList={add:x=>set.add(x),remove:x=>set.delete(x),contains:x=>set.has(x),toggle:x=>set.has(x)?(set.delete(x),false):(set.add(x),true)};}
 addEventListener(k,f){(this.events[k]??=[]).push(f)} fire(k,e={}){for(const f of this.events[k]??[])f({preventDefault(){},...e})} setAttribute(k,v){this.attrs[k]=v} focus(){this.focused=true}
}
const selectors=['.menu-toggle','#primary-nav','.theme-toggle','#booking-form','#form-status','#total','#download-request','#clear-request','#engineer-label'];
const nodes=Object.fromEntries(selectors.map(x=>[x,new Element()]));
const form=nodes['#booking-form'];form.elements=Object.fromEntries(['service','duration','engineer','date','name','phone','email'].map(x=>[x,new Element()]));Object.assign(form.elements.service,{value:'vocal'});form.elements.duration.value='2';form.reportValidity=()=>true;form.reset=()=>{form.elements.service.value='vocal';form.elements.duration.value='2';form.elements.engineer.checked=false};
const storage=new Map();const doc=new Element();doc.documentElement=new Element();doc.querySelector=s=>nodes[s];doc.querySelectorAll=()=>[];doc.createElement=()=>({click(){}});
const context={document:doc,localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},URLSearchParams,URL,Blob,Date,location:{search:''},setTimeout};
vm.runInNewContext(fs.readFileSync(require('path').join(__dirname,'../script.js'),'utf8'),context);
assert.equal(nodes['#total'].value,'16,000 ₸');
form.elements.engineer.checked=true;form.fire('change');assert.equal(nodes['#total'].value,'26,000 ₸');
form.elements.service.value='mixing';form.fire('change');assert.equal(nodes['#total'].value,'24,000 ₸');assert.equal(form.elements.engineer.disabled,true);
form.elements.service.value='podcast';form.elements.duration.value='4';form.fire('change');assert.equal(nodes['#total'].value,'60,000 ₸');
form.elements.date.value='2099-10-30';form.elements.name.value='Demo Student';form.elements.phone.value='+7 700 123 45 67';form.elements.email.value='demo@example.com';form.fire('submit');assert.equal(JSON.parse(storage.get('waveform-request')).totalKZT,60000);assert.equal(nodes['#download-request'].hidden,false);
nodes['#clear-request'].fire('click');assert.equal(storage.has('waveform-request'),false);assert.equal(nodes['#download-request'].hidden,true);assert.equal(nodes['#total'].value,'16,000 ₸');
form.elements.date.value='2000-01-01';form.fire('submit');assert.equal(storage.has('waveform-request'),false);assert.match(nodes['#form-status'].textContent,/future/);
nodes['.menu-toggle'].fire('click');assert.equal(nodes['.menu-toggle'].attrs['aria-expanded'],'true');doc.fire('keydown',{key:'Escape'});assert.equal(nodes['.menu-toggle'].attrs['aria-expanded'],'false');
nodes['.theme-toggle'].fire('click');assert.equal(doc.documentElement.dataset.theme,'light');assert.equal(storage.get('waveform-theme'),'light');
const patterns=[...fs.readFileSync(require('path').join(__dirname,'../index.html'),'utf8').matchAll(/pattern="([^"]+)"/g)].map(m=>m[1]);const phone=new RegExp('^(?:'+patterns[1]+')$','v');assert(phone.test('+7 700 123 45 67'));assert(!phone.test('----------'));assert(!phone.test('123'));assert(!phone.test('abcdefghij'));
console.log('PASS: actual script executed with a mocked DOM. 18 assertions covering pricing, included engineer, save/delete, past dates, menu, themes and phone pattern. Native browser rendering/validation not tested.');
