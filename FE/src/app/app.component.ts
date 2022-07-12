import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { FormBuilder, FormGroup } from '@angular/forms';

interface DataObject {
  randomChars: string[][];
  code: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // interval control var
  apiRequestInterval!: ReturnType<typeof setInterval>;
  // data request control flag
  isRequestingData: boolean = false;
  // input and bias control vars
  isInputDisabled: boolean = true;
  countToInputDisabled: number = 0;
  isAChar: boolean = true;
  bias!: string;
  // bias form group
  biasForm!: FormGroup;
  // generated code
  code!: string;
  // table data container
  randomChars: String[][] = [
    ['', '', '', '', '', '', '','','',''],
    ['', '', '', '', '', '', '','','',''],
    ['', '', '', '', '', '', '','','',''],
    ['', '', '', '', '', '', '','','',''],
    ['', '', '', '', '', '', '','','',''],
    ['', '', '', '', '', '', '','','',''],
    ['', '', '', '', '', '', '','','',''],
    ['', '', '', '', '', '', '','','',''],
    ['', '', '', '', '', '', '','','',''],
    ['', '', '', '', '', '', '','','','']
  ];

  constructor(
    private _api: ApiService,
    private formBuilder: FormBuilder
  ) {}

  // form initialization
  ngOnInit() {
    this.biasForm = this.formBuilder.group({
      bias: ''
    });

    this.onChanges();
  }

  // form changes detection
  onChanges() {
    // bias input validator
    this.biasForm.get('bias')?.valueChanges.subscribe(val => {
      // if is unique valid char
      if (/^[a-zA-Z]+$/.test(val) && val.length === 1) {
        this.bias = val;
        this.isAChar = true;
        // stop current generation interval and start new one with bias
        clearInterval(this.apiRequestInterval);
        this.apiRequestInterval = setInterval(() => this.getData(val), 2000);
        this.isInputDisabled = true;
      // if is empty string
      } else if(val === ''){
        this.bias = '';
        // stop current generation interval and start new one with no bias
        clearInterval(this.apiRequestInterval);
        this.apiRequestInterval = setInterval(() => this.getData(), 2000);
        this.isInputDisabled = true;
        // keep app running
        this.isAChar = true;
      }
      // if is invalid char
      else {
        // stop current generation and resets flags
        this.bias = '';
        this.isRequestingData = false;
        clearInterval(this.apiRequestInterval);
        this.isAChar = false;
        this.isInputDisabled = true;
      }
    });
  }

  // start and stop grid generation (main execution) on button click
  generateGrid() {
    // reset bias form
    this.biasForm.get('bias')?.reset();
    // if grid generation is not running
    if(!this.isRequestingData){
      this.isInputDisabled = false;
      this.isRequestingData = true;
      this.isAChar  = true;
      // start generation interval with no bias
      this.apiRequestInterval = setInterval(() => this.getData(), 2000);
    // if grid generation is is running
    } else {
      // stop grid generation
      this.bias = '';
      this.isRequestingData = false;
      this.isInputDisabled = true;
      clearInterval(this.apiRequestInterval);
    }
  }

  getData(bias?: string) {
    // calculate disablitation of bias input
    if(this.isInputDisabled){
      this.countToInputDisabled++;
      console.log(this.countToInputDisabled);
      if (this.countToInputDisabled === 2) {
        this.isInputDisabled = false;
        this.countToInputDisabled = 0;
      }
    }
    // call to api service
    this._api.getData(bias).subscribe( data => {
      this.randomChars = (data as DataObject).randomChars;
      this.code = (data as DataObject).code;
    });
  }
}


