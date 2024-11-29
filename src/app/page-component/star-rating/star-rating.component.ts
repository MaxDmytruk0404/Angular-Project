import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { DataOperationService } from '../../service/dataOperation/data-operation.service';


@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.css'
})

export class StarRatingComponent implements OnInit{

  @Input() maxRating = 10
  maxRatingArr: any = [];
  @Input() SelectedStar = 0;
  previousSelection = 0;
  @Output() onRating: EventEmitter<number> = new EventEmitter<number>();

  @Input() filmId!: string;

  constructor(private dataOperationServise: DataOperationService) {}

 ngOnInit(): void {
   this.maxRatingArr = Array(this.maxRating).fill(0);
   this.RaitingCheck()
 }

 HandleMouseEnter(index: number) {
  this.SelectedStar = index + 1;
 }

 HandleMouseLeave() {

  if (this.previousSelection!== 0) {
    this.SelectedStar = this.previousSelection;
  } else {
    this.SelectedStar = 0;
  }

 }

 Rating(index: number) {

  this.SelectedStar = index + 1;
  this.previousSelection = this.SelectedStar;
  this.onRating.emit(this.SelectedStar)
  this.addRaitingInServer()

 }

  // Перевірка чи оціненений фільм користувачем 

  RaitingCheck() {

    if (typeof window !== 'undefined' && window.localStorage) {

      const userInfoLocal = localStorage.getItem('userInfo') || '';
      let user = JSON.parse(userInfoLocal);

      if (user !== '') {

        let userStarageInfo;

        // Отримання інформації з бази даних
        this.dataOperationServise.getUserInfo(user.email).subscribe((userData) => {
          userStarageInfo = userData;

          // перевірка чи не пустий масиз з оцінками по фільмам
          if (userStarageInfo?.exists?.films?.length) {
            
            for (let film of userStarageInfo?.exists?.films) {

              if (film.filmId == this.filmId) {

                this.previousSelection = film.raiting
                this.SelectedStar = film.raiting

              } 

            }


          } 

        });

      }

    }

  }

  // додання рейтигу в базу даних

  addRaitingInServer() {

    const newRaiting = {
      filmId: this.filmId,
      raiting: this.previousSelection
    }

    if (typeof window !== 'undefined' && window.localStorage) {

      const userInfoLocal = localStorage.getItem('userInfo') || '';
      let user = JSON.parse(userInfoLocal);

      if (user !== '') {

        let userStarageInfo;
        let filmRaitingFound = false;

        // Отримання інформації з бази даних
        this.dataOperationServise.getUserInfo(user.email).subscribe((userData) => {

          userStarageInfo = userData;

          // перевірка чи не пустий масиз з оцінками по фільмам
          if (userStarageInfo?.exists?.films?.length) {
            
            for (let film of userStarageInfo?.exists?.films) {

              if (film.filmId == this.filmId) {

                film.raiting = this.previousSelection;
                filmRaitingFound = true;
                return 

              } 

            }

            if (filmRaitingFound == false) {

              userStarageInfo.exists.films.push(newRaiting);
              
              this.dataOperationServise.updateData(user.email, userStarageInfo.exists).subscribe((response) => {})
              
            } else {
              
              this.dataOperationServise.updateData(user.email, userStarageInfo).subscribe((response) => {})

            }

          } else {

            userStarageInfo.exists.films.push(newRaiting);

            this.dataOperationServise.updateData(user.email, userStarageInfo.exists).subscribe((response) => {})

          }

        });

      }

    }
 
  }

}
