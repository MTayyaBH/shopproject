import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { CoreService } from '../core.service';
import { Router } from '@angular/router';
import { CommonService } from '../common.service';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  response = true
  voild: any;
  loginId: any = '435433'
  userdata: any;
  constructor(
    private login: NonNullableFormBuilder,
    private signup: NonNullableFormBuilder,
    public coreService: CoreService,
    private message: NzMessageService,
    private router: Router, public commonservice: CommonService
  ) { }
  usersignindata: any
  admindata: any
  isforgot: boolean = false
  ngOnInit(): void {
    this.coreService.getsignupdata().subscribe((data) => {
      this.usersignindata = data
    })
    this.coreService.admindataget().subscribe((data) => {
      this.admindata = data;
    })
    this.loginform.reset();
    this.signupform.reset();
    this.chequelogin();
  }
  logindata: any = {}
  passwordVisible = false
  showpassword = false
  loginform: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
    remember: FormControl<boolean>;
  }> = this.login.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    remember: [false]
  });
  isloaderloader: boolean = false
  submitForm(): void {
    this.isloaderloader = true;

    if (!this.loginform.valid) {
      this.markControlsAsDirty(this.loginform);
      this.isloaderloader = false;
      return;
    }

    this.logindata = {
      ...this.loginform.value,
      loginid: this.generateRandomId(20)
    };
    console.log(this.logindata);

    this.coreService.getsignupdata().subscribe({
      next: (data: any) => {
        this.voild = data;

        if (!this.isItemAlreadyExists(this.logindata.email)) {
          this.createMessage('error', 'Email not found');
          this.isloaderloader = false;
          return;
        }
        const voild = this.voild.filter((items: any) => items.email === this.logindata.email)
        let userdata = voild[0]
        if (userdata.password !== this.logindata.password) {
          this.createMessage('error', 'Incorrect password');
          this.isloaderloader = false;
          return;
        }
        if (userdata.Type === 'bann') {
          this.createMessage('error', 'Your Account Has been banned!');
          this.isloaderloader = false;
          return
        }
        if (this.logindata.remember === false) {
          sessionStorage.removeItem('encryptedData');
          const jsonData = JSON.stringify(this.logindata);
          const encryptedData = CryptoJS.AES.encrypt(jsonData, 'your-secret-key').toString();
          sessionStorage.setItem('encryptedData', encryptedData);

          this.response = false
          setTimeout(() => {

            this.isloaderloader = false;
            this.response = true
            this.router.navigate(['/home'])
            this.createMessage('success', 'Login successful');
          }, 500);

        } else {
          localStorage.removeItem('encryptedData');
          const jsonData = JSON.stringify(this.logindata);
          const encryptedData = CryptoJS.AES.encrypt(jsonData, 'your-secret-key').toString();
          localStorage.setItem('encryptedData', encryptedData);
          this.response = false
          setTimeout(() => {

            this.isloaderloader = false;
            this.response = true
            this.router.navigate(['/home'])
            this.createMessage('success', 'Login successful');
          }, 500);
          // this.coreService.postlogindata(this.logindata).toPromise()
          //   .then((DATA) => {
          //     if (DATA) {
          //       this.createMessage('success', 'Login successful');

          //       this.loginform.reset();
          //       this.router.navigate(['/home'])
          //     } else {
          //       this.createMessage('error', 'Something went wrong');
          //     }
          //   })
          //   .catch((error) => {
          //     this.handleErrorResponse(error);
          //   })
          //   .finally(() => {
          //     this.isloaderloader = false;
          //   });
        }
      },
      error: (error) => {
        this.handleErrorResponse(error);
        this.isloaderloader = false;
      }
    });
  }



  handleErrorResponse(error: any): void {
    if (error.status === 0) {
      this.createMessage('error', 'Server not connected');
    } else if (error.error instanceof ErrorEvent || typeof error.error === 'string') {
      this.createMessage('error', error.error.message || 'Server error occurred');
    } else {
      this.createMessage('error', 'An unknown error occurred');
    }
  }
  markControlsAsDirty(form: FormGroup): void {
    Object.values(form.controls).forEach(control => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  }

  islogin: boolean = true
  issignup: boolean = false
  lognorsignup() {
    this.islogin = !this.islogin
    this.issignup = !this.issignup
    this.loginform.reset();
    this.signupform.reset();
  }
  signupdata: any = {}
  signupform: FormGroup<{
    userName: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    shopname: FormControl<string>;
  }> = this.signup.group({
    userName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}')]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    shopname: ['', [Validators.required, Validators.minLength(3)]],
  });

  submitsignup(): void {
    if (this.signupform.valid) {
      this.signupdata = { ...this.signupform.value, accountid: this.generateRandomId(20) }
      console.log(this.signupdata);
      this.coreService.getsignupdata().subscribe((data: any) => {
        this.voild = data;
        if (this.isItemAlreadyExists(this.signupdata.email)) {
          this.createMessage('error', 'Email Already Exist');
          return
        } if (this.ispasswordAlreadyExists(this.signupdata.password)) {
          this.createMessage('error', 'Please make strong password');
        } else {
          this.coreService.postsignupdata(this.signupdata)
            .toPromise()
            .then((DATA) => {
              if (DATA) {
                this.createMessage('success', 'Account created successfull');
                this.lognorsignup()
              } else {
                this.createMessage('error', 'Something went wrong');
              }
            })
            .catch(error => {
              if (typeof error === 'object' && error.error) {
                this.createMessage('error', 'Server not conected');
              } else if (typeof error === 'string') {
                this.createMessage('error', error);
              } else {
                this.createMessage('error', 'An unknown error occurred');
              }
            })
          this.signupform.reset();
        }
      })

    } else {
      Object.values(this.signupform.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  isItemAlreadyExists(email: string): boolean {
    return this.voild.some((item: { email: string }) =>
      item.email.toLowerCase() === email.toLowerCase()
    );
  }
  ispasswordAlreadyExists(password: string): boolean {
    return this.voild.some((item: { password: string }) =>
      item.password === password
    );
  }
  generateRandomId(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  createMessage(type: string, message: any): void {
    if (type === 'success') {
      this.message.create(type, `${message} `);
    } else if (type === 'error') {
      this.message.create(type, `${message} `);
    }

  }
  chequelogin() {
    this.userdata = this.decryptStoredData();
    if (this.userdata) {
      this.router.navigate(['/home'])
      this.createMessage('error', 'Plese logout first');
    } else {
      this.router.navigate(['/login'])
    }
  }
  decryptStoredData(): any {
    const encryptedDataSession = sessionStorage.getItem('encryptedData');
    const encryptedDataLocal = localStorage.getItem('encryptedData');
    if (encryptedDataSession) {
      const bytes = CryptoJS.AES.decrypt(encryptedDataSession, 'your-secret-key');
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedData;
    }
    if (encryptedDataLocal) {
      const bytes = CryptoJS.AES.decrypt(encryptedDataLocal, 'your-secret-key');
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedData;
    }
    return null;
  }
  islforgot() {
    this.isforgot = !this.isforgot
  }

  forgotpassword: any = {}
  newpassword: string = ''
  forgotemail: string = ''
  confirmpass: string = ''

  sdata: any
  forgotData: any

  current = 0;

  index = 1;

  pre(): void {
    this.current -= 1;
    this.changeContent();
  }

  next(): void {
    this.forgotpasswordpost();
  }

  done(): void {
    this.forgotpasswordpost()

  }

  changeContent(): void {
    switch (this.current) {
      case 0: {
        this.index = 1;
        break;
      }
      case 1: {
        this.index = 2;
        break;
      }
      case 2: {
        this.index = 3;
        break;
      }
      default: {
        this.index = 1;
      }
    }
  }
  forgotpasswordpost() {
    const showMessage = (message: string) => this.createMessage('error', message);
    const goToNextStep = () => {
      this.current += 1;
      this.changeContent();
    };

    switch (this.current) {
      case 0:
        if (!this.forgotemail) {
          showMessage('Please enter your email');
          return
        }
        this.coreService.get('forgotpassword').subscribe(
          (res) => {
            this.forgotData = res
            this.forgotData = this.forgotData.find(
              (a: { email: string; }) => a.email.toLowerCase() === this.forgotemail.toLowerCase()
            );
            if (!this.forgotData) {
              showMessage("Email recovery not add yet!.");
            } else {
              goToNextStep();
            }
          },
          (error) => {
            console.error('Error fetching forgot password data', error);
          }
        );

        break;

      case 1:
        if (!this.forgotpassword.Fruit) {
          showMessage('Please enter a fruit');
        } else if (!this.forgotpassword.Vegetable) {
          showMessage('Please enter a vegetable');
        } else if (!this.forgotpassword.Colour) {
          showMessage('Please enter a colour');
        } else if (
          this.forgotpassword.Colour !== this.forgotData.Colour ||
          this.forgotpassword.Vegetable !== this.forgotData.Vegetable ||
          this.forgotpassword.Fruit !== this.forgotData.Fruit
        ) {
          showMessage('The data you entered does not match our records');
        } else {
          goToNextStep();
        }
        break;

      case 2:
        if (!this.newpassword) {
          showMessage('Please enter a new password');
        } else if (this.newpassword !== this.confirmpass) {
          showMessage('Passwords do not match');
        } else {
          //  if (this.isuseractasadmin===true) {
          //           this.coreService.updateone(this.userid, this.editpassword.newpassword, 'changepassword').subscribe(res => {
          //             if (res) {
          //               this.coreService.updateone(this.useradminid, this.editpassword.newpassword, 'changpasswordadmin').subscribe(res => {
          //                 if (res) {
          //                   this.createMessage('success', 'Password Changed Successfully')
          //                   this.chequelogin();
          //                   this.editpassword={}
          //                   this.current=0
          //                   this.changeContent();
          //                 }
          //               })
          //             }
          //           })
          //         }else{
          this.coreService.get('Signupdata').subscribe(
            (res) => {
              this.sdata = res
              this.sdata = this.sdata.find(
                (a: { email: string; }) => a.email.toLowerCase() === this.forgotemail.toLowerCase()
              );
              this.coreService.updateone(this.sdata._id, this.newpassword, 'changepassword').subscribe(res => {
                if (res) {
                  this.createMessage('success', 'Password Forgot Successfully')
                  this.chequelogin();
                  this.forgotemail = ''
                  this.forgotData = {}
                  this.newpassword = ''
                  this.confirmpass = ''
                  this.current = 0
                  this.changeContent();
                  this.islforgot()
                }
              })
            }
          )


          //         }
        }
        break;

      default:
        showMessage('Invalid step');
        break;
    }
  }

}
