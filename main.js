let questionCount = document.querySelector(".count span")
let spansBullets = document.querySelector(".bullets .spans")
let quizArea = document.querySelector(".qiuz-area")
let answerArea = document.querySelector(".answers-area")
let submit = document.querySelector("button")
let bullets = document.querySelector(".bullets")
let results = document.querySelector(".results")
let countdownElement = document.querySelector(".countdown")

let currentIndex = 0
let rightAnswers = 0
let countDownInterval;
function getQuestions(){

    let myRequest = new XMLHttpRequest()

    myRequest.onreadystatechange = function(){
        
        if(this.readyState == 4 && this.status ==200){
            let questionsObject =  JSON.parse(this.responseText)
            let questionsLength = questionsObject.length
            createBulltes(questionsLength)
            addQuestionData(questionsObject[currentIndex], questionsLength); 
            countDown(120,questionsLength)

            submit.onclick = function (){

                let rightAnswer = questionsObject[currentIndex].right_answer;
                
                currentIndex++;

                checkAnswer(rightAnswer,questionsLength)

                quizArea.innerHTML = ""
                answerArea.innerHTML = ""
                addQuestionData(questionsObject[currentIndex], questionsLength); 
                handleBullets() 
                clearInterval(countDownInterval)
                countDown(120,questionsLength)
                showResults(questionsLength)
            }
        }
    }
    myRequest.open("GET","questions.json",true)
    myRequest.send()
}
getQuestions()

function createBulltes(num){
    questionCount.innerHTML = num

    for(i=0;i<num;i++){
        let span = document.createElement("span")

        if(i===0){
            span.className="on"
        }

        spansBullets.appendChild(span)
    }
}

function addQuestionData(obj,count){

    if( currentIndex < count){
        let qTitle = document.createElement("h2")
        let qText = document.createTextNode(obj.title)
    
        qTitle.appendChild(qText)
        quizArea.appendChild(qTitle)
    
        for(i=1;i <= 3;i++){
    
            let mainDiv = document.createElement("div")
            mainDiv.className = `answer`
    
            let radioInput = document.createElement("input")
    
            radioInput.name = "question";
            radioInput.type = "radio";
            radioInput.id = `answer${i}`;
            radioInput.dataset.answer = obj[`answer${i}`]
            if(i ===1){
                radioInput.checked = true
            }
    
            mainDiv.appendChild(radioInput)
            answerArea.appendChild(mainDiv)
    
            let label = document.createElement("label")
            label.htmlFor = `answer${i}`
            let labelText = document.createTextNode(obj[`answer${i}`])
            mainDiv.appendChild(label)
            label.appendChild(labelText)
    
        }
    }

}

function checkAnswer(rAnswer,count){
    
    let answers = document.getElementsByName("question")
    let chosenAnswer;

    for(i=0;i < answers.length; i++){

        if(answers[i].checked){
            chosenAnswer = answers[i].dataset.answer;
        }
    }
    if(rAnswer === chosenAnswer){
        rightAnswers++
        console.log("bravo");
    }


}

function handleBullets(){
    let bulletsSpan = document.querySelectorAll(".bullets .spans span")
    let arrayOfSpans = Array.from(bulletsSpan)
    arrayOfSpans.forEach((bullet,index) => {
        if(currentIndex === index){
            bullet.className = "on"
        }
    });
}

function showResults(count){
    let theResults;
    if(currentIndex === count){
        answerArea.remove()
        quizArea.remove()
        bullets.remove()
        submit.remove()

        if(rightAnswers > count / 2 && rightAnswers < count){
            theResults = `<span class="message good">Good</span>, You Answered ${rightAnswers} of ${count}`
        } else if(rightAnswers ===count){
            theResults = `<span class="message perfect">Perfect</span>, You Answered ${rightAnswers} of ${count}`
        }else{
            theResults = `<span class="message bad">Bad</span>, You Answered ${rightAnswers} of ${count}`
        }
        results.innerHTML = theResults
    }

}
function countDown(duration,count){

    if(currentIndex < count){
        let minutes,seconds;
        countDownInterval = setInterval(function(){
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            minutes = minutes < 10 ? `0${minutes}`:`${minutes}`
            seconds = seconds < 10 ? `0${seconds}`:`${seconds}`
            countdownElement.innerHTML = `${minutes}:${seconds}`
            if(--duration < 0){
                clearInterval(countDownInterval)
                submit.click()
            }
        },1000)
    }

}
