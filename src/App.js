/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import './styles.css';

function App() {
  const words = ["tests", "sales", "crane"];

  let [guesses, setGuesses] = useState(0);
  let [feedback, setFeedback] = useState("");
  let [feedbackDisplayed, setFeedbackDisplayed] = useState(false);
  let charPos = 0;
  let currentChar;
  let previousChar;
  let currentGuess;

  let currentWord = "";
  let nonTestedLetters = "";

  let [comment, setComment] = useState("");
  let guessedWord = false;

  let randomWord = words[Math.floor((Math.random() * words.length))];

  let guessedChar = [];
  for(let i = 0; i < randomWord.length; i++){
    guessedChar[i] = false;
  }

  useEffect(() =>{
    window.addEventListener("keyup", e =>{
      setFeedbackDisplayed(false);
      if(guesses < (randomWord.length + 1) && guessedWord === false){
        currentGuess = document.querySelector(`div.guess.\\${guesses + 31}`);
        currentChar = currentGuess.querySelector(`div.char.\\${charPos + 31}`);
        previousChar = currentGuess.querySelector(`div.char.\\${charPos + 30}`) !== null ? currentGuess.querySelector(`div.char.\\${charPos + 30}`) : null;
        
        if(e.key === "Enter" && charPos === randomWord.length && words.includes(currentWord)){
            guesses++;
            setGuesses(guesses);
            charPos = 0;

            if(currentWord === randomWord){
              guessedWord = true;
              document.querySelector(".win-msg-container").classList.add("visible");
              switch(guesses){
                case 1 : 
                  setComment("Amazing"); 
                  break;
                case 2 : 
                  setComment("Incredible"); 
                  break;
                case 3 : 
                  setComment("Great"); 
                  break;
                case 4 : 
                  setComment("Good"); 
                  break;
                case 5 : 
                  setComment("Not bad"); 
                  break;
                case 6 : 
                  setComment("Phew"); 
                  break;
                default : setComment("");
              }
            }

            // checking the correct positions
            for(let i = 0; i < randomWord.length; i++){
              for(let z = 0; z < currentWord.length; z++){
                if(randomWord.charAt(i) === currentWord.charAt(z) && i === z){
                  guessedChar[i] = true;
                  setTimeout(() => {
                    currentGuess.querySelector(`:nth-child(${i + 1})`).classList.add("correct-position");
                  }, (350 * i) + (750 / 2));
                }
              }
            }

            // checking which letters are correct but in incorrect positions
            nonTestedLetters = currentWord;
            for(let i = 0; i < randomWord.length; i++){
              for(let z = 0; z < currentWord.length; z++){
                if(randomWord.charAt(i) === currentWord.charAt(z) && i !== z && guessedChar[i] === false && nonTestedLetters.includes(currentWord.charAt(z))){
                  Array.from(currentGuess.children).forEach((char, index) =>{
                    if(char.innerHTML === randomWord.charAt(i))
                      setTimeout(() => {
                        char.classList.add("correct-letter");
                      }, (350 * index) + (750 / 2));
                  })
                }
              }
              nonTestedLetters = nonTestedLetters.replace(currentWord.charAt(i), "");
            }

            // flipping the characters for the animation
            Array.from(currentGuess.children).forEach((char, index) =>{
              setTimeout(() => {
                char.classList.add("flipped");
              }, index * 350);
            })

            currentWord = "";
        } else if(!(e.key === "Backspace") && /^[a-zA-Z]$/.test(e.key) && charPos < randomWord.length){
            charPos++;
            currentChar.innerHTML = e.key.toLowerCase();
            currentGuess.querySelector(`:nth-child(${charPos})`).classList.add("inputted");
            currentWord += e.key;
        } else if(e.key === "Backspace" && charPos > 0){
            if(previousChar !== null) previousChar.innerHTML = "";
            currentWord = currentWord.slice(0, currentWord.length - 1);
            currentGuess.querySelector(`:nth-child(${charPos})`).classList.remove("inputted");
            charPos--;
        } else if(e.key === "Enter" && charPos < randomWord.length){
          setFeedback("Not enough letters");
          setFeedbackDisplayed(true);
        } else if(!words.includes(currentWord) && e.key === "Enter"){
          setFeedback("Not in word list");
          setFeedbackDisplayed(true);
        }
      }
    });
  }, []);

  return (
    <>
      <nav>
        <div className="switcher-container">
            <button className="theme-switch" onClick={() =>{ 
              if(document.querySelector("body").classList.contains("light")){
                document.querySelector(".theme-switch").innerHTML = '<i class="bi bi-moon"></i>';
              } else{
                document.querySelector(".theme-switch").innerHTML = '<i class="bi bi-brightness-high"></i>';
              }

              document.querySelector("body").classList.toggle("light");
            }}><i className="bi bi-moon"></i></button>
        </div>
        <h2>Wordle</h2>
        <div className="randomizer-container">
          <button className="word-randomizer" onClick={() =>{ }}><i className="bi bi-shuffle"></i></button>
        </div>
      </nav>

      <main className="gamespace">
        {feedbackDisplayed && <div className="feedback">{feedback}</div>}
        { [...Array(randomWord.length + 1)].map((value, guessPos) =>{ // for each character, 1 guess is given plus 1 extra at the end
            return(
              <div className={`guess ${guessPos + 1}`} key={guessPos + 1}>
                { [...Array(randomWord.length)].map((value, charPos) =>{
                    return(
                      <div className={`char ${charPos + 1}`} key={charPos + 1}></div>
                    )
                  }) 
                }
              </div>
            )
          })
        }
        <div className="win-msg-container">
          <div className="win-msg">
            You won in {guesses} {guesses == 1 ? "guess" : "guesses"}
            <div className="comment">{
              [Array.from(comment)].map((commentChar, index) =>{
                return(
                  <div className="comment-character" key={index}>{commentChar}</div>
                );
              })
            }</div>
            <i onClick={() => document.querySelector(".win-msg-container").classList.remove("visible")} className="close bi bi-x-circle"></i>
          </div>
        </div>
      </main>

    </>
  );
}

export default App;
