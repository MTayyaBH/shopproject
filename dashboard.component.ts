import { ChangeDetectorRef, AfterViewInit, Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzCustomColumn } from 'ng-zorro-antd/table';
import { CoreService } from 'src/app/core.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzDrawerPlacement } from 'ng-zorro-antd/drawer';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common.service';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isCollapsed: boolean = false
  isuseractesasadmin: boolean = false;
  adminData: any;
  isuserlogin: boolean = true;
  userdata: any;
  ngOnInit(): void {
    this.chequelogin()
  }
  constructor(
    private message: NzMessageService,
    public coreService: CoreService,
    private router: Router, public commonservice: CommonService
  ) { }
  chequelogin() {
    this.userdata = this.decryptStoredData();
    if (this.userdata) {
      this.isuserlogin = true;
      this.checkIsUserAdmin()
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
            // console.log(this.adminId);

          } else {
            this.isuseractesasadmin = false;

          }
        },
        error: (error) => {
          this.isuseractesasadmin = false;
        }
      });
    } catch (error) {
      this.isuseractesasadmin = false;
    }
  }
}
