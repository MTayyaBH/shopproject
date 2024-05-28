
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, AfterViewInit, Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzCustomColumn } from 'ng-zorro-antd/table';
import { CoreService } from 'src/app/core.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzDrawerPlacement } from 'ng-zorro-antd/drawer';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common.service';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})

export class ShopComponent implements AfterViewInit {
  response:boolean=true
  adminData: any;
  loadertable:boolean=true
  constructor(
    private message: NzMessageService,
    public coreService: CoreService,
    private router: Router, public commonservice: CommonService
  ) { }
  ngAfterViewInit(): void {
    setTimeout(() => {
      
    }, 1000);
    
  }
  items: any
  isuseractesasadmin: boolean = true
  searchValue = '';
  visible = false;
  ngOnInit(): void {
    
    this.chequelogin();
    this.checkIsUserAdmin();

    this.getshpname();
    this.getadmindata();
    
    this.invoiceid = this.generateInvoiceID(6);


  }
 
  invoiceid: any = ''
  fullItem: any
  sortByName() {
    this.items.sort((a: { itemName: string; }, b: { itemName: any; }) => {
      return a.itemName.localeCompare(b.itemName);
    });
  }

  search(): void {
    this.coreService.getitems().subscribe((data) => {
      this.items = data
      const searchValue = this.searchValue.toLowerCase();
      this.items = this.items.filter((item: { itemName: string, Adminid: any }) =>
        item.itemName?.toLowerCase().includes(searchValue) && item.Adminid === this.adminId
      );
    });
  }
  shorting() {
    return this.items.sort()
  }
  itemname(name: any): string {
    name = name.toLowerCase()
    return this.capitalize(name);
  }
  capitalize(str: string): string {
    if (!str) return ''; // Return empty string if input is falsy
    return str.replace(/\b\w/g, (char: string) => char.toUpperCase());
  }
  customername() {
    let name = document.getElementById('customername');
    if (name) {
      name.focus()
    }
  }
  createMessage(type: string, message: any): void {
    if (type === 'success') {
      this.message.create(type, `${message}`);
    } else if (type === 'error') {
      this.message.create(type, `${message}`);
    }

  }
  cardItemArray: any[] = [];
  cardItems: any;
  itemid: any = '';
  itemweight: any = '';
  filtereditemsincard: any = {}
  addItemInCard(itemId: any) {
    this.showModal()
    this.itemid = itemId
  }
  isVisible = false;
  isOkLoading = false;
  showModal(): void {
    this.isVisible = true;
  }

  async handleOk() {
    if (this.itemweight === '') {
      this.createMessage('error', 'Plese enter weight');
      return
    }
    this.isVisible = false;
    try {
      const data = await this.coreService.getitems().toPromise();
      this.cardItems = data;
      const filteredItems = this.cardItems.filter((item: { _id: any; }) => item._id === this.itemid);
      // console.log(filteredItems[0]);
      const filteritem = filteredItems[0]
      if (filteritem.itemType === "Weight") {
        let itempriceperg = filteritem.itemPrice / filteritem.itemWeight
        let giveprice = itempriceperg * this.itemweight
        this.filtereditemsincard = {
          itemName: filteritem.itemName,
          itemWeight: this.itemweight,
          itemType: filteritem.itemType,
          itemPrice: giveprice,
          id: Math.random()
        }
      } else {
        let itempriceperq = filteritem.itemPrice / filteritem.itemWeight
        let giveprice = itempriceperq * this.itemweight
        this.filtereditemsincard = {
          itemName: filteritem.itemName,
          itemWeight: this.itemweight,
          itemType: filteritem.itemType,
          itemPrice: giveprice,
          id: Math.random()
        }
      }
      const itemIndex = this.cardItemArray.findIndex(item => item.itemName.toLowerCase() === this.filtereditemsincard.itemName.toLowerCase());
      if (itemIndex !== -1) {
        this.cardItemArray[itemIndex] = this.filtereditemsincard
      } else {
        this.cardItemArray.push(this.filtereditemsincard);
      }
      this.cardItemArray = this.cardItemArray.filter(item => Math.round(item.itemPrice) !== 0);
      console.log(this.cardItemArray);
      this.checkTotalPrice()
    } catch (error) {
      this.createMessage('error', 'Something went wrong');
    } finally {
      this.createMessage('success', 'Data has been Add');
    }

    this.itemweight = '';

  }

  handleCancel(): void {
    this.isVisible = false;
  }
  totalPrice: any = '0';
  checkTotalPrice() {
    let sumAllPrice = 0;
    for (let i = 0; i < this.cardItemArray.length; i++) {
      const element = this.cardItemArray[i];
      let onePrice = element.itemPrice;
      sumAllPrice += onePrice;
    }
    this.totalPrice = sumAllPrice;
  }
  async deletetableitem(id: any) {
   await this.coreService.deleteitem(id).subscribe((res)=>{
    console.log(res);
    
    });
    this.createMessage('success', 'Data has been deleted');
    this.coreService.getitems().subscribe({
      next: (data) => {
        this.fullItem = data;
        this.items = this.fullItem.filter((item: { Adminid: string }) => item.Adminid === this.adminId);
      },
      error: (err) => {
        console.error('Failed to fetch items', err);
        this.createMessage('error', 'Failed to reload items');
      }
    });
  }
  
  visibledrawer = false;
  placement: NzDrawerPlacement = 'right';
  updateid: any = ''
  updatedate: any = {}
  opendrawer(id: any): void {
    this.visibledrawer = true;
    this.updateid = id
    const filteredItems = this.items.filter((item: { _id: any; }) => item._id === id);
    this.updatedate = filteredItems[0]
  }

  closedrawer() {
    this.visibledrawer = false;
    this.coreService.getitems().subscribe((data) => {
      this.fullItem = data;
      this.items = this.fullItem.filter((item: { Adminid: string }) =>
        item.Adminid === this.adminId
      );
    })
  }
  drawerloader: boolean = false
  size: any = 'large'
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
          this.createMessage('success', 'Data has been');
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
  itempriceadjest(price: number) {
    return `RS : ${Math.round(price)}`
  }
  // chequelogin() {
  //   const ldata = localStorage.getItem('logindata') || null;
  //   const lsdata = sessionStorage.getItem('logindata') || null;
  //   if (ldata) {
  //   } else if (lsdata) {
  //   } else {
  //     this.router.navigate(['/login'])
  //     this.createMessage('error', 'Plese login first');
  //   }
  // }

  shopnameuser: any = 'Your Shop Name'
  shopnameid: any
  signupdata: any
  userdata: any
  isuserlogin: boolean = false
  accountid: any = ''
  getshpname(): void {
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
      this.getitemsonload()
      this.loadertable=false
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
  adminddataid: any = ''
  getadmindata(): void {

    try {
      this.coreService.admindataget().subscribe((res) => {
        this.admindata = res;
        let user = this.admindata?.find((item?: { accountid?: any; }) => item?.accountid === this.shopnameid);
        if (user && user?.accountid) {
          this.fullshopnameuser = this.itemname(user?.shopname)
          this.shopnameuser = this.toInitials(this.itemname(user?.shopname));
          this.assigntoname = user.userName.toUpperCase()
          this.adminddataid = user.accountid
          console.log(this.adminddataid);

          if (this.isuseractesasadmin === false) {
            this.adminId = this.shopnameid
          }
          // this.customer=user?.userName
          // console.log(this.shopnameuser);

        } else {
          // console.error('No user found with the email:', this.userdata.email)
          if (this.isuseractesasadmin === true) {
            this.fullshopnameuser = this.itemname(this.shopnameid)
            this.shopnameuser = this.toInitials(this.itemname(this.shopnameid))
            this.assigntoname = this.customer.toUpperCase()

          } else {
            this.shopnameuser = 'Your Shop Name'
          }
          ;
        }
      });
      this.getitemsonload()
      this.loadertable=false
    } catch (error) {
      console.error('An error occurred:', error);
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
            // console.log(this.adminId);

          } else {
            this.isuseractesasadmin = false;

          }
        },
        error: (error) => {
          this.isuseractesasadmin = false;
        }
      });
      this.getitemsonload()
      this.loadertable=false
    } catch (error) {
      this.isuseractesasadmin = false;
    }
  }
  printDiv() {
    let divContents = document.getElementById('itemlist')?.innerHTML;
    let printWindow = window.open('', '', 'height=400,width=800');
    printWindow?.document.write('<html><head><title>Your List</title>');
    let styles = document.getElementsByTagName('style');
    let links = document.querySelectorAll('link[rel="stylesheet"]');
    let styleHtml = Array.from(styles).map(style => style.outerHTML).join('') +
      Array.from(links).map(link => link.outerHTML).join('');
    printWindow?.document.write('<style>' + styleHtml + '</style>');
    printWindow?.document.write(`
    <style>
      body, html {
        -webkit-print-color-adjust: exact !important; /* Chrome, Safari */
        color-adjust: exact !important;  /* Firefox */
      }
      * {
        background: transparent !important;
        color: #000 !important; /* Black prints by default on many browsers. */
      }
      #orderdiv{
        display: none !important;
      }
      #itemlist {
        width: 33% !important;
        height: 100% !important;
      }
      
      .shopname {
        width: 100% !important;
        padding-top: 1rem !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-around !important;
      }
      
      #headerp {
        height: 40px !important;
        background: linear-gradient(to left, rgb(174, 20, 174), rgb(52, 52, 208)) !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      
      .tcircule {
        display: flex !important;
      }
      
      .circulp {
        width: 50px !important;
        height: 50px !important;
        border-radius: 50% !important;
        background: linear-gradient(to left, rgba(174, 20, 174, 0.417), rgba(52, 52, 208, 0.405)) !important;
      }
      
      .lcircule {
        margin-right: -12px !important;
      }
      
      .rcircule {
        margin-left: -12px !important;
      }
      
      .INVOICE {
        font-size: 50px !important;
        font-weight: 700 !important;
      }
      
      .customardiv {
        display: flex !important;
        flex-direction: column !important;
      }
      
      .cheading {
        font-weight: 600 !important;
        font-size: 10px !important;
        font-family: monospace !important;
      }
      
      .cname {
        font-size: 12px !important;
        font-weight: 600 !important;
        color: rgb(20, 20, 113) !important;
        letter-spacing: 1px !important;
        text-align: start !important;
      }
      
      .lname {
        width: 40px !important;
        margin-top: 1px !important;
        border-bottom: 1px solid rgb(11, 6, 60) !important;
      }
      
      .cinfodiv {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        gap: 2px !important;
        margin-left: 30px !important;
        margin-right: 30px !important;
        margin-top: 40px !important;
      }
      
      .dateheading {
        font-size: 10px !important;
        font-weight: 600 !important;
        text-align: center !important;
      }
      
      .inidname {
        font-size: 10px !important;
        font-weight: 600 !important;
        padding-top: 4px !important;
      }
      
      .asheading{
        font-weight: 800 !important;
        font-size: 10px !important;
        font-family: monospace !important;
        text-align: end !important;
      }
      
      .tablehead{
        text-align: center !important;
        background: linear-gradient(to left, rgb(174, 20, 174), rgb(52, 52, 208)) !important;
        color: white !important;
      }
      
      .tablehead th{
        color: #fff !important;
      }
      .totalpricetd {
        color: #fff !important;
      }
      
      #listtable tr:nth-child(even) {
        background-color: #f2f2f2 !important;
      }
      
      .dvetototalprice{
        color: #fff !important;
        padding-top: 10px !important;
        padding-bottom: 10px !important;
      }
      
      .termsmaindiv{
        display: flex !important;
        justify-content: space-around !important;
        align-items: center !important;
      }
      
      .maincidiv{
        max-width: 200px !important;
      }
      
      .terms-container {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: space-around !important;
        padding: 20px !important;
      }
      
      .terms-content {
        text-align: start !important;
      }
      
      .terms-heading {
        font-size: 12px !important;
        font-weight: 700 !important;
        font-family: Arial, sans-serif !important;
        color: #333 !important;
        margin-bottom: 4px !important;
      }
      
      .terms-info {
        font-size: 10px !important;
        font-family: Arial, sans-serif !important;
        color: #666 !important;
        line-height: 1.5 !important;
        max-width: 250px !important;
      }
      
      .terms-footer {
        margin-top: 20px !important;
        display: flex !important;
        flex-direction: column !important;
      }
      
      .assigned-name {
        font-size: 17px !important;
        font-weight: bold !important;
        color: #333 !important;
      }
      
      .role-description {
        font-size: 10px !important;
        color: #666 !important;
      }
      
    
    </style>
  `);
    printWindow?.document.write('</head><body>');
    printWindow?.document.write(divContents || '');
    printWindow?.document.write('</body></html>');
    printWindow?.document.close();
    printWindow?.focus();
    setTimeout(() => {
      printWindow?.print();
      printWindow?.close();
    }, 100);
  }
  toInitials(fullName: string): string {
    if (!fullName) {
      return '';  
    }
    if (fullName.length > 8) {
      const nameParts = fullName.split(' ');
      const initials = nameParts.map(part => part[0]?.toUpperCase()).join('');  
  
      return initials;
    } else {
      return fullName;
    }
  }
  
  getFormattedDate(): string {
    const date = new Date();
    let day = date.getDate().toString();
    let month = (date.getMonth() + 1).toString();
    let year = date.getFullYear().toString();
    day = day.length < 2 ? '0' + day : day;
    month = month.length < 2 ? '0' + month : month;
    return `${month}-${day}-${year}`;
  }
  generateInvoiceID(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  }
  cardtopnamearray: any[] = []

  cardtopitems() {
    const items = {
      shopname: this.fullshopnameuser,
      customer: this.customer,
      date: this.getFormattedDate(),
      invoiceno: this.invoiceid,
      assignto: this.assigntoname,
      id: this.generateInvoiceID(8),
      useraccountid: this.accountid,
      adminid: this.adminddataid
    }
    this.cardtopnamearray.push(items);

  }
  fullprice: any[] = []
  totalprice() {
    const fullprice = {
      fullprice: this.totalPrice
    }
    this.fullprice.push(fullprice)
  }
  fullcarddata: any[] = []
  status:string='Pending'
  giveorder() {
    if (!this.cardItemArray[0]) {
      this.createMessage('error', 'Please select some things')
      return
    }
    this.totalprice();
    this.cardtopitems();
    this.fullcarddata.push(this.cardtopnamearray, this.cardItemArray, this.fullprice, this.adminId,this.status);
   
    try {
      this.coreService.postcarditems(this.fullcarddata).subscribe((res) => {
        if (res) {
          Swal.fire({
            title: 'Thank You!',
            text: 'Your order has been sent successfully!',
            icon: 'success'
          });
          this.fullcarddata = []
          this.cardItemArray = []
          this.cardtopnamearray = []
          this.fullprice = []
          this.invoiceid = this.generateInvoiceID(6);
        }
      })
    } catch (error) {
      this.createMessage('error', 'Please try again')
    }
  }
  async getitemsonload(){
    await this.coreService.getitems().subscribe((data) => {
      this.items=data
      this.items = this.items.filter((item: { Adminid: string }) =>
        item.Adminid === this.adminId
      );
    });
  }
  ordersend() {
    const swalWithTailwindButtons = Swal.mixin({
      customClass: {
        confirmButton: 'bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded',
        cancelButton: 'bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
      },
      buttonsStyling: true
    });

    swalWithTailwindButtons.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Send It!',
      cancelButtonText: 'No, Cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Call your send order API or function here
        this.giveorder();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Your order has not been sent.',
          icon: 'error'
        });
      }
    });
  }
  savelist(){
    if (!this.cardItemArray[0]) {
      this.createMessage('error', 'Please select some things')
      return
    }
    this.totalprice();
    this.cardtopitems();
    this.fullcarddata.push(this.cardtopnamearray, this.cardItemArray, this.fullprice, this.adminId,this.status);
   
    try {
      this.coreService.post(this.fullcarddata,'SaveCard').subscribe((res) => {
        if (res) {
          this.createMessage('success', 'Data Saved')
          this.fullcarddata = []
          this.cardItemArray = []
          this.cardtopnamearray = []
          this.fullprice = []
          this.invoiceid = this.generateInvoiceID(6);
        }
      })
    } catch (error) {
      this.createMessage('error', 'Please try again')
    }
  }
}

