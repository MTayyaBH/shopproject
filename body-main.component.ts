import { jsDocComment } from '@angular/compiler';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { CoreService } from 'src/app/core.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-body-main',
  templateUrl: './body-main.component.html',
  styleUrls: ['./body-main.component.css']
})
export class BodyMainComponent implements AfterViewInit {
  ngAfterViewInit(): void {
  }

  userdata: any
  isuserlogin: boolean = false

  chequelogin() {
    this.userdata = this.decryptStoredData();
    if (this.userdata) {
      this.isuserlogin = true;
    } else {
      this.isuserlogin = false;
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

  constructor(private message: NzMessageService, public coreService: CoreService) { }

  generateRandomId(length: number): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-';
    let randomId = ''
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      randomId += charset[randomIndex];
    }
    return randomId;
  }
  randomId = this.generateRandomId(30); // Change 10 to whatever length you desire

  array = [1, 2, 3, 4];
  effect = 'scrollx';
  quoteuser: any[] = []
  quote: any = {}
  dataany: any
  response:boolean=true
  ngOnInit() {
    this.startAnimation();
    this.startBackgroundSlider();
    this.getusername();
    this.startAnimation();
    this.chequelogin();


    this.coreService.getUserquote().subscribe((data) => {
      this.dataany = data
      // console.log(this.dataany)
    })

    setInterval(() => {
      if (this.Quotesubmit === true) {
        this.createMessage('error', 'Plese fill all blank corectly,')
        this.Quotesubmit = false
      }

    }, 10000)
  }

  Quotesubmit: boolean = false
  errors: string[] = [];
  validateQuote(): { isValid: boolean; errors?: string[] } {
    this.errors = [];
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.quote.name || this.quote.name.length <= 3) {
      this.errors.push("Name must be at least 4 characters long.");
    }
    if (!this.quote.number) {
      this.errors.push("Number is required.");
    }
    if (!this.quote.email || !emailPattern.test(this.quote.email)) {
      this.errors.push("Please enter a valid email address.");
    }
    if (!this.quote.select) {
      this.errors.push("Please make a selection.");
    }
    if (!this.quote.message || this.quote.message.length <= 3) {
      this.errors.push("Message must be at least 4 characters long.");
    }

    return this.errors.length > 0 ? { isValid: false, errors: this.errors } : { isValid: true };
  }

  storeUserQuote(): void {
    this.Quotesubmit = true;
    const validation = this.validateQuote();
    if (!validation.isValid) {
      validation.errors?.forEach((error: string) => this.createMessage('error', error));
      this.Quotesubmit = false;
      return;
    }

    this.coreService.postUserquote(this.quote).toPromise()
      .then(data => {
        if (data) {
          this.createMessage('success', 'Data has been submitted successfully.');
        } else {
          this.createMessage('error', 'No data received, something went wrong.');
        }
      })
      .catch(error => {
        this.createMessage('error', 'An error occurred while submitting your data.');
      })
      .finally(() => {
        this.Quotesubmit = false;
        this.quote = {}; // Reset the quote object
      });
  }




  createMessage(type: string, message: any): void {
    if (type === 'success') {
      this.message.create(type, `${message} `);
    } else if (type === 'error') {
      this.message.create(type, `${message} `);
    }

  }
  startAnimation() {
    const spans = document.querySelectorAll('.heading .spanheading');
    spans.forEach((span, index) => {
      span.classList.add('animate');

    });
  }

  backgroundImages: string[] = [
    "https://png.pngtree.com/background/20230614/original/pngtree-many-people-in-a-crowded-shopping-mall-picture-image_3520865.jpg",
    "https://images.pexels.com/photos/2954405/pexels-photo-2954405.jpeg?cs=srgb&dl=pexels-tuur-tisseghem-2954405.jpg&fm=jpg",
    "https://wallpapers.com/images/hd/mall-in-dubai-second-largest-shopping-center-1hn9kze2e98pgh8p.jpg",
    "https://wallpapers.com/images/hd/shopping-mall-1920-x-1080-background-d6fhr7xujf8hx3eb.jpg",
    "https://images.unsplash.com/photo-1533481405265-e9ce0c044abb?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFsbHxlbnwwfHwwfHx8MA%3D%3D",
    "https://c1.wallpaperflare.com/preview/811/698/356/night-shopping-mall-light-lights.jpg"

  ];
  // currentBgIndex: number = 1;
  backgroundUrl: string = 'https://png.pngtree.com/background/20230614/original/pngtree-many-people-in-a-crowded-shopping-mall-picture-image_3520865.jpg';
  startBackgroundSlider(): void {
    let currentIndex: number = 0;
    const changeBackground = (): void => {
      this.backgroundUrl = this.backgroundImages[currentIndex];
      currentIndex = (currentIndex + 1) % this.backgroundImages.length;
    };
    changeBackground();
    setInterval(changeBackground, 6000);
  }

  array2 = [1, 2];
  dotPosition = 'bottom';
  logout() {
    localStorage.removeItem('encryptedData')
    sessionStorage.removeItem('encryptedData')
    this.isuserlogin = false
    this.createMessage('success', 'Logout success');
    this.username = 'Your Name';
  }
  username: any = 'Your Name'
  signupdata: any
  getusername(): void {
    try {
      this.coreService.getsignupdata().subscribe((res) => {
        if (res) {
          setTimeout(() => {
            this.response=false
          }, 500);
        }
        this.signupdata = res;
        let user = this.signupdata?.find((item?: { email?: any; }) => item?.email?.toLowerCase() === this.userdata?.email?.toLowerCase());
        if (user && user.userName) {
          this.username = user.userName;
          // console.log(this.username);

        } else {
          console.error('No user found with the email:', this.userdata.email);
          this.username = 'Your Name';
        }
      });

    } catch (error) {
      console.error('An error occurred:', error);
      this.username = 'Your Name';
    }
  }
 

}
