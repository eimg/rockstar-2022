# Rockstar Developer 2022

ကုဒ်နမူနာများ လေ့လာရန်နှင့် လက်တွေ့ ရေးသားစမ်းသပ်ရန် Twitter ပုံစံတူ နမူနာပရောဂျက်။

## Development Stack (အသုံးပြုထားသည့် နည်းပညာများ)

* React Front-end
* Express API Back-end
* MongoDB Database
* MUI UI Framework

## Requirements (လိုအပ်ချက်)

* Node  ~14.15.1
* NPM 	~8.19.2
* MongoDB  ~6.0.3

## Instructions (လမ်းညွှန်ချက်)

1. MongoDB Community Server ကို အောက်ပါလင့်တွင် Download ရယူ၍ ၄င်း၏လမ်းညွှန်ချက်များနှင့်အညီ Install ပြုလုပ် ထည့်သွင်းထားပါ။ 

<a href="https://www.mongodb.com/try/download/community">
	https://www.mongodb.com/try/download/community
</a>

2. Node မရှိသေးပါက အောက်ပါလိပ်စာတွင် Download ရယူ၍ Install ပြုလုပ်ပါ။

<a href="https://nodejs.org/en/">
	https://nodejs.org/en/
</a>

3. ကုဒ်နမူနာတွင် အစိတ်အပိုင်း (၃) ပိုင်းပါဝင်သည်။ api, client, tools တို့ဖြစ်ကြသည်။ တစ်ပိုင်းချင်းစီအတွက် လိုအပ်သည့် Node Modules များကိုယူရန်၊ သက်ဆိုင်ရာ ဖိုဒါတစ်ခုချင်းစီအတွင်း npm instll Run ၍ ထည့်သွင်းပါ။

```
cd api
npm install

cd ../client
npm install

cd ../tools
npm install
```

4. လိုအပ်သည့် Database နှင့် နမူနာ Data များရရှိရန် tools/seeds.js ကို Run ပါ။

```
node tools/seeds.js
```

5. API Server ကို Run ပါ။ ဆက်လက်စမ်းသပ်နိုင်ရန် Run လက်စ Server ကို မပိတ်လိုက်ဘဲ ဆက် Run ထားရမည် ဖြစ်ပါသည်။

```
node api/index.js
```

6. React Client ကို Run ပါ။

```
cd client
npm start
```

<img src="https://i.imgur.com/XptCUfR.png" alt="Sample Screenshot">

7. User Account အသစ်တည်ဆောက်၍ သော်လည်းကောင်း၊ နမူနာ User Account အဖြစ် alice အတွက် Password နေရာတွင် password ကိုထည့်သွင်း၍ စတင်စမ်းသပ်နိုင်ပြီဖြစ်ပါသည်။

## Todo (ဆက်လက်ထည့်သွင်းရန် ရည်ရွယ်ထားသည်များ)

* Search
* Mention
* Continues Loading
* Real-time Notis