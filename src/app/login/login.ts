import { Component } from '@angular/core';

import { FormStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  username = '';
  password = '';
  
  
  onLogin() {
  console.log(this.username, this.password);
  }
}
