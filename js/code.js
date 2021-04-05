let countSpan=document.querySelector(".count span");
let Buletts=document.querySelector(".bullets");
let containerBulettsSpans=document.querySelector(".bullets .spans");
let submit=document.querySelector(".submit");
let countTime=document.querySelector(".countTime");
let answerArea = document.querySelector(".answer-area");
let result=document.querySelector(".result");
//Set Option 
let currentIndex=0;
let rightAnswer=0;
let counttimeInterval;
function getQuestion() {
    let myRequest=new XMLHttpRequest();
    myRequest.onreadystatechange=function () {
        if (this.readyState===4 && this.status===200) {
            let questionObject=JSON.parse(this.responseText);
            let qCount=questionObject.length;
            createBullets(qCount);
            console.log(qCount);
            //Shuffel data
            shuffel(questionObject);
            //Add Data by Function
            addQuestionData(questionObject[currentIndex],qCount);

            console.log(questionObject);
            //Start CountTime
            countTimeDown(10,qCount);

            //Click
            submit.onclick= ()=> {
               theRightAnswer=questionObject[currentIndex].right_answer;
                currentIndex++;
                checkAnswer(theRightAnswer,qCount);
                answerArea.innerHTML='';
                addQuestionData(questionObject[currentIndex],qCount);

                // Handle Bullets Class 
                handelOn();
                clearInterval(counttimeInterval);
                countTimeDown(10,qCount);

                showResult(qCount);
            }
        }
    };
    let namefile=["htmlQuestions.json"];

    randomIndex=Math.floor(Math.random()*namefile.length);
    myRequest.open("GET",`${namefile[randomIndex]}`,true);
    myRequest.send();
}




// Crete Spna indepent on num question in json
function createBullets(num) {
    countSpan.innerHTML=num;
    for (let i = 0; i < num; i++) {
       let theBullet=document.createElement("span");
       if (i===0) {
           theBullet.classList.add('on');
       }
       containerBulettsSpans.appendChild(theBullet);
    }
}
getQuestion();

function addQuestionData(obj,count){
    if (currentIndex <  count ) {
   let questionTitle=document.createElement("h2");
   let questionText=document.createTextNode(obj['title']);
        questionTitle.appendChild(questionText);
        answerArea.appendChild(questionTitle);
      
        //Add Answer
        for (let i=1; i<=4; i++) {
        let maindiv=document.createElement("div");
        maindiv.className="answer";            
        //Craeate Radio Input
        let radioInput=document.createElement("input");
        radioInput.type="radio";
        radioInput.id=`answer_${i}`;
        radioInput.name='radio';
        radioInput.dataset.answer=obj[`answer_${i}`]; 
        if (i===1) {
            radioInput.checked=true;
        }   
         //Create Label
        let thelabel=document.createElement("label");
        thelabel.htmlFor=`answer_${i}`;
        let theLabelText=document.createTextNode(obj[`answer_${i}`]);
        thelabel.appendChild(theLabelText);
        maindiv.appendChild(radioInput);
        maindiv.appendChild(thelabel);
        answerArea.appendChild(maindiv);

        }
    }
}

function checkAnswer(rAnswer,count) {
    let answers=document.getElementsByName("radio");
    let theChossenAnswer;
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChossenAnswer=answers[i].dataset.answer;
        }
    }
    if (rAnswer===theChossenAnswer) {
        rightAnswer++;
    }
    
}


function handelOn() {
    let bulettsSpans=document.querySelectorAll(".bullets .spans span");
    let spanArray=Array.from(bulettsSpans);
    spanArray.forEach((span,index)=>{
        if (currentIndex===index) {
            span.className='on';
        }
    });
}

function showResult(count) {
    let theResult;
    if (currentIndex === count) {
        answerArea.remove();
        Buletts.remove();
        submit.remove();
        if (rightAnswer > count/2 && rightAnswer <count ) {
            theResult=`<span class="good"> Is Good  your Rightanswer  ${rightAnswer}     From   ${count} Is Good </span>`;
        }else if (rightAnswer === count) {
            theResult=`<span class="perfect">All answer Is Good </span>`;
        }else{
            theResult=`<span class="bad"> Is Bad your right Answer  ${rightAnswer}  From   ${count} </span>`;
        }
        result.innerHTML=theResult;
    }
}


//Count DownTimer
function countTimeDown(duration,count) {
    if (currentIndex < count) {
        let minutes,seconds;
            counttimeInterval=setInterval(() => {
            minutes=parseInt(duration/60);
            seconds=parseInt(duration%60);
           minutes=minutes<10 ? `0${minutes}` : minutes;
           seconds=seconds<10 ? `0${seconds}` : seconds;
            countTime.innerHTML=`${minutes}:${seconds}`;
                if (--duration < 0) {
                    clearInterval(counttimeInterval);
                    submit.onclick();
                    
                }
        }, 1000);
    }
} 


//Create the Shuffle Function
function shuffel(array) {
    //Setting Vars
    let current=array.length-1,
        temp,
        random;

    while (current>0) { 
        random=Math.floor(Math.random()*current);
        // Save Current 
        temp=array[current];
        //current Element=random Element
        array[current]=array[random];
        // rando Element = Get Element from temp 
        array[random]=temp;
        current--;
    }
    return array;
}