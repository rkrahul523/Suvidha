import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderService } from '../../services/loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],  // Add this line
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  isLoading: Subject<boolean> ;

  constructor(private loaderService: LoaderService) {
    this.isLoading=  this.loaderService.isLoading;
 
  }

  ngOnInit(): void {
    }

}
