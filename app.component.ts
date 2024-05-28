import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CoreService } from './core.service';
import { CommonService } from './common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']

})

export class AppComponent implements OnInit {
  loading: boolean = true
  constructor(
    private message: NzMessageService,
    public coreService: CoreService,
    private router: Router, public commonservice: CommonService
  ) { }
  ngOnInit(): void {
    this.spinerdiv();
  }
  spinerdiv() {
    this.coreService.checkNetworkStatus().subscribe((response) => {
      if (response) {
        setTimeout(() => {
          this.loading = false;
        }, 1000);
        
      } else {
        this.loading = true;
      }
    });
  }

}


