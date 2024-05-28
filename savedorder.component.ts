import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/core.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzDrawerPlacement } from 'ng-zorro-antd/drawer';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common.service';
import { map } from 'rxjs';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-savedorder',
  templateUrl: './savedorder.component.html',
  styleUrls: ['./savedorder.component.css']
})
export class SavedorderComponent implements OnInit {
  isCollapsed: boolean = false
  isuseractesasadmin: boolean = false;
  adminData: any;
  accountid: any = ''
  isloader: boolean = true
  ngOnInit(): void {
    this.chequelogin();
    this.getshpname();
    this.getadmindata();
    this.checkIsUserAdmin();
  }
  constructor(
    private message: NzMessageService,
    public coreService: CoreService,
    private router: Router, public commonservice: CommonService
  ) { }
  orders: any;
  searchnotfound: boolean = true
  selectsearchdate: any
  totalorders: any
  getcarddetails() {
    this.coreService.get('SaveCard').subscribe((res) => {
      this.totalorders = res;
      if (this.isuseractesasadmin === true) {
        this.orders = this.totalorders.filter((order: any) =>
          order['0'] && order['0'][0] && order['0'][0].useraccountid === this.accountid
        );
        this.sortByDateDescending();
      } else {
        this.orders = this.totalorders.filter((order: any) =>
          order['0'] && order['0'][0] && order['0'][0].useraccountid === this.accountid
        );
        this.sortByDateDescending();
      }
      if (this.orders.length === 0) {
        this.searchnotfound = false;
      } else {
        this.searchnotfound = true;
      }
    }

    );

  }
  sortByDateDescending(): void {
    this.orders.sort((a: { [x: string]: { date: string | number | Date; }[]; }, b: { [x: string]: { date: string | number | Date; }[]; }) => {
      const dateA = new Date(a['0'][0].date);
      const dateB = new Date(b['0'][0].date);
      return dateB.getTime() - dateA.getTime();
    });
  }


  transform(value: any): any {
    return `Rs : ${Math.round(value)}`;
  }
  weightinkg(weight: any, type: any): any {
    if (type === 'Weight') {
      if (weight >= 1000) {
        return `${weight / 1000} (KG)`
      } else {
        return `${weight} (G)`
      }
    } else {
      return `${weight} (QTY)`
    }
  }
  onChange(): void {
    const date = this.selectsearchdate;
    let day = date.getDate().toString();
    let month = (date.getMonth() + 1).toString();
    let year = date.getFullYear().toString();
    day = day.length < 2 ? '0' + day : day;
    month = month.length < 2 ? '0' + month : month;
    const searchdate = (`${month}-${day}-${year}`);
    this.coreService.getCardItemsFilteredByDatesave(searchdate).subscribe({
      next: (data) => {
        this.totalorders = data
        if (this.isuseractesasadmin === true) {
          this.orders = this.totalorders.filter((order: any) =>
            order['0'] && order['0'][0] && order['0'][0].useraccountid === this.accountid
          );
        } else {
          this.orders = this.totalorders.filter((order: any) =>
            order['0'] && order['0'][0] && order['0'][0].useraccountid === this.accountid
          );
        }
        if (this.orders.length === 0) {
          this.searchnotfound = false
        } else {
          this.searchnotfound = true
        }
      },
      error: (err) => console.error(err)

    });

  }
  searchvaluecard: string = ''
  seachcard() {
    this.coreService.getCardItemsFilteredByinvoicesave(this.searchvaluecard).subscribe({
      next: (data) => {

        this.totalorders = data;
        if (this.isuseractesasadmin === true) {
          this.orders = this.totalorders.filter((order: any) =>
            order['0'] && order['0'][0] && order['0'][0].useraccountid === this.accountid
          );
        } else {
          this.orders = this.totalorders.filter((order: any) =>
            order['0'] && order['0'][0] && order['0'][0].useraccountid === this.accountid
          );
        }
        if (this.orders.length === 0) {
          this.searchnotfound = false
        } else {
          this.searchnotfound = true
        }
      },
      error: (err) => console.error(err)
    });

  }

  createMessage(type: string, message: any): void {
    if (type === 'success') {
      this.message.create(type, `${message} `);
    } else if (type === 'error') {
      this.message.create(type, `${message} `);
    }

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
          this.accountid = user.accountid
          console.log(this.accountid);

          this.customer = user.userName.toUpperCase()
          // console.log(this.shopnameid);

        } else {
          console.error('No user found with the email:', this.userdata.email);
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
  assigntoname: any
  fullshopnameuser = 'Your Name'
  getadmindata(): void {

    try {
      this.coreService.admindataget().subscribe((res) => {
        this.admindata = res;
        let user = this.admindata?.find((item?: { accountid?: any; }) => item?.accountid === this.shopnameid);
        if (user && user?.accountid) {
          this.fullshopnameuser = user?.shopname
          this.shopnameuser = user?.shopname;
          this.assigntoname = user.userName.toUpperCase()
          if (this.isuseractesasadmin === false) {
            this.adminId = this.shopnameid
          }
          // this.customer=user?.userName
          // console.log(this.shopnameuser);

        } else {
          // console.error('No user found with the email:', this.userdata.email)
          if (this.isuseractesasadmin === true) {
            this.fullshopnameuser = this.shopnameid
            this.shopnameuser = this.shopnameid
            this.assigntoname = this.customer.toUpperCase()

          } else {
            this.shopnameuser = 'Your Shop Name'
          }
          ;
        }
      });
      this.getcarddetails();
      this.isloader = false
    } catch (error) {
      this.shopnameuser = 'Your Shop Name';
    }
  }
  adminId: any
  singleadmin:any
  async checkIsUserAdmin(): Promise<void> {
    try {
      const res = await this.coreService.admindataget().toPromise();
      this.adminData = res;
      const user = this.adminData.find((item: { email: string; }) => item?.email?.toLowerCase() === this.userdata?.email?.toLowerCase());
      if (user) {
        this.isuseractesasadmin = true;
        this.adminId = user.accountid;
        // console.log(this.adminId);
      } else {
        this.isuseractesasadmin = false;
      }
      this.getcarddetails();
      this.isloader = false;
    } catch (error) {
      console.error("Error checking user admin status:", error);
      this.isuseractesasadmin = false;
    }
  }
  
  async deletetableitem(id: any) {
    await this.coreService.delete(id,'SaveCard').subscribe((res) => {
      console.log(res);
    });
    this.createMessage('success', 'Data has been deleted');
    this.getcarddetails()

  }
  // updatestatus(id: any) {
  //   if (this.isuseractesasadmin===false) {
  //     this.createMessage('error', 'You not have access this');
  //     return
  //   }
  //   this.coreService.updateoredrs(id, 'Completed').subscribe((res) => {
  //     if (res) {
  //       this.createMessage('success', 'Data has been Updated');
  //       this.getcarddetails()
  //     }
  //   })
  // }
  // updatestatuspending(id: any) {
  //   if (this.isuseractesasadmin===false) {
  //     this.createMessage('error', 'You not have access this');
  //     return
  //   }
  //   this.coreService.updateoredrs(id, 'Pending').subscribe((res) => {
  //     if (res) {
  //       this.createMessage('success', 'Data has been Updated');
  //       this.getcarddetails()
  //     }
  //   })
  // }
}

