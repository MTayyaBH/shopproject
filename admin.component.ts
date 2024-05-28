import { Component, OnInit } from '@angular/core';
import { CoreService } from '../core.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { CommonService } from '../common.service';
import { subscribeOn } from 'rxjs';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  ngOnInit() {
    this.chequelogin();
    this.checkIsUserAdmin();
    this.getshpname();
    this.getadmindata();
    this.getDatafulladmindata()

  }
  fulladmindata: any[] = []
  constructor(
    public coreService: CoreService,
    private message: NzMessageService,
    private router: Router, public commonservice: CommonService
  ) { }
  getDatafulladmindata(): void {
    this.coreService.getsignupdata().subscribe({
      next: (data) => {
        const validData = Array.isArray(data) ? data : [];
        this.fulladmindata = validData.filter(item => item.shopname === this.adminId);
      },
      error: (err) => {
        console.error('Failed to fetch data:', err);
        this.fulladmindata = [];
      }
    });
  }


  isuseractesasadmin: boolean = false;
  adminData: any;
  // constructor(private message: NzMessageService, public coreService: CoreService) { }
  items: any = {};
  Quotesubmit: boolean = false
  isvoid: boolean = false;
  voild: any
  submitItem() {
    if (!this.items.itemName || !this.items.itemWeight || !this.items.itemPrice || !this.items.itemType) {
      this.createMessage('error', 'Plese fill all blank');
      return
    }
    if (!this.isvoid) {
      this.Quotesubmit = true; // Set to true when submitting
      this.coreService.getitems().subscribe((data: any) => {
        this.voild = data;
        const itemName = (this.items.itemName || '').toLowerCase();
        if (this.isItemAlreadyExists(itemName)) {
          this.createMessage('error', 'Item already exists');
          this.Quotesubmit = false
        } else {
          this.items = { ...this.items, Adminid: this.adminId }
          this.coreService.postitems(this.items).subscribe((response: any) => {
            if (response) {
              this.createMessage('success', 'Data has been saved');
              this.clearInputs();
            } else {
              this.createMessage('error', 'Something went wrong');
            }
            this.Quotesubmit = false; // Reset to false after action completes
          }, (error: any) => {
            if (error && error.error) {
              this.createMessage('error', 'Server not connected');
            } else if (typeof error === 'string') {
              this.createMessage('error', error);
            } else {
              this.createMessage('error', 'An unknown error occurred');
            }
            this.Quotesubmit = false; // Reset to false after action completes
          });
        }
      }, (error: any) => {
        if (error && error.error) {
          this.createMessage('error', 'Server not connected');
        } else if (typeof error === 'string') {
          this.createMessage('error', error);
        } else {
          this.createMessage('error', 'An unknown error occurred');
        }
        this.Quotesubmit = false; // Reset to false after action completes
      });
    }
  }


  isItemAlreadyExists(itemName: string): boolean {
    return this.voild.some((item: { itemName: string, Adminid: any }) =>
      item.itemName.toLowerCase() === itemName.toLowerCase() && item.Adminid === this.adminId
    );
  }


  clearInputs() {
    this.items = {};
  }

  createMessage(type: string, message: any): void {
    if (type === 'success') {
      this.message.create(type, `${message}`);
    } else if (type === 'error') {
      this.message.create(type, `${message}`);
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
  shopnameuser: any = 'Your Shop Name'
  shopnameid: any
  signupdata: any
  userdata: any
  isuserlogin: boolean = false
  getshpname(): void {
    try {
      this.coreService.getsignupdata().subscribe((res) => {
        this.signupdata = res;
        let user = this.signupdata?.find((item?: { email?: any; }) => item?.email?.toLowerCase() === this.userdata?.email?.toLowerCase());
        if (user && user.userName) {
          this.shopnameid = user.shopname;
          this.customer = this.itemname(user.userName)
          // console.log(this.shopnameid);

        } else {
          // console.error('No user found with the email:', this.userdata.email);
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
      this.chequeusersuperadmin()
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

  admindata: any
  customer: any = 'Your Name'
  getadmindata(): void {

    try {
      this.coreService.admindataget().subscribe((res) => {

        this.admindata = res;
        let user = this.admindata?.find((item?: { accountid?: any; }) => item?.accountid === this.shopnameid);
        if (user && user?.accountid) {

          this.shopnameuser = this.itemname(user?.shopname);
          // this.customer=user?.userName
          // console.log(this.shopnameuser);

        } else {
          // console.error('No user found with the email:', this.userdata.email)
          if (this.isuseractesasadmin === true) {
            this.shopnameuser = this.itemname(this.shopnameid)
          } else {
            this.shopnameuser = 'Your Shop Name'
          }
          ;
        }
      });

    } catch (error) {
      this.shopnameuser = 'Your Shop Name';
    }
  }
  adminId: any
  checkIsUserAdmin(): void {
    try {
      this.coreService.admindataget().subscribe({
        next: (res: any) => {
          this.adminData = res;
          const user = this.adminData.find((item: { email: string; }) => item?.email?.toLowerCase() === this.userdata?.email?.toLowerCase());
          if (user) {
            this.isuseractesasadmin = true;
            this.adminId = user.accountid
            console.log(this.adminId);

          } else {
            this.isuseractesasadmin = false;
            this.router.navigate(['/login'])
          }
        },
        error: (error) => {
          this.isuseractesasadmin = false;
          this.router.navigate(['/login'])
        }
      });
    } catch (error) {
      this.isuseractesasadmin = false;
      this.router.navigate(['/login'])
    }
  }
  visible: boolean = false
  searchValue = '';
  itemid: any = ''
  isVisible: boolean = false
  visibledrawer: boolean = false
  sortByName() {
    this.fulladmindata.sort((a: { email: string; }, b: { email: any; }) => {
      return a.email.localeCompare(b.email);
    });
  }
  addItemInCard(itemId: any) {
    this.showModal()
    this.itemid = itemId
  }
  showModal(): void {
    this.isVisible = true;
  }
  updateid: any = ''
  updatedate: any = {}
  fullItem: any
  drawerloader: boolean = false
  opendrawer(id: any): void {
    this.visibledrawer = true;
    this.updateid = id
    const filteredItems = this.fulladmindata.filter((item: { _id: any; }) => item._id === id);
    this.updatedate = filteredItems[0]
  }
  async deletetableitem(id: any,type:any) {
    this.coreService.updateone(id,type,'accountapple').subscribe(
      (res)=>{
        if (type==='bann') {
          this.createMessage('success', 'Account has been Banned Successfully')
        } else {
          this.createMessage('success', 'Account has been Unbanned Successfully')
        }
        this.getDatafulladmindata()
      },
      (error)=>{
        this.createMessage('error', 'Some error found?')
      }
    )
    // await this.coreService.deletesignupdata(id).subscribe((res) => {
    //   // console.log(res);

    // });
    // this.createMessage('success', 'Data has been deleted');
    // this.coreService.getsignupdata().subscribe((data) => {
    //   const validData = Array.isArray(data) ? data : [];
    //   this.fulladmindata = validData.filter(item => item.shopname === this.adminId);

    // });

  }

  search(): void {
    this.coreService.getsignupdata().subscribe((data) => {
      this.fulladmindata = Array.isArray(data) ? data : [];
      const searchValue = this.searchValue.toLowerCase();
      this.fulladmindata = this.fulladmindata.filter((item: { email: string, accountid: any, shopname: any }) =>
        item.email?.toLowerCase().includes(searchValue) && item.shopname === this.adminId
      );
    });
  }
  closedrawer() {
    this.visibledrawer = false;
    this.coreService.getsignupdata().subscribe((data) => {
      const validData = Array.isArray(data) ? data : [];
      this.fulladmindata = validData.filter(item => item.shopname === this.adminId);
    })
  }
  Update() {
    if (!this.updatedate.itemName || !this.updatedate.itemWeight || !this.updatedate.itemPrice) {
      this.createMessage('error', 'Plese fill all blank inputs');
      return
    }
    this.drawerloader = true
    this.coreService.updateitem(this.updateid, this.updatedate)
      .toPromise()
      .then((DATA) => {
        if (DATA) {
          this.createMessage('success', 'Data has been Added');
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
      .finally(() => {
        this.drawerloader = false;
        this.updatedate = {};
        this.closedrawer()
      });
  }
  Conformpassword: any = ''
  admindatainsert: any = {}
  voildemailpassword: any
  submitAdminData() {
    if (!this.admindatainsert.userName) {
      this.createMessage('error', 'Please enter a name of at least 3 characters.');
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.admindatainsert.email || !emailPattern.test(this.admindatainsert.email)) {
      this.createMessage('error', 'Please enter a valid email address.');
      return;
    }
    if (!this.admindatainsert.password) {
      this.createMessage('error', 'Please enter a password with a minimum length of 4 characters.');
      return;
    }
    if (!this.admindatainsert.shopname) {
      this.createMessage('error', 'Enter Shop Name.');
      return;
    }
    this.admindatainsert = { ...this.admindatainsert, accountid: Math.random() }
    this.coreService.getsignupdata().subscribe((data: any) => {
      this.voildemailpassword = data;
      if (this.isemialAlreadyExists(this.admindatainsert.email)) {
        this.createMessage('error', 'Email Already Exist');
        return
      } if (this.ispasswordAlreadyExists(this.admindatainsert.password)) {
        this.createMessage('error', 'Please make strong password');
      } else {
        this.coreService.postsignupdata(this.admindatainsert)
          .toPromise()
          .then((DATA) => {
            if (DATA) {
              this.createMessage('success', 'Account created successfull');
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
        this.admindatainsert = { ...this.admindatainsert, accountid: Math.random() }
        this.coreService.admindatapost(this.admindatainsert).toPromise()
          .then((DATA) => {
            if (DATA) {
              this.createMessage('success', 'User Admin Now');
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
          .finally(() => {
            this.admindatainsert = {}
          });
      }
    })




  }
  isemialAlreadyExists(email: string): boolean {
    return this.voildemailpassword.some((item: { email: string }) =>
      item.email.toLowerCase() === email.toLowerCase()
    );
  }
  ispasswordAlreadyExists(password: string): boolean {
    return this.voildemailpassword.some((item: { password: string }) =>
      item.password === password
    );
  }
  superadmindata: any
  superadmin: boolean = false
  chequeusersuperadmin() {
    this.coreService.getsuperadmindata().subscribe((res) => {
      this.superadmindata = res
      let user = this.superadmindata?.find((item?: { email?: any; }) => item?.email?.toLowerCase() === this.userdata?.email?.toLowerCase());
      console.log(user);
      
      if (user) {
        this.superadmin = true
      } else {
        this.superadmin = false
      }
    })
  }
}


