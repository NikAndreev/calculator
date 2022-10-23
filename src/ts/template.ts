export class Calculator {
  calculatorEl
  outputEl
  characters: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.']
  operators: string[][] = [
    ['(', ')'],
    ['*', '/'],
    ['+', '-']
  ]
  inputValue: string = ''
  inputValueArray: string[] = []

  constructor() {
    this.calculatorEl = document.querySelector('[data-calculator]')

    if (this.calculatorEl) {
      this.outputEl = this.calculatorEl.querySelector('[data-output]') as HTMLInputElement
    }

    this.setClickHandler()
    this.setKeydownHandler()
  }

  setClickHandler(): void {
    this.calculatorEl?.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement
      const btn = target.closest('[data-btn]') as HTMLSpanElement

      if (btn && btn.dataset.btn) {
        this.handler(btn.dataset.btn)
      }
    })
  }

  setKeydownHandler(): void {
    document.addEventListener('keydown', (e: KeyboardEvent) => this.handler(e.key.toLowerCase()))
  }

  handler(value: string): void {
    switch (value) {
      case this.characters.concat(...this.operators).find(item => item === value):
        this.addChar(value)
        break
      case 'backspace':
        this.deleteChar()
        break
      case 'clear':
        this.clear()
        break
      case 'enter':
        this.calculate()
        break
    }
  }

  addChar(char: string): void {
    this.inputValue = `${this.inputValue}${char}`
    this.displayValue()
  }

  deleteChar(): void {
    this.inputValue = this.inputValue.substring(0, this.inputValue.length - 1)
    this.displayValue()
  }

  clear(): void {
    this.inputValue = ''
    this.displayValue()
  }

  displayValue(): void {
    if (this.outputEl) {
      this.outputEl.value = this.inputValue
    }
  }

  calculate(): void {
    if (this.inputValue) {
      this.inputValueArray = this.inputValue.split('')

      this.joinNumbers()

      this.doInBrackets(this.inputValueArray)

      this.doMultiplicationAndDivision(this.inputValueArray)

      this.doAdditionAndSubtraction(this.inputValueArray)
      
      this.inputValue = this.inputValueArray.length === 1 ? this.inputValueArray[0] : 'NaN'
      this.displayValue()
    }
  }

  joinNumbers(): void {
    for (let i: number = 0; i < this.inputValueArray.length; i++) {
      if ((this.isNumeric(this.inputValueArray[i]) && this.isNumeric(this.inputValueArray[i + 1])) || (this.inputValueArray[i] === this.operators[2][1] && (!this.isNumeric(this.inputValueArray[i - 1])))) {
        this.inputValueArray[i] += this.inputValueArray[i + 1]
        this.inputValueArray.splice(i + 1, 1)
        i--
      }
    }
  }

  isNumeric(value: string): boolean {
    return isFinite(+value) || value === this.characters[this.characters.length - 1]
  }

  doInBrackets(array: string[], startIndex: number = 0): void {
    for (let i: number = startIndex; i < array.length; i++) {
      if (array[i] === this.operators[0][0]) {
        const bracketsStartIndex: number = i;
        for (let j: number = bracketsStartIndex + 1; j < array.length; j++) {
          
          if (array[j] === this.operators[0][0]) {
            this.doInBrackets(array, j)
          }

          if (array[j] === this.operators[0][1]) {
            const bracketsEndIndex: number = j;
            const subArray: string[] = array.slice(bracketsStartIndex + 1, bracketsEndIndex);
            const indexDifferent: number = bracketsEndIndex - bracketsStartIndex + 1;
            this.doMultiplicationAndDivision(subArray);
            this.doAdditionAndSubtraction(subArray);
            const resultInBrackets: string = subArray[0];
            array.splice(bracketsStartIndex, indexDifferent, resultInBrackets);
            break;
          }
        }
      }
    }
  }

  doMultiplicationAndDivision(array: string[]) {
    for (let i: number = 0; i < array.length; i++) {
      if (this.operators[1].find(operator => operator === array[i])) {
        const a: string = array[i - 1];
        const b: string = array[i + 1];
  
        if (array[i] === this.operators[1][0]) {
          array.splice(i - 1, 3, String(+a * +b));
        } else {
          array.splice(i - 1, 3, String(+a / +b));
        }
  
        i = 0;
      }
    }
  }

  doAdditionAndSubtraction(array: string[]) {
    for (let i: number = 0; i < array.length; i++) {
      if (this.operators[2].find(operator => operator === array[i])) {
        const a: string = array[i - 1];
        const b: string = array[i + 1];
  
        if (array[i] === this.operators[2][0]) {
          array.splice(i - 1, 3, String(+a + +b));
        } else {
          array.splice(i - 1, 3, String(+a - +b));
        }
  
        i = 0;
      }
    }
  }
}

new Calculator()
