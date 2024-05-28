import { Component, OnInit } from '@angular/core';
import { CoreService } from '../core.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { CommonService } from '../common.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
import { NzDrawerPlacement } from 'ng-zorro-antd/drawer';
import { filter } from 'rxjs';
@Component({
  selector: 'app-accountdetails',
  templateUrl: './accountdetails.component.html',
  styleUrls: ['./accountdetails.component.css']
})
export class AccountdetailsComponent implements OnInit {
  response:boolean=false
  userdata: any;
  isuserlogin: boolean = false;
  constructor(
    public coreService: CoreService,
    private message: NzMessageService,
    private router: Router, public commonservice: CommonService
  ) { }
  ngOnInit(): void {
    this.chequelogin();
    this.getlocation();
    this.getForgotPasswordData();
  }
  forgotpassword:any={}
  chequelogin() {
    this.userdata = this.decryptStoredData();
    if (this.userdata) {
      this.isuserlogin = true;
      this.getusername();
      this.checkIsUserAdmin();
    } else {
      this.isuserlogin = false;
      this.router.navigate(['/login'])
      this.createMessage('error', 'Plese login first');
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
  createMessage(type: string, message: any): void {
    if (type === 'success') {
      this.message.create(type, `${message}`);
    } else if (type === 'error') {
      this.message.create(type, `${message}`);
    }
  }
  profilesource: string = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAiIQQWroPeiSyTrPWVWYHGrXXTdkEZ86ShcOgQn_XXNybck9YtbrZ9JcUrFpTOs3kHPk&usqp=CAU'
  handleImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.encodeImageToBase64(file)
        .then(base64String => {
          this.profilesource = `data:image/png;base64,${base64String}`
          console.log('Base64 encoded image:', base64String);
          this.postImage()
        })
        .catch(error => {
          console.error('Error encoding image:', error);
        });
    }
  }
  encodeImageToBase64(image: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) {
          resolve(base64String);
        } else {
          reject(new Error('Base64 encoding failed'));
        }
      };
      reader.onerror = error => {
        reject(error);
      };
      reader.readAsDataURL(image);
    });
  }
  username: any = 'Your Name'
  signupdata: any
  accountid: any
  shopnameid: any
  userid: any
  useremail: any
  userpassword:any
  getusername(): void {
    try {
      this.coreService.getsignupdata().subscribe((res) => {
        this.signupdata = res;
        let user = this.signupdata?.find((item?: { email?: any; }) => item?.email?.toLowerCase() === this.userdata?.email?.toLowerCase());
        if (user && user.userName) {
          setTimeout(() => {
            this.response=true
          }, 500);
          this.userpassword=user.password
          this.useremail = user.email
          this.userid = user._id
          this.shopnameid = user.shopname;
          this.Usershopname = user.shopname
          this.accountid = user.accountid
          this.username = user.userName;
          this.getCardDetails()
          this.getadmindata()
          this.getImgData()
        } else {
          this.username = 'Your Name';
        }
      });
    } catch (error) {
      this.username = 'Your Name';
    }
  }
  cityName: string = '';
  villageName: string = '';
  fulllocation: string = ''
  getlocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.coreService.getlocation(lat, lng).subscribe((data: any) => {
          if (data) {
            this.response=true
          }
          this.fulllocation = data.display_name
          this.cityName = data.address.country;
          this.villageName = data.address.subdistrict;
        }, (error: any) => {
          console.error('Error getting location:', error);
        });
      }, (error) => {
        console.error('Error getting location:', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  orders: any
  totalOrders: any
  apcorder: any
  pendingorder: any = 0
  completedorder: any = 0
  totalorder: any = 0
  getCardDetails(): void {
    this.coreService.getCardItems().subscribe((res: any[]) => {
      this.totalOrders = res;
      this.orders = this.totalOrders.filter((order: any) => {
        return order['0'] && order['0'][0] && order['0'][0].useraccountid === this.accountid;
      });
      this.apcorder = this.orders
      const pendingOrders = this.apcorder.filter((order: { [x: string]: string; }) => order["4"] === "Pending");
      const completedOrders = this.apcorder.filter((order: { [x: string]: string; }) => order["4"] === "Completed");
      this.pendingorder = pendingOrders.length,
        this.completedorder = completedOrders.length
      this.totalorder = this.orders.length;
    });
  }
  shopnameuser: string = 'Your Shop Name'
  admindata: any
  adminname: any
  fulladmindata: any
  getadmindata(): void {
    try {
      this.coreService.admindataget().subscribe((res) => {
        this.fulladmindata = res
        this.admindata = res;
        let user = this.admindata?.find((item?: { accountid?: any; }) => item?.accountid === this.shopnameid);
        if (user && user.accountid) {
          this.adminname = user.userName
          this.shopnameuser = user.shopname;
        } else {
          this.adminshop = this.shopnameid
          this.shopnameuser = this.shopnameid
          this.adminname = this.username
        }
      });
    } catch (error) {
      console.error('An error occurred:', error);
      this.shopnameuser = 'Your Shop Name';
    }
  }
  namechange() {
    Swal.fire({
      title: "Enter New Name",
      input: "text",
      inputAttributes: {
        autocapitalize: "off"
      },
      showCancelButton: true,
      confirmButtonText: "Change",
      showLoaderOnConfirm: true,
      preConfirm: async (login) => {
        this.changename(login);
      }
    })
  }
  changename(data: any) {
    if (!data || data.length < 3) {
      this.createMessage('error', 'Please enter name correctly');
      return;
    }
    this.coreService.updateusername(this.userid, data).subscribe((res) => {
      if (res) {
        Swal.fire({
          title: 'Congratulations!',
          text: 'Your Name has been changed successfully!',
          icon: 'success'
        });
        this.chequelogin();
      } else {
        Swal.fire({
          title: 'Oops!',
          text: 'Something went wrong!',
          icon: 'error'
        });
      }
    });
    if (this.isuseractasadmin === true) {
      this.coreService.updateone(this.useradminid, data, 'Mainadmindata').subscribe((res) => {
        if (res) {
          this.createMessage('success', 'Data Changed')
        }
      })
    }

  }
  async postImage() {
    try {
      const imageData = {
        photo: this.profilesource,
        useremail: this.useremail
      };
      if (!this.profilesource) {
        console.error('No image data to post or update');
        return;
      }
      let response;
      if (this.userImg) {
        response = await this.coreService.update(this.userImg._id, imageData, 'profile').toPromise();
      } else {
        response = await this.coreService.post(imageData, 'profile').toPromise();
      }
      if (response) {
        const message = this.userImg ? 'Image Updated Successfully' : 'Image Posted Successfully';
        this.createMessage('success', message);
      }
    } catch (error) {
      this.createMessage('error', 'Failed to post or update image');
    }
  }

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
  paragraphs = [
    {
      text: "The  World Shopping Mall is a revolutionary retail destination that brings the globe to your doorstep. Spanning over 1.5 million square feet, this magnificent complex hosts an unprecedented 1,000 stores, 50 restaurants, and 20 entertainment options. From high-end designer flagships to local artisans, every aspect of this mall is designed to evoke the excitement of exploration and discovery.",
      show: true
    },
    {
      text: "As you wander through the mall's expansive corridors, you'll encounter an incredible array of shopping experiences. Discover unique boutiques showcasing international brands, or indulge in the latest trends from Tokyo and New York. Uncover hidden gems in the vintage shops and antique stores, or sample the freshest flavors from around the world at one of the many restaurants.",
      show: false
    },
    {
      text: "But shopping is just the beginning. The mall's entertainment options are equally impressive, with state-of-the-art movie theaters, virtual reality experiences, and live music venues. Meet local artisans and designers, learn traditional crafts and cooking techniques, or simply connect with fellow travelers and locals alike. In this vibrant, inclusive environment, the boundaries of language and culture melt away, and the world comes together in a shared spirit of curiosity and joy.",
      show: false
    }
  ];
  showMoreLimit = 1;

  showMore() {
    this.paragraphs[this.showMoreLimit].show = true;
    this.showMoreLimit += 1;
  }

  adminData: any
  adminId: any
  useradminid: any
  isuseractasadmin: boolean = false
  checkIsUserAdmin(): void {
    try {
      this.coreService.admindataget().subscribe({
        next: (res: any) => {
          this.adminData = res;
          const user = this.adminData.find((item: { email: string; }) => item?.email?.toLowerCase() === this.userdata?.email?.toLowerCase());
          if (user) {
            this.useradminid = user._id
            this.isuseractasadmin = true;
            this.adminId = user.accountid
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
  security() {
    this.visibledrawer = !this.visibledrawer
  }
  visibledrawer: boolean = false
  size: any = 'small'
  placement: NzDrawerPlacement = 'right';
  closedrawer() {
    this.visibledrawer = !this.visibledrawer;
  }
  panels = [
    {
      active: false,
      name: 'Change Your Shop Name',
      disabled: false
    }
  ];
  panels2 = [
    {
      active: false,
      name: 'Forgot Password Setting',
      disabled: false
    }
  ];
  Usershopname: string = ''
  async updateshopname() {
    await this.coreService.updateone(this.userid, this.Usershopname, 'changeshop').subscribe(res => {
      if (res) {
        this.createMessage('success', 'Shop Changed Successfully')
        this.chequelogin();
      }
    })
  }
  adminshop: string = ''
  async adminshopupdate() {
    await this.coreService.updateone(this.userid, this.adminshop, 'changeshop').subscribe(res => {
      if (res) {
        this.coreService.updateone(this.useradminid, this.adminshop, 'changeshopadmin').subscribe(res => {
          if (res) {
            this.createMessage('success', 'Shop Changed Successfully')
            this.chequelogin();
          }
        })
      }
    })

  }

  current = 0;

  index = 1;

  pre(): void {
    this.current -= 1;
    this.changeContent();
  }

  next(): void {
    this.updatePassword();
  }

  done(): void {
    this.updatePassword();
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
  current2 = 0;

  index2 = 1;

  pre2(): void {
    this.current2 -= 1;
    this.changeConten2();
  }

  next2(): void {
    this.forgotpasswordpost()
  }

  done2(): void {
    this.forgotpasswordpost()
  }


  changeConten2(): void {
    switch (this.current2) {
      case 0: {
        this.index2 = 1;
        break;
      }
      case 1: {
        this.index2 = 2;
        break;
      }
      case 2: {
        this.index2 = 3;
        break;
      }
      default: {
        this.index2 = 1;
      }
    }
  }
  editpassword:any={}
  updatePassword() {
    switch (true) {
      case this.current === 0 && !this.editpassword.oldpassword:
        this.createMessage('error', 'Please enter old password');
        break;
  
      case this.current === 0 && this.editpassword.oldpassword !== this.userpassword:
        this.createMessage('error', 'Please enter old password correctly');
        break;
  
      case this.current === 0:
        this.current += 1;
        this.changeContent();
        break;
  
      case this.current === 1 && !this.editpassword.newpassword:
        this.createMessage('error', 'Please enter new password');
        break;
  
      case this.current === 1 && this.editpassword.newpassword.length < 4:
        this.createMessage('error', 'Please enter new password with a minimum length of 4');
        break;
  
      case this.current === 1:
        this.current += 1;
        this.changeContent();
        break;
  
      case this.current === 2 && !this.editpassword.confirmpassword:
        this.createMessage('error', 'Please enter password again for confirmation');
        break;
  
      case this.current === 2 && this.editpassword.newpassword !== this.editpassword.confirmpassword:
        this.createMessage('error', 'Passwords do not match. Please confirm password correctly');
        break;
  
      case this.current === 2:
        if (this.isuseractasadmin===true) {
          this.coreService.updateone(this.userid, this.editpassword.newpassword, 'changepassword').subscribe(res => {
            if (res) {
              this.coreService.updateone(this.useradminid, this.editpassword.newpassword, 'changpasswordadmin').subscribe(res => {
                if (res) {
                  this.createMessage('success', 'Password Changed Successfully')
                  this.chequelogin();
                  this.editpassword={}
                  this.current=0
                  this.changeContent();
                }
              })
            }
          })
        }else{
          this.coreService.updateone(this.userid, this.editpassword.newpassword, 'changepassword').subscribe(res => {
            if (res) {
              this.createMessage('success', 'Password Changed Successfully')
              this.chequelogin();
              this.editpassword={}
              this.current=0
              this.changeContent();
            }
          })
          
        }
        break;
  
      default:
        this.createMessage('error', 'Invalid step');
        break;
    }
  }
  forgotpasswordpost() {
    const showMessage = (message:any) => this.createMessage('error', message);
    const goToNextStep = () => {
      this.current2 += 1;
      this.changeConten2();
    };
  
    switch (true) {
      case this.current2 === 0 && !this.forgotpassword.Fruit:
        showMessage('Please enter Fruit');
        break;
      case this.current2 === 0:
        goToNextStep();
        break;
  
      case this.current2 === 1 && !this.forgotpassword.Vegetable:
        showMessage('Please enter Vegetable');
        break;
      case this.current2 === 1:
        goToNextStep();
        break;
  
      case this.current2 === 2 && !this.forgotpassword.Colour:
        showMessage('Please enter Colour');
        break;
      case this.current2 === 2:
        const data = {
          Fruit:this.forgotpassword.Fruit,
          Vegetable:this.forgotpassword.Vegetable,
          Colour:this.forgotpassword.Colour,
          email: this.userdata.email
        };
        if (this.forgotData) {
          this.coreService.update(this.forgotData._id, data, 'forgotpassword').subscribe(res => {
            if (res) {
              this.createMessage('success', 'Password Security Updated Successfully');
              this.chequelogin();
              this.forgotpassword = {};
              this.current2 = 0;
              this.changeConten2();
                }
          });
        } else {
        this.coreService.post(data, 'forgotpassword').subscribe(res => {
          if (res) {
            this.createMessage('success', 'Password Security Post Successfully');
            this.chequelogin();
            this.forgotpassword = {};
            this.current2 = 0;
            this.changeConten2();
          }
        });
        }
        break;
  
      default:
        showMessage('Invalid step');
        break;
    }
  }
  
  
forgotData:any
getForgotPasswordData() {
  this.coreService.get('forgotpassword').subscribe(
    (res) => {
      this.forgotData=res
      this.forgotData = this.forgotData.find(
        (a: { email: string; }) => a.email.toLowerCase() === this.userdata.email.toLowerCase()
      );
      console.log(this.forgotData);
      this.forgotpassword={
        Colour:this.forgotData.Colour,
        Vegetable:this.forgotData.Vegetable,
        Fruit:this.forgotData.Fruit
      }
    },
    (error) => {
      console.error('Error fetching forgot password data', error);
    }
  );
}


}
