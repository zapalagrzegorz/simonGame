// @ts-check 

document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    /**
     *  inicjalizacja gry
     */
    (() => {
        
        // selectors
        
        let btnPower = document.querySelector('#btn-power');
        let btnStrict = document.querySelector('#btn-strict');
        let btnEarth = document.querySelector('#btn-earth');
        let btnFire = document.querySelector('#btn-fire');
        let btnWater = document.querySelector('#btn-water');
        let btnWind = document.querySelector('#btn-wind');
        // let btnSounds = [].push(btnEarth, btnFirebtnWater, btnWind)
        let player = {
            movesArr : [],
            playerMovIndex : 0,

            resetMovIndex : function () {
                this.playerMovIndex = 0;
            }
        };
        let computer = {
            currentElement : 0,
            isPerforming : true,
            // jak ponumerować dźwięki np. 0, 0, 0
            soundList : [],
            
            /**
             * odgrywa wybrany dźwięk komputera
             * @param index {Number}
             */ 
            performNextSound : function (index) {
     
                const elementNum = Number.parseInt(this.soundList[index]);
                switch (elementNum) {
                case 0:
                    setActiveElement.call(btnEarth);
                    break;
                case 1:
                    setActiveElement.call(btnFire);
                    break;
                case 2:
                    setActiveElement.call(btnWater);
                    break;
                case 3:
                    setActiveElement.call(btnWind);
                    break;
                }
            }, 

            /**
             * Zwraca liczbę odpowiadającą jednemu z 4 kafelków gry. Numery w zakresie 0-3
             * @returns number 
             */ 
            generateRandom : function () {
                return Math.floor(Math.random() * 4);
            },

            addSound : function () {
                setTimeout( () => {
                    // arrow function przejmuje this z kontekstu otaczającego (poziom wyżej)
                    // this to NADAL object computer
                    // this = object computer

                    this.soundList.push(this.generateRandom());
                    this.performNextSound(this.soundList.length-1);
                    
                    // ponieważ potem zwracam inicjatywę graczowi, resetują jego licznik 
                    player.resetMovIndex();
                }, 1000);
            },

            /**
             * sprawdza czy gracz wygrał
             * dodaje jeden element
             * odrywa dźwięki
             * 
             */
            performAllSounds : function () {
                setTimeout( () => {
                    // arrow function przejmuje this z kontekstu otaczającego (poziom wyżej)
                    // this to NADAL object computer
                    // this = object computer

                    // warunek brzegowy rekurencji -
                    // jeśli kolejka dźwięków nie została wyczerpana wywołaj jeszcze raz

                    // funkcja powinna wywołać wszystkie elementy po kolei i dodać jeden na końcu
                    // TODO
                    // gdy mamy 2 elementy w liście komputera
                    // gracz dwa razy kliknął - to:
                    // 2 < 2 => false
                    // TODO dalej nie powtarza wszystkich dźwiękó
                    if (this.soundList.length === 1) {
                        this.performNextSound(this.currentElement);
                        this.addSound();
                    } else if (this.currentElement < player.playerMovIndex) {
                        this.performNextSound(this.currentElement);
                        this.currentElement++;
                        this.performAllSounds();
                    } else {
                        this.addSound();
                    }
                }, (2500));
            },

            /**
             * playEndDemo
             */
            performEndDemo : function () {

            } 
        };
        // function 

        function setActiveElement () {

            this.classList.add('active');
            let element = this;

            function removeActiveClass (element) {
                element.classList.remove('active');
            }
            // może dla user click źródło dźwięku wziąć z data-sound 
            // TODO sprawdzić arrow function
            console.log('THIS in set ActiveElement - OUTSIDE set timeout' + this);
            setTimeout( () => {
                // this = window
                // wywołujac arrow function - nie można przejąć this przekazanego jako argument CALL lub APPLY
                // MND:Arrow function invoked through call or apply
                // Since arrow functions do not have their own this, the methods call() or apply() can only 
                // pass in parameters. thisArg is ignored. 
                console.log('THIS in set ActiveElement - inside set timeout' + this);
                removeActiveClass(element);
            }, 1000 );
        }

        function init () {
            this.classList.add('active');
            btnEarth.addEventListener('click', playerMove, false);
            btnFire.addEventListener('click', playerMove, false);
            btnWater.addEventListener('click', playerMove, false);
            btnWind.addEventListener('click', playerMove, false);
            // turn off
            // this.removeListener('click', init);
            this.addEventListener('click', turnOff);

            computer.addSound();
        }

        /** 
         * Main run game
         */
        // jeśli odtwarza, to może usunąć eventListener'y z buttonów
        function gamePlay () {
            // czy została odtworzone kolejka?
            if (computer.isPerforming) {
                computer.perform();
            }
            // --nie: dodaj jeden i odegraj dźwięki (jeśli nie jest odegranych 20)
            // --tak: czekam na ruch gracza (dodaj event listenery)  
            // 

        }

        // ruch gracza:
        function playerMove () {
            // czy wybrany odpowiada wartości z kolejki?

            const chosenMove = parseInt(this.dataset.value);
            const desiredMoveValue = computer.soundList[player.playerMovIndex];
            const element = this;

            if (chosenMove === desiredMoveValue) {
                player.playerMovIndex++;
                setActiveElement.call(element);
            }
            // jeśli wybrał źle odegraj od początku
            // else if()
            // ruch komputera, ale bez dodawania elementów
            // if()
            // wybrany ruch przekroczył liczbę dźwięków komputera, inicjatywa wraca do komputera
            if (player.playerMovIndex+1 > computer.soundList.length) {
                
                // oddając inicjatywę komputerowi resetuję jego licznik
                // może funkcja?
                computer.currentElement = 0;
                
                computer.performAllSounds();
            }
            // // sprawdź czy dany dźwięk należy do odpowiada dźwiękowi z listy (numer i wartość)
            // jeśli nie: 
            // (czy jest tryb strict)
            // --tak zacznij od początku  (reset)
            // --nie zacznij odgrywanie rundy
            // playerMoves

            function removeActiveClass (element) {
                element.classList.remove('active');
            }
            // może dla user click źródło dźwięku wziąć z data-sound 
            // TODO sprawdzić arrow function
            setTimeout( () => {
                removeActiveClass(element);
            }, 1000 );
        }

        /**
         * Simulate turning off. Disables all buttons.
         */
        function turnOff () {
            btnEarth.removeEventListener('click', playerMove);
            this.classList.remove('active');
        }
        
        // events
        
        btnPower.addEventListener('click', init);
        // addeventListener podpina samą funkcję, bez obiektu, który posiada daną metodę, wskaźnik 'this' jest wówczas ustawiony na dany element, tu np. playerCircle. 
        // Metoda 'bind': pierwszym argument ustawia wskaźnik 'this' w wywołaniu metody, drugi parametr przekazuje argument dla metody setPlayer 
        // game.elements.playerCircle.addEventListener('click', game.setPlayer.bind(game, 0), false);
        // game.elements.playerCross.addEventListener('click', game.setPlayer.bind(game, 1), false);
        // game.elements.boardFields.forEach((value) => value.addEventListener('click', game.setBoardField.bind(game, 0, 'player'), false));
        // game.elements.finalBox__tryAgain.addEventListener('click', game.replay.bind(game), false);
        // game.elements.modalBox.style.display = 'initial';
        // game.elements.initTextBox.classList.toggle('visible');

    })();
});