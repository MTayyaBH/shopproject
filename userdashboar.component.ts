import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CoreService } from 'src/app/core.service';
import { Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';

declare var google: any;

@Component({
  selector: 'app-userdashboar',
  templateUrl: './userdashboar.component.html',
  styleUrls: ['./userdashboar.component.css']
})
export class UserdashboarComponent implements OnInit {
  adminData: any;
  constructor(
    private message: NzMessageService,
    public coreService: CoreService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.onloadfunction();

  }
  async onloadfunction() {
    await this.chequelogin();
    this.checkIsUserAdmin();
  }
  // graphdata: any
  // getchartdata() {
  //   this.coreService.getgraphdata(this.adminId).subscribe((res) => {
  //     this.graphdata = res
  //     console.log(res);

  //   })
  // }

  drawChart() {
    this.coreService.getgraphdata(this.adminId).subscribe((res) => {
      const graphdata = res;
      // this.graphdata = res;
      // this.totalorder = Object.keys(graphdata).reduce((acc, key) => {
      //   if (typeof this.graphdata[key] === 'number') {
      //     return acc + this.graphdata[key];
      //   }
      //   return acc;
      // }, 0);
      // this.totalorderpercentage=this.totalorder/100
      // if (this.totalorder===null||this.totalorder===undefined||!this.totalorder) {
      //   this.totalorder=0
      // }
      let entries = Object.entries(graphdata).sort((a, b) => b[1] - a[1]);
      entries = entries.slice(0, 9);
      const data = google.visualization.arrayToDataTable([
        ['Element', 'Orders', { role: 'style' }],
        ...entries.map(([key, value], index) => {
          let color = this.getColorByRank(index, entries.length);
          return [key, value, color];
        })
      ]);
      const view = new google.visualization.DataView(data);
      view.setColumns([
        0,
        1,
        { calc: "stringify", sourceColumn: 1, type: "string", role: "annotation" },
        2
      ]);
      const options = {
        title: 'Daily Orders',
        width: '100%',
        height: 400,
        bar: { groupWidth: '50%' },
        legend: { position: 'none' },
        backgroundColor: 'transparent',
        hAxis: {
          title: 'Element',
          titleTextStyle: { color: 'gray', fontSize: 14 },
          textPosition: 'none'
        },
        vAxis: {
          title: 'Orders With Amount)',
          titleTextStyle: { color: 'gray', fontSize: 14 },
          textStyle: { color: 'gray', fontSize: 12 }
        },
        titleTextStyle: {
          color: 'gray',
          fontSize: 14,
          italic: false
        }
      };
      const chart = new google.visualization.ColumnChart(document.getElementById('barchart_values'));
      chart.draw(view, options);
      window.addEventListener('resize', () => chart.draw(view, options));
    });
  }
  getColorByRank(rank: any, total: any) {
    const ratio = rank / total;
    if (ratio < 0.2) return 'gold';
    else if (ratio < 0.4) return 'silver';
    else if (ratio < 0.6) return 'blue';
    else if (ratio < 0.8) return 'green';
    else return 'red';
  }
  graphdata2: object = {}
  graphdata1: any
  async getPieChartDataAndDraw(): Promise<void> {
    try {
      const res = await this.coreService.getbyid(this.adminId, 'SaveCardbyid').toPromise();
      this.graphdata1 = res;
      this.graphdata2 = this.graphdata1
      const entries = Object.entries(this.graphdata2).sort((a, b) => b[1] - a[1]);
      const topEntries = entries.slice(0, 9);
      const data = new google.visualization.DataTable();
      data.addColumn('string', 'Element');
      data.addColumn('number', 'Orders');
      topEntries.forEach(([key, value]) => {
        data.addRow([key, value]);
      });
      const options = {
        width: '80%',
        height: 300,
        legend: { position: 'none' },
        backgroundColor: 'transparent',
        titleTextStyle: { color: 'rgb(150, 148, 145)' },
        chartArea: { width: '80%', height: '70%' }
      };
      const colors = topEntries.map(([_, value], index) => this.getColorByRank(index, topEntries.length));
      const slices: { [key: number]: { color: string } } = {}; // Explicitly define the type for 'slices'
      topEntries.forEach(([_, value], index) => { // Destructure the 'item' array directly
        slices[index] = { color: colors[index] };
      });
      const chart = new google.visualization.PieChart(document.getElementById('chart_div')!); // Use non-null assertion operator
      chart.draw(data, options);
    } catch (error) {
      console.error("Error fetching or drawing pie chart:", error);
    }
  }






  createMessage(type: string, message: any): void {
    if (type === 'success') {
      this.message.create(type, `${message} `);
    } else if (type === 'error') {
      this.message.create(type, `${message} `);
    }

  }
  isuserlogin: boolean = false
  userdata: any
  adminId: any = ''
  isuseractesasadmin: boolean = false
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
  checkIsUserAdmin(): void {
    try {
      this.coreService.admindataget().subscribe({
        next: (res: any) => {
          this.adminData = res;
          const user = this.adminData.find((item: { email: string; }) => item?.email?.toLowerCase() === this.userdata?.email?.toLowerCase());
          if (user) {
            this.isuseractesasadmin = true;
            this.adminId = user.accountid
          } else {
            this.isuseractesasadmin = false;
            this.router.navigate(['maindashboard/OredrList'])
          }
          google.charts.load('current', { packages: ['corechart'] });
          google.charts.setOnLoadCallback(this.drawChart.bind(this));
          google.charts.setOnLoadCallback(this.getPieChartDataAndDraw.bind(this));
          this.getDatafulladmindata();
        },
        error: (error) => {
          this.isuseractesasadmin = false;
        }
      });
    } catch (error) {
      this.isuseractesasadmin = false;
    }
  }
  fulladmindata: any[] = []
  countviews: number | undefined
  percentageviews: number | undefined
  getDatafulladmindata(): void {
    this.coreService.getsignupdata().subscribe({
      next: (data) => {
        const validData = Array.isArray(data) ? data : [];
        this.fulladmindata = validData.filter(item => item.shopname === this.adminId);
        if (this.fulladmindata) {
          this.countviews = this.fulladmindata.length
          this.percentageviews = Math.round(this.fulladmindata.length / validData.length * 100)
          this.getCardDetails()
        } else {
          this.countviews = 0
          this.percentageviews = this.countviews / 100
        }
      },
      error: (err) => {
        console.error('Failed to fetch data:', err);
        this.fulladmindata = [];
      }
    });

  }
  totalorder: number | undefined
  graphdata: any
  totalorderpercentage: number | undefined
  totalOrders: any
  orders: any
  apcorder: any
  pendingorder: any = 0
  completedorder: any = 0
  pendingper: any = 0
  copmletedper: any = 0
  getCardDetails(): void {
    this.coreService.getCardItems().subscribe((res: any[]) => {
      this.totalOrders = res;
      this.orders = this.totalOrders.filter((order: any) => {
        return order['0'] && order['0'][0] && order['0'][0].adminid === this.adminId;
      });
      this.apcorder = this.orders
      const pendingOrders = this.apcorder.filter((order: { [x: string]: string; }) => order["4"] === "Pending");
      const completedOrders = this.apcorder.filter((order: { [x: string]: string; }) => order["4"] === "Completed");
      this.pendingorder = pendingOrders.length,
        this.completedorder = completedOrders.length

      this.totalorder = this.orders.length;
      this.totalorderpercentage = Math.round(this.orders.length / this.totalOrders.length * 100)
      this.pendingper = Math.ceil(this.pendingorder / this.orders.length * 100)
      this.copmletedper = Math.floor(this.completedorder / this.orders.length * 100)
    });
  }
}
