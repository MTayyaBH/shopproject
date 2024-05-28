
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService } from 'src/app/common.service';
import { CoreService } from 'src/app/core.service';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-dashboardhearder',
  templateUrl: './dashboardhearder.component.html',
  styleUrls: ['./dashboardhearder.component.css']
})
export class DashboardhearderComponent implements OnInit{

  togelclick: boolean = false;
  isadmin:any=false
  useradmin:boolean=true
  constructor(
    private message: NzMessageService,
     public coreService: CoreService,
     private router: Router, public commonservice: CommonService
    ) { }
  ngAfterViewInit(): void {
    
  }
  ngOnInit() {
    this.chequelogin();
    this.checkIsUserAdmin();
    this.togelclick = false;
    // this.addAnimation('home');
      this.getshpname();
     
      this.getadmindata();
      
    }
    gotohome(){
      this.router.navigate(['/home'])
    }
admin(){
  this.isadmin=!this.isadmin
}
  
  mobilemenw() {
    this.togelclick = !this.togelclick
  }

//  removeAnimationFromAll() {
//     const elements = document.querySelectorAll('.animation');
//     elements.forEach(element => {
//         element.classList.remove('animation');
//     });
// }
//  addAnimation(elementId:string) {
//     this.removeAnimationFromAll();
//     const element = document.getElementById(elementId);
//     if (element) {
//         element.classList.add('animation');
//     }
// }
shopnameuser:any='Your Shop Name'
shopnameid:any
signupdata:any
userdata:any
isuserlogin:boolean=false
useremail:any
 getshpname():void {
  try {
   this.coreService.getsignupdata().subscribe((res) => {
     this.signupdata = res;
      let user = this.signupdata?.find((item?: { email?: any; }) => item?.email?.toLowerCase() === this.userdata?.email?.toLowerCase());
      if (user && user.userName) {
        this.useremail=user.email
          this.shopnameid = user.shopname;
          this.getImgData()
      } else {
        this.shopnameuser = 'Your Shop Name';
      }
    });

  } catch (error) {
    console.error('An error occurred:', error);
    this.shopnameuser = 'Your Shop Name';
  }
}

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
admindata:any
getadmindata():void {
  try {
   this.coreService.admindataget().subscribe((res) => {
     this.admindata = res;
      let user = this.admindata?.find((item?: { accountid?: any; }) => item?.accountid === this.shopnameid);
      if (user && user.accountid) {
       
        this.shopnameuser = this.itemname(user.shopname);
        // console.log(this.shopnameuser);
        
      } else {
        // console.error('No user found with the email:', this.userdata.email);
        this.shopnameuser = 'Your Shop Name';
        if (this.isuseractasadmin===true) {
          this.shopnameuser=this.itemname(this.shopnameid)
        }
       
      }
    });

  } catch (error) {
    console.error('An error occurred:', error);
    this.shopnameuser = 'Your Shop Name';
  }
}
itemname(name: any): string {
  name = name.toLowerCase()
  return this.capitalize(name);
}
capitalize(str: string): string {
  if (!str) return ''; // Return empty string if input is falsy
  return str.replace(/\b\w/g, (char: string) => char.toUpperCase());
}
adminData:any
adminId:any
isuseractasadmin:boolean=false
checkIsUserAdmin(): void {
  try {
    this.coreService.admindataget().subscribe({
      next: (res: any) => {
        this.adminData = res;
        const user = this.adminData.find((item: { email: string; }) => item?.email?.toLowerCase() === this.userdata?.email?.toLowerCase());
        if (user) {
          this.isuseractasadmin = true;
          this.adminId=user.accountid
          // console.log(this.adminId);
          
        } else {
          this.isuseractasadmin = false;
        }
      },
      error: (error) => {
        this.isuseractasadmin = false;
      }
    });
  } catch (error) {
    this.isuseractasadmin = false;
  }
}
 profilesource: string = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAiIQQWroPeiSyTrPWVWYHGrXXTdkEZ86ShcOgQn_XXNybck9YtbrZ9JcUrFpTOs3kHPk&usqp=CAU'

  fullImgData: any
  userImg: any
  getImgData() {
    this.coreService.get('profile').subscribe((res) => {
      this.fullImgData = res;
      this.userImg = this.fullImgData.find((item: { useremail: string; }) => item.useremail.toLowerCase() === this.useremail.toLowerCase());
      if (this.userImg) {
        this.profilesource = this.userImg.photo;
      } else {
        console.error('Image data for the user not found');
      }
    })
  }
}
