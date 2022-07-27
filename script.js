"use strict";

const date = document.querySelector('.date'); 
const head = document.querySelector('#head'); 
const overlay = document.querySelector('.overlay');
const ul = document.querySelector('.alarm-container');
const popUp = document.querySelector('.form');
const add = document.querySelector('.add');
const mark = document.querySelector('.mark');
const exit = document.querySelector('.cancel');
const inputHours = document.querySelector('.hrs');
const inputMinutes = document.querySelector('.mins');
const alarmAudio = document.querySelector('.alarm-audio');
const zone = document.querySelector('.zone');
let timeString,mad,index;
let alarmArray = [];

date.innerHTML = "00 : 00"

class Alarm{
    id = (Date.now() + '').slice(0,10);
    constructor(Hour,minutes,zone){
        this.Hour = Hour;
        this.minutes = minutes;
        this.zone = zone;
        this.alarmString = `${Hour} : ${minutes} ${zone}` 

    }
}
class App{
    constructor(){
        this._getLocal()
       setInterval(this._displayCurrentTime.bind(this), 1000);
       add.addEventListener('click',this._openPopup)
       exit.addEventListener('click',this._closePopup)
       mark.addEventListener('click',this._addAlarm.bind(this))
    }
    _displayCurrentTime(){
        const time = new Date();
        let hours= ( time.getHours() + '' ).padStart(2, '0');
        const minutes =( time.getMinutes() + '' ).padStart(2, '0');
        const zone = hours >= 12 ? 'PM' : 'AM';

        if (hours >12){
            hours = (hours % 12);
            hours = `${hours}`.padStart(2, '0');
        }

        timeString = `${hours} : ${minutes} ${zone}` 
        this._delete()
        // this._checkAlarms(timeString)
         setInterval( this._checkAlarms(timeString),60000 );
        date.innerHTML = timeString
        // head.innerHTML = "Alarm"
        // this._checkAlarms(timeString);
    }
    _openPopup(){
        popUp.classList.remove('hidden');
        overlay.classList.remove('hidden');

    }
    _closePopup(){
        popUp.classList.add('hidden');
        overlay.classList.add('hidden');

        inputMinutes.value = inputHours.value  = '';
    }
    _addAlarm(e){
        e.preventDefault();
      const  alarmMinutes = inputMinutes.value.padStart(2, '0');
       const alarmHour = inputHours.value.padStart(2, '0');
      const  alarmZone = zone.value
        let newAlarm;
        
        if(alarmHour > 0 && alarmHour <= 12 && alarmMinutes >= 0 && alarmMinutes <= 60){
            newAlarm = new Alarm(alarmHour, alarmMinutes, alarmZone);
            alarmArray.push(newAlarm); 
            
            this._closePopup();
            this._renderAlarm(newAlarm);
            this._local();
        } else 
        { alert("Please enter a valid hour");}
        this._delete();
    }
    _renderAlarm(newAlarm){
        const html = `
        <div class="alarm" data-id="${newAlarm.id}">
            <h1>${newAlarm.alarmString}</h1>
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-trash-fill svg" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
            </svg>          
        </div>
            `
            ul.insertAdjacentHTML('beforeend', html); 
    }
    _checkAlarms(timeString){
        alarmArray.forEach(function(alarm){
            let speech = new SpeechSynthesisUtterance();

            if(alarm.alarmString === timeString){
                alarmAudio.play()
                const eid = `The time is ${alarm.alarmString}`;
                head.innerHTML = eid
                    // let speech = new SpeechSynthesisUtterance();
                    speech.text = eid;
                    speech.pitch=1; speech.volume =1;
                    speech.lang = navigator.language;
                    speech.rate = 1; 
                    speechSynthesis.speak(speech);    
             }else{
                speechSynthesis.cancel(speech);
                alarmAudio.pause();
                head.innerHTML = "Alarm"
             }
        })
    }
    _local(){
        localStorage.setItem('alarmArray', JSON.stringify(alarmArray))
    }
    _getLocal(){
        const alm =JSON.parse(localStorage.getItem('alarmArray'));
        // this.#workouts = work
        if(!alm) return
    
        alarmArray = alm
        alarmArray.forEach(alm => {
        this._renderAlarm(alm);
        })
        this._delete()
    }
    _delete(e){
         mad = document.querySelectorAll('.svg');
        for (let i = 0; i < mad.length; i++){
            mad[i].addEventListener('click',function(){
                const madder = mad[i].parentElement;
                madder.style.display ='none' ;
                index =  alarmArray.findIndex(alarm => alarm.id === madder.dataset.id)
                if(index >= 0){
                    alarmArray.splice(index,1)  
                }
                localStorage.removeItem('alarmArray') ;
                localStorage.setItem('alarmArray', JSON.stringify(alarmArray))
            })
        }   
    }
}

const app = new App();
