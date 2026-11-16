// PERSONALISE THIS FILE. Add lake.jpg, lulu.jpg, tekken.jpg and optional music.mp3.
const CONFIG={
 birthdayMessage:"Happy 21st, my little girl! ❤️\n\nI hope you liked this little quest from me.\n\nIt's been three and a half years of us being together, and it's been a lovely journey. I want our bond to become purer and healthier with each passing day. I hope that one day, we'll be together, understanding and accepting everything as one mind and one body.\n\nI hope this birthday turns out to be a very special one for you. May the Lord give you all the strength you need to handle me and the world! 😂\n\nI'm looking forward to all the days we'll spend together in the future. Let's make our solo trip happen soon and enjoy every little moment of life.\n\nAnd one important thing… there's a surprise waiting for you at home! I'll give you a clue. Guess what it is and go find it when you're home. 😉\n\nLove you, Chello! ❤️",
 riddle:"Your final mission:\n\nFind something that has been waiting for you.\n\nIt has a place of its own, but it isn't alive.\nIt holds something without keeping it.\nAnd although it never moves, it might make you stop for a moment.\n\nLook carefully when you get home.\n\nMISSION: UNLOCK THE FINAL SURPRISE. ❤️",
 chapters:[
 {tag:"CASE 001",no:"01",kicker:"THE REFLECTION",title:"An evening<br><em>that stayed.</em>",story:"It was an evening after a special day at church.\n\nYou were dressed up, we spent some time together, talking about random things, and taking a few pictures.\n\nAs the evening went on, we sat together, surrounded by a beautiful view, listening to a song whose words said it all — “Your life is my melody.”",question:"Can you recall the song we listened to together that evening?",answers:["Mogathirai","A song we hadn't heard","A random playlist","No music at all"],correct:0,feedback:"You remembered. Some songs keep a whole moment safe.",photo:"lake.jpg",photoLabel:"THE EVENING I KEEP",reveal:"A lake, a photograph, a random conversation — and Mogathirai in the background. I felt so loved in that moment. I hope this picture brings it all back."},
 {tag:"CASE 002",no:"02",kicker:"SUDDEN JOURNEY",title:"The night<br><em>out.</em>",story:"",question:"",answers:[],correct:0,feedback:"",photo:"lulu.jpg",photoLabel:"A NIGHT TO REMEMBER",reveal:"From that little shopping trip to the food we shared, every moment became a memory I still smile about.\n\nI remember how beautiful you looked in your jimmiki, the photograph I couldn't stop admiring, and how I had to convince you to try Kalaki for the first time. 😂\n\nWe went out just to spend some time together, but somehow, that night became one of my favourite memories with you."},
 {tag:"CASE 003",no:"03",kicker:"SKILL GAP",title:"Player one<br><em>versus player two.</em>",story:"Our first PS5 experience together. You were learning the controls, I was already feeling like a champion, and let's be honest — it was a tough match for you. The important part is that we played together.",question:"Who was clearly the better player that day?",answers:["You, obviously","Me, obviously","The controller","Nobody — it was a draw"],correct:1,feedback:"Correct answer. Player One remains undefeated. For now.",photo:"tekken.jpg",photoLabel:"PLAYER TWO: SURVIVED",reveal:"MATCH RESULT:\n\nPLAYER ONE — UNDEFEATED 🏆\n\nPLAYER TWO — FRIENDLY RAGE MODE ACTIVATED. 😂\n\nYou may have lost the matches, but you made that gaming session one of my favourite memories.\n\nAnd yes… I'm still waiting for my rematch!\n\nBecause honestly, the real victory was getting to share that moment with you. ❤️"}
 ]};
const $=id=>document.getElementById(id);$("birthdayMessage").textContent=CONFIG.birthdayMessage;$("riddle").textContent=CONFIG.riddle;
let done=[false,false,false],current=0,answered=false,hintUsed=false,hintTimer=null,case2Stage=0,case2HintTimer=null,case3Stage=0,case3HintTimer=null;
function normalizeAnswer(value){
 return value.toLocaleLowerCase().replace(/[^a-z0-9]/g,"");
}
function editDistance(a,b){
 const row=Array.from({length:b.length+1},(_,i)=>i);
 for(let i=1;i<=a.length;i++){
  let previous=row[0];row[0]=i;
  for(let j=1;j<=b.length;j++){
   const old=row[j];
   row[j]=Math.min(row[j]+1,row[j-1]+1,previous+(a[i-1]===b[j-1]?0:1));
   previous=old;
  }
 }
 return row[b.length];
}
function isCloseSongTitle(value){
 const typed=normalizeAnswer(value);
 return typed.length>0&&editDistance(typed,"mogathirai")<=2;
}
function isAcceptedAnswer(value,kind){
 const typed=normalizeAnswer(value);
 const accepted={
  lulu:["lulu","lulumall","lulushoppingmall"],
  kalaki:["kalaki","kalakii","kalakki"],
  ps5:["ps5","playstation5"]
 };
 if((accepted[kind]||[]).includes(typed))return true;
 const canonical={lulu:"lulu",kalaki:"kalaki"}[kind];
 return Boolean(canonical&&typed.length>0&&editDistance(typed,canonical)<=1);
}
function show(id){document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===id));window.scrollTo({top:0,behavior:"smooth"});}
document.querySelectorAll("[data-show]").forEach(b=>b.addEventListener("click",()=>show(b.dataset.show)));
function update(){document.querySelectorAll(".stop").forEach((b,i)=>{let open=i===0||done[i-1];b.classList.toggle("locked",!open);b.querySelector("i").textContent=done[i]?"COMPLETED ✓":open?"OPEN ↗":"LOCKED";});let n=done.filter(Boolean).length;$("progress").textContent=`MEMORIES UNLOCKED ${n} / 3`;$("bar").style.width=(n/3*100)+"%";}
document.querySelectorAll(".stop").forEach(b=>b.addEventListener("click",()=>{let i=+b.dataset.ch;if(i>0&&!done[i-1])return;load(i);show("quest");}));
function load(i){
 current=i;answered=false;hintUsed=false;
 if(hintTimer){clearTimeout(hintTimer);hintTimer=null;}
 if(case2HintTimer){clearTimeout(case2HintTimer);case2HintTimer=null;}
 if(case3HintTimer){clearTimeout(case3HintTimer);case3HintTimer=null;}
 let c=CONFIG.chapters[i];
 $("chapter").textContent=`CHAPTER 0${i+1} / 03`;
 $("artNo").textContent=c.no;$("artTag").textContent=c.tag;$("kicker").textContent=c.kicker;
 $("title").innerHTML=c.title;$("story").textContent=c.story;$("question").textContent=c.question;
 $("feedback").textContent=done[i]?"Already unlocked — revisit the memory.":"";
 $("unlock").disabled=!done[i];$("answers").innerHTML="";
 if(i===0){
  const input=document.createElement("input");
  input.type="text";input.id="caseCode";input.autocomplete="off";input.spellcheck=false;
  input.placeholder="Enter the song title";
  input.setAttribute("aria-label","Enter the song title");
  input.style.cssText="width:100%;box-sizing:border-box;padding:14px 16px;margin:4px 0 10px;background:#222528;color:#f4f0e8;border:1px solid #77705f;border-radius:8px;font:inherit;letter-spacing:.04em;";
  const submit=document.createElement("button");
  submit.className="answer";submit.textContent="SUBMIT ACCESS CODE";
  const hintButton=document.createElement("button");
  hintButton.className="plain";hintButton.textContent="NEED A CLUE?";hintButton.style.cssText="display:none;margin-top:12px;";
  const hintText=document.createElement("p");
  hintText.style.cssText="display:none;margin:12px 0;color:#c5a66b;font-size:1.1rem;letter-spacing:.22em;font-weight:700;";
  hintText.textContent="MO";
  const checkCode=()=>{
   if(answered||done[i])return;
   if(isCloseSongTitle(input.value)){
    answered=true;input.disabled=true;submit.disabled=true;hintButton.style.display="none";
    $("feedback").textContent=hintUsed
      ?"You found it with a little help. The memory is yours either way. ❤️"
      :"Perfect memory. You remembered the song without a clue. ❤️";
    $("unlock").disabled=false;
   }else{
    $("feedback").textContent="Not quite. Take another moment with the memory. ❤️";
   }
  };
  submit.addEventListener("click",checkCode);
  input.addEventListener("keydown",e=>{if(e.key==="Enter")checkCode();});
  hintButton.addEventListener("click",()=>{
   if(answered||done[i])return;
   const proceed=window.confirm("A LITTLE WARNING\n\nAre you sure you need a clue?\n\nOnce you reveal the hint, you won't receive the perfect-memory message. Think carefully before proceeding!\n\nOK = REVEAL HINT   |   Cancel = GO BACK");
   if(!proceed)return;
   hintUsed=true;hintButton.disabled=true;hintText.style.display="block";
   hintButton.textContent="CLUE REVEALED";
  });
  $("answers").append(input,submit,hintButton,hintText);
  if(!done[i]){
   hintTimer=setTimeout(()=>{if(!answered&&!done[i])hintButton.style.display="inline-block";},10000);
  }
 }else if(i===1){
  case2Stage=0;
  const stages=[
   {name:"STAGE 1 — THE NIGHT OUT",story:"It was our first best night out — a little shopping, some time together, and memories I still love looking back on.\n\nI still remember how beautiful you looked that evening. I pictured you wearing those jimmikis, and you looked so good. ❤️",question:"Where did we go that night?",answer:"LULU",hint:"It was December 2024.\nCheck your highlights. 😉",placeholder:"Enter the place"},
   {name:"STAGE 2 — THE FIRST TASTE",story:"After a little shopping, we stopped somewhere to grab a bite.\n\nThat day, you got to try something new for the very first time. Well, you weren't exactly planning to try it… I had to convince you (or maybe push you a little 😭).\n\nIt wasn't exactly love at first bite, but it became a memory worth keeping!",question:"What was the dish you tried for the first time that day?",answer:"KALAKI",hint:"It's made with eggs, and its name sounds a little unusual. 😉",placeholder:"Enter the dish"}
  ];
  const renderStage=()=>{
   const st=stages[case2Stage];
   $("kicker").textContent=st.name;$("story").textContent=st.story;$("question").textContent=st.question;
   $("answers").innerHTML="";$("feedback").textContent="";$("unlock").disabled=true;
   const input=document.createElement("input");input.type="text";input.autocomplete="off";input.spellcheck=false;input.placeholder=st.placeholder;
   input.style.cssText="width:100%;box-sizing:border-box;padding:14px 16px;margin:4px 0 10px;background:#222528;color:#f4f0e8;border:1px solid #77705f;border-radius:8px;font:inherit;letter-spacing:.04em;";
   const submit=document.createElement("button");submit.className="answer";submit.textContent="SUBMIT ANSWER";
   const help=document.createElement("button");help.className="plain";help.textContent="LITTLE HELP";help.style.cssText="display:none;margin-top:12px;";
   const hint=document.createElement("p");hint.className="feedback";hint.style.cssText="display:none;white-space:pre-line;color:#c5a66b;";hint.textContent=st.hint;
   const check=()=>{
    if(answered||done[i])return;
    const kind=case2Stage===0?"lulu":"kalaki";
    if(isAcceptedAnswer(input.value,kind)){
     answered=true;input.disabled=true;submit.disabled=true;help.disabled=true;
     if(case2Stage===0){$("feedback").textContent="One memory unlocked. Ready for the next part? ❤️";const next=document.createElement("button");next.className="gold";next.textContent="CONTINUE TO STAGE 2 ↗";next.style.marginTop="12px";next.addEventListener("click",()=>{case2Stage=1;answered=false;renderStage();});$("answers").appendChild(next);}
     else{$("feedback").textContent="That's it! You made it through the night out. ❤️";$("unlock").disabled=false;}
    }else{$("feedback").textContent="Not quite. Think back to that evening. ❤️";}
   };
   submit.addEventListener("click",check);input.addEventListener("keydown",e=>{if(e.key==="Enter")check();});
   help.addEventListener("click",()=>{
    if(answered||done[i])return;
    const proceed=window.confirm("A LITTLE WARNING\n\nAre you sure you need a clue?\n\nOnce you reveal the hint, try to solve the stage with the help provided.\n\nOK = REVEAL HINT   |   Cancel = GO BACK");
    if(!proceed)return;
    hint.style.display="block";help.disabled=true;help.textContent="CLUE REVEALED";
   });
   $("answers").append(input,submit,help,hint);
   if(!done[i]){
    case2HintTimer=setTimeout(()=>{if(!answered&&!done[i])help.style.display="inline-block";},10000);
   }
  };
  renderStage();
 }else if(i===2){
  case3Stage=0;
  const stages=[
   {name:"STAGE 1 — PLAYER ONE",story:"Every great gaming story has a beginning. Ours started with two players, one console, and a battle neither of us would forget.",question:"What was the gaming console we played on that day?",type:"text",answer:"PS5",hint:"It's Sony's fifth-generation PlayStation console. 😉",placeholder:"Enter the console"},
   {name:"STAGE 2 — VERSUS MODE",story:"Two players entered the battle. One was confident, the other was still figuring out the controls. And then the real competition began!",question:"Which game did we play against each other during our first PS5 experience?",options:["FIFA","Tekken 11","Mortal Kombat","WWE 2K"],correct:1,hint:"It's the second one. 😉"},
   {name:"STAGE 3 — UNDEFEATED",story:"One player kept collecting victories. The other had a very expressive way of handling defeat. 😂",question:"What happened whenever Player One won a match?",options:["She celebrated with you","She activated friendly rage mode. 😂","She asked for a rematch","She switched off the console"],correct:1,hint:"Victory wasn't the only thing making noise that day. 😂"}
  ];
  const renderStage=()=>{
   answered=false;
   const st=stages[case3Stage];
   if(case3HintTimer){clearTimeout(case3HintTimer);case3HintTimer=null;}
   $("kicker").textContent=st.name;$("story").textContent=st.story;$("question").textContent=st.question;
   $("answers").innerHTML="";$("feedback").textContent="";$("unlock").disabled=true;
   const help=document.createElement("button");help.className="plain";help.textContent="LITTLE HELP";help.style.cssText="display:none;margin-top:12px;";
   const hint=document.createElement("p");hint.className="feedback";hint.style.cssText="display:none;white-space:pre-line;color:#c5a66b;";hint.textContent=st.hint;
   help.addEventListener("click",()=>{if(answered||done[i])return;const proceed=window.confirm("A LITTLE WARNING\n\nAre you sure you need a clue?\n\nThink carefully before proceeding!\n\nOK = REVEAL HINT   |   Cancel = GO BACK");if(!proceed)return;hint.style.display="block";help.disabled=true;help.textContent="CLUE REVEALED";});
   if(st.type==="text"){
    const input=document.createElement("input");input.type="text";input.autocomplete="off";input.spellcheck=false;input.placeholder=st.placeholder;
    input.style.cssText="width:100%;box-sizing:border-box;padding:14px 16px;margin:4px 0 10px;background:#222528;color:#f4f0e8;border:1px solid #77705f;border-radius:8px;font:inherit;letter-spacing:.04em;";
    const submit=document.createElement("button");submit.className="answer";submit.textContent="SUBMIT ANSWER";
    const check=()=>{if(answered||done[i])return;if(isAcceptedAnswer(input.value,"ps5")){answered=true;input.disabled=true;submit.disabled=true;help.disabled=true;$("feedback").textContent="That's it! Player One is ready. 🎮";const next=document.createElement("button");next.className="gold";next.textContent="CONTINUE TO STAGE 2 ↗";next.style.marginTop="12px";next.addEventListener("click",()=>{case3Stage=1;renderStage();});$("answers").appendChild(next);}else{$("feedback").textContent="Not quite. Think back to our first gaming session. ❤️";}};
    submit.addEventListener("click",check);input.addEventListener("keydown",e=>{if(e.key==="Enter")check();});$("answers").append(input,submit,help,hint);
   }else{
    let selected=-1;
    const choices=[];
    st.options.forEach((option,j)=>{const b=document.createElement("button");b.type="button";b.className="answer";b.textContent=String.fromCharCode(65+j)+". "+option;b.addEventListener("click",()=>{if(answered||done[i])return;selected=j;choices.forEach((choice,k)=>{choice.style.borderColor=k===j?"#c5a66b":"";choice.style.background=k===j?"rgba(197,166,107,.14)":"";});$("feedback").textContent="";});choices.push(b);$("answers").appendChild(b);});
    const submit=document.createElement("button");submit.className="gold";submit.textContent="SUBMIT ANSWER";submit.style.marginTop="10px";
    submit.addEventListener("click",()=>{if(answered||done[i])return;if(selected<0){$("feedback").textContent="Choose an answer first. ❤️";return;}if(selected===st.correct){answered=true;submit.disabled=true;choices.forEach(b=>b.disabled=true);help.disabled=true;if(case3Stage===1){$("feedback").textContent="Correct! The battle is getting serious. 😂";const next=document.createElement("button");next.className="gold";next.textContent="FINAL ROUND ↗";next.style.marginTop="12px";next.addEventListener("click",()=>{case3Stage=2;renderStage();});$("answers").appendChild(next);}else{$("feedback").textContent="Friendly rage mode confirmed. 😂❤️";$("unlock").disabled=false;}}else{$("feedback").textContent="Not quite. Give it another try. ❤️";}});
    $("answers").append(submit,help,hint);
   }
   if(!done[i])case3HintTimer=setTimeout(()=>{if(!answered&&!done[i])help.style.display="inline-block";},10000);
  };
  renderStage();
 }else{
  c.answers.forEach((a,j)=>{let x=document.createElement("button");x.className="answer";x.textContent=a;x.addEventListener("click",()=>{if(answered||done[i])return;if(j===c.correct){answered=true;x.classList.add("correct");$("feedback").textContent=c.feedback;$("unlock").disabled=false;}else{x.classList.add("wrong");$("feedback").textContent="Not quite. Think about that memory again. ❤️";setTimeout(()=>{x.classList.remove("wrong");$("feedback").textContent="";},850);}});$("answers").appendChild(x);});
 }
}
$("unlock").addEventListener("click",()=>{if(hintTimer){clearTimeout(hintTimer);hintTimer=null;}if(case3HintTimer){clearTimeout(case3HintTimer);case3HintTimer=null;}let c=CONFIG.chapters[current];done[current]=true;update();$("photoLabel").textContent=c.photoLabel;$("revealTitle").innerHTML=current===1?"A night<br><em>to remember.</em>":["Remember<br><em>this evening?</em>","A photo<br><em>to keep.</em>","Player Two<br><em>forever.</em>"][current];$("revealText").textContent=c.reveal;let frame=$("photo");frame.style.backgroundImage=`url('${c.photo}')`;frame.querySelector("span").style.display="block";let img=new Image();img.onload=()=>frame.querySelector("span").style.display="none";img.onerror=()=>frame.style.backgroundImage="";img.src=c.photo;show("reveal");});
document.querySelectorAll('[data-show="map"]').forEach(b=>b.addEventListener("click",()=>{update();if(done.every(Boolean)){buildVault();show("vault");}}));
function buildVault(){let v=$("vaultCards");v.innerHTML="";CONFIG.chapters.forEach((c,i)=>{let a=document.createElement("article");a.innerHTML=`<b>MEMORY 0${i+1}</b><h3>${["The Lake","The Journey","Player Two"][i]}</h3><p>${c.reveal}</p>`;v.appendChild(a);});}
const originalShow=show;document.querySelectorAll('[data-show="letter"]').forEach(b=>b.addEventListener("click",buildVault));
$("sound").addEventListener("click",async()=>{let a=$("music");try{if(a.paused){await a.play();$("sound").textContent="● SOUND ON";}else{a.pause();$("sound").textContent="● SOUND OFF";}}catch(e){$("sound").textContent="● ADD MUSIC.MP3";}});
update();
